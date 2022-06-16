import http from 'http';
import { HttpException } from '@caviajs/http-exception';
import { Interceptor, Next } from '@caviajs/http-router';
import { getContentTypeMime } from './utils/get-content-type-mime';
import * as url from 'url';
import { ValidationError } from './validation-error';
import iconv from 'iconv-lite';
import { Observable } from 'rxjs';
import { getContentTypeParameter } from './utils/get-content-type-parameter';
import { isSchemaArray, validateSchemaArray } from './schema-array';
import { isSchemaBoolean, validateSchemaBoolean } from './schema-boolean';
import { isSchemaBuffer, validateSchemaBuffer } from './schema-buffer';
import { isSchemaEnum, validateSchemaEnum } from './schema-enum';
import { isSchemaNumber, validateSchemaNumber } from './schema-number';
import { isSchemaObject, validateSchemaObject } from './schema-object';
import { isSchemaStream } from './schema-stream';
import { isSchemaString, validateSchemaString } from './schema-string';
import { Readable } from 'stream';

export class HttpContract {
  public static setup(): Interceptor {
    return async (request: http.IncomingMessage, response: http.ServerResponse, next: Next): Promise<Observable<any>> => {
      const errors: ValidationError[] = [];

      /** request.body **/
      if (request.metadata?.contract?.request?.body) {
        const contentSchema = request.metadata.contract.request.body.contentSchema;
        const contentType = request.metadata.contract.request.body.contentType;

        // The Content-Length header is mandatory for messages with entity bodies,
        // unless the message is transported using chunked encoding (transfer-encoding).
        if (request.headers['transfer-encoding'] === undefined && request.headers['content-length'] === undefined) {
          throw new HttpException(411, 'Length Required');
        }

        const contentTypeMime: string | undefined = getContentTypeMime(request.headers['content-type']);
        const contentTypeCharset: string | undefined = getContentTypeParameter(request.headers['content-type'], 'charset');

        if (contentTypeCharset && !iconv.encodingExists(contentTypeCharset)) {
          return Promise.reject(new HttpException(415, `Unsupported charset: ${ contentTypeCharset }`));
        }

        if (contentType.toLowerCase() !== contentTypeMime?.toLowerCase()) {
          throw new HttpException(415, 'Unsupported Media Type');
        }

        if (isSchemaArray(contentSchema)) {
          request.body = await this.parseRequestTo(request, 'json');

          errors.push(...validateSchemaArray(contentSchema, request.body, ['request', 'body']));
        } else if (isSchemaBoolean(contentSchema)) {
          request.body = await this.parseRequestTo(request, 'json');

          errors.push(...validateSchemaBoolean(contentSchema, request.body, ['request', 'body']));
        } else if (isSchemaBuffer(contentSchema)) {
          request.body = await this.parseRequestTo(request, 'buffer');

          errors.push(...validateSchemaBuffer(contentSchema, request.body, ['request', 'body']));
        } else if (isSchemaEnum(contentSchema)) {
          request.body = await this.parseRequestTo(request, 'json');

          errors.push(...validateSchemaEnum(contentSchema, request.body, ['request', 'body']));
        } else if (isSchemaNumber(contentSchema)) {
          request.body = await this.parseRequestTo(request, 'json');

          errors.push(...validateSchemaNumber(contentSchema, request.body, ['request', 'body']));
        } else if (isSchemaObject(contentSchema)) {
          request.body = await this.parseRequestTo(request, 'json');

          errors.push(...validateSchemaObject(contentSchema, request.body, ['request', 'body']));
        } else if (isSchemaStream(contentSchema)) {
          request.body = await this.parseRequestTo(request, 'stream');

          // ...
        } else if (isSchemaString(contentSchema)) {
          request.body = await this.parseRequestTo(request, 'string');

          errors.push(...validateSchemaString(contentSchema, request.body, ['request', 'body']));
        } else {
          throw new HttpException(500);
        }
      }

      /** request.headers **/
      if (request.metadata?.contract?.request?.headers) {
        for (const [name, schema] of Object.entries(request.metadata.contract.request.headers)) {
          errors.push(...validateSchemaString(schema, request.headers[name], ['request', 'headers', name]));
        }
      }

      /** request.params **/
      if (request.metadata?.contract?.request?.params) {
        for (const [name, schema] of Object.entries(request.metadata.contract.request.params)) {
          errors.push(...validateSchemaString(schema, request.params[name], ['request', 'params', name]));
        }
      }

      /** request.query **/
      request.query = url.parse(request.url, true).query as any;

      if (request.metadata?.contract?.request?.query) {
        for (const [name, schema] of Object.entries(request.metadata.contract.request.query)) {
          errors.push(...validateSchemaString(schema, request.query[name], ['request', 'query', name]));
        }
      }

      /** response **/
      // request.metadata.contract.responses[200].body;
      // request.metadata.contract.responses[200].headers;

      if (errors.length > 0) {
        throw new HttpException(400, errors);
      }

      return next.handle();
    };
  }

  protected static async parseRequestTo(request: http.IncomingMessage, outputType: 'stream'): Promise<Readable>;
  protected static async parseRequestTo(request: http.IncomingMessage, outputType: 'buffer'): Promise<Buffer>;
  protected static async parseRequestTo(request: http.IncomingMessage, outputType: 'json'): Promise<any>;
  protected static async parseRequestTo(request: http.IncomingMessage, outputType: 'string'): Promise<string>;
  protected static async parseRequestTo(request: http.IncomingMessage, outputType: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (request.headers['transfer-encoding'] === undefined && isNaN(parseInt(request.headers['content-length'], 10))) {
        return resolve(undefined);
      }

      // The Content-Length header is mandatory for messages with entity bodies,
      // unless the message is transported using chunked encoding (transfer-encoding).
      if (request.headers['transfer-encoding'] === undefined && request.headers['content-length'] === undefined) {
        return reject(new HttpException(411, `Length Required`));
      }

      if (outputType === 'stream') {
        return resolve(request);
      }

      // data
      let data: Buffer = Buffer.alloc(0);

      request.on('data', (chunk: Buffer) => {
        data = Buffer.concat([data, chunk]);
      });

      request.on('end', () => {
        // content-length header check with buffer length
        const contentLength: number = parseInt(request.headers['content-length'], 10);

        if (contentLength && contentLength !== data.length) {
          return reject(new HttpException(400, 'Request size did not match Content-Length'));
        }

        const contentTypeCharset: string | undefined = getContentTypeParameter(request.headers['content-type'], 'charset');

        switch (outputType) {
          case 'buffer':
            return resolve(data);
          case 'json':
            try {
              return resolve(JSON.parse(contentTypeCharset ? iconv.decode(data, contentTypeCharset) : data.toString()));
            } catch (err) {
              return reject(new HttpException(400, `Invalid JSON`));
            }
          case 'string':
            return resolve(contentTypeCharset ? iconv.decode(data, contentTypeCharset) : data.toString());
        }
      });

      request.on('error', error => {
        return reject(error);
      });
    });
  }
}
