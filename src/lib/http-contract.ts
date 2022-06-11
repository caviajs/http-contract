import http from 'http';
import { HttpException } from '@caviajs/http-exception';
import { Interceptor, Next } from '@caviajs/http-router';
import { getContentTypeMime } from './utils/get-content-type-mime';
import * as url from 'url';
import { ValidationError } from './types/validation-error';
import { validateSchemaString } from './utils/validate-schema-string';
import { isSchemaArray } from './utils/is-schema-array';
import { isSchemaBoolean } from './utils/is-schema-boolean';
import { isSchemaBuffer } from './utils/is-schema-buffer';
import { isSchemaEnum } from './utils/is-schema-enum';
import { isSchemaNumber } from './utils/is-schema-number';
import { isSchemaObject } from './utils/is-schema-object';
import { isSchemaStream } from './utils/is-schema-stream';
import { isSchemaString } from './utils/is-schema-string';
import { validateSchemaArray } from './utils/validate-schema-array';
import { validateSchemaBoolean } from './utils/validate-schema-boolean';
import { validateSchemaBuffer } from './utils/validate-schema-buffer';
import { validateSchemaNumber } from './utils/validate-schema-number';
import { validateSchemaEnum } from './utils/validate-schema-enum';
import { validateSchemaObject } from './utils/validate-schema-object';
import iconv from 'iconv-lite';
import { Observable } from 'rxjs';
import { HttpBody } from './http-body';
import { getContentTypeParameter } from './utils/get-content-type-parameter';

export class HttpContract {
  public setup(): Interceptor {
    return async (request: http.IncomingMessage, response: http.ServerResponse, next: Next): Promise<Observable<any>> => {
      const errors: ValidationError[] = [];

      /** request.body **/
      if (request.metadata?.contract?.request?.body) {
        const contentSchema = request.metadata.contract.request.body.contentSchema;
        const contentType = request.metadata.contract.request.body.contentType;

        // The Content-Length header is mandatory for messages with entity bodies,
        // unless the message is transported using chunked encoding (transfer-encoding).
        if (request.headers['transfer-encoding'] === undefined && request.headers['content-length'] === undefined) {
          throw new HttpException(411);
        }

        const contentTypeMime: string | undefined = getContentTypeMime(request.headers['content-type']);
        const contentTypeCharset: string | undefined = getContentTypeParameter(request.headers['content-type'], 'charset');

        if (contentTypeCharset && !iconv.encodingExists(contentTypeCharset)) {
          return Promise.reject(new HttpException(415, `Unsupported charset: ${ contentTypeCharset }`));
        }

        // + buffer magic number scanning?
        if (contentType.toLowerCase() !== contentTypeMime?.toLowerCase()) {
          throw new HttpException(400, 'Invalid Content-Type');
        }

        if (isSchemaArray(contentSchema)) {
          request.body = await HttpBody.parse(request, 'json');

          errors.push(...validateSchemaArray(contentSchema, request.body, ['request', 'body']));
        } else if (isSchemaBoolean(contentSchema)) {
          request.body = await HttpBody.parse(request, 'json');

          errors.push(...validateSchemaBoolean(contentSchema, request.body, ['request', 'body']));
        } else if (isSchemaBuffer(contentSchema)) {
          request.body = await HttpBody.parse(request, 'buffer');

          errors.push(...validateSchemaBuffer(contentSchema, request.body, ['request', 'body']));
        } else if (isSchemaEnum(contentSchema)) {
          request.body = await HttpBody.parse(request, 'json');

          errors.push(...validateSchemaEnum(contentSchema, request.body, ['request', 'body']));
        } else if (isSchemaNumber(contentSchema)) {
          request.body = await HttpBody.parse(request, 'json');

          errors.push(...validateSchemaNumber(contentSchema, request.body, ['request', 'body']));
        } else if (isSchemaObject(contentSchema)) {
          request.body = await HttpBody.parse(request, 'json');

          errors.push(...validateSchemaObject(contentSchema, request.body, ['request', 'body']));
        } else if (isSchemaStream(contentSchema)) {
          request.body = await HttpBody.parse(request, 'stream');

          // ...
        } else if (isSchemaString(contentSchema)) {
          request.body = await HttpBody.parse(request, 'string');

          errors.push(...validateSchemaString(contentSchema, request.body, ['request', 'body']));
        } else {
          throw new HttpException(500);
        }
      }

      /** request.headers **/
      if (request.metadata?.contract?.request?.headers) {
        for (const [name, schema] of Object.entries(request.metadata.contract.request.headers)) {
          errors.push(...validateSchemaString(schema, request.headers, ['request', 'headers', name]));
        }
      }

      /** request.params **/
      if (request.metadata?.contract?.request?.params) {
        for (const [name, schema] of Object.entries(request.metadata.contract.request.params)) {
          errors.push(...validateSchemaString(schema, request.params, ['request', 'params', name]));
        }
      }

      /** request.query **/
      request.query = url.parse(request.url, true).query as any;

      if (request.metadata?.contract?.request?.query) {
        for (const [name, schema] of Object.entries(request.metadata.contract.request.query)) {
          errors.push(...validateSchemaString(schema, request.query, ['request', 'query', name]));
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
}