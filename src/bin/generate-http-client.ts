import { Specification } from '@caviajs/http-router';
import { generateStructure } from './generate-structure';
import { generateType } from './generate-type';
import { pascalCase } from './pascal-case';
import { format } from 'prettier';
import { camelCase } from './camel-case';
import { getSchemaRequired } from '../lib/utils/get-schema-required';
import { isSchemaArray } from '../lib/schema-array';
import { isSchemaBoolean } from '../lib/schema-boolean';
import { isSchemaBuffer } from '../lib/schema-buffer';
import { isSchemaEnum } from '../lib/schema-enum';
import { isSchemaNumber } from '../lib/schema-number';
import { isSchemaObject } from '../lib/schema-object';
import { isSchemaStream } from '../lib/schema-stream';
import { isSchemaString } from '../lib/schema-string';

export function generateHttpClient(name: string, specification: Specification): string {
  let content: string = '';

  content += `import { HttpClient, HttpResponse } from '@caviajs/http-client';`;
  content += `import { Readable } from 'stream';`;
  content += `import http from 'http';`;
  content += `import https from 'https';`;

  content += `function streamToBuffer(stream: Readable): Promise<Buffer> {`;
  content += `return new Promise((resolve, reject) => {`;
  content += `let buffer: Buffer = Buffer.alloc(0);`;
  content += `stream.on('data', (chunk: Buffer) => {`;
  content += `buffer = Buffer.concat([buffer, chunk]);`;
  content += `});`;
  content += `stream.on('end', () => resolve(buffer));`;
  content += `stream.on('error', (err) => reject(err));`;
  content += `});`;
  content += `}`;

  content += `async function streamToJSON(stream: Readable): Promise<boolean | number | null | object> {`;
  content += `return JSON.parse((await streamToBuffer(stream)).toString());`;
  content += `}`;

  content += `async function streamToString(stream: Readable): Promise<string> {`;
  content += `return (await streamToBuffer(stream)).toString();`;
  content += `}`;

  content += `export class ${ name } {`;
  content += `public static connectionUrl: string = '';`;

  for (const route of specification.routes) {
    if (route.metadata?.contract?.name) {
      const camelCaseName: string = camelCase(route.metadata.contract.name);
      const pascalCaseName: string = pascalCase(route.metadata.contract.name);

      const isBodyRequired: boolean = route.metadata.contract.request?.body ? getSchemaRequired(route.metadata.contract.request?.body) : false;
      const isHeadersRequired: boolean = Object.values(route.metadata.contract.request?.headers || {}).some((schema) => getSchemaRequired(schema));
      const isParamsRequired: boolean = Object.values(route.metadata.contract.request?.params || {}).some((schema) => getSchemaRequired(schema));
      const isQueryRequired: boolean = Object.values(route.metadata.contract.request?.query || {}).some((schema) => getSchemaRequired(schema));
      const isPayloadRequired: boolean = isBodyRequired || isHeadersRequired || isParamsRequired || isQueryRequired;

      content += `public static async ${ camelCaseName }(payload${ isPayloadRequired ? '' : '?' }: {`;
      content += `agent?: http.Agent | https.Agent,`;
      content += route.metadata.contract.request?.body ? `body${ isBodyRequired ? '' : '?' }: ${ pascalCaseName }Body,` : '';
      content += route.metadata.contract.request?.headers ? `headers${ isHeadersRequired ? '' : '?' }: ${ pascalCaseName }Headers,` : '';
      content += route.metadata.contract.request?.params ? `params${ isParamsRequired ? '' : '?' }: ${ pascalCaseName }Params,` : '';
      content += route.metadata.contract.request?.query ? `query${ isQueryRequired ? '' : '?' }: ${ pascalCaseName }Query,` : '';
      content += `timeout?: number,`;
      content += `}): Promise<${ pascalCaseName }Response> {`;
      content += `const url: URL = new URL('${ route.path }', this.connectionUrl);`;

      if (route.metadata.contract.request?.params) {
        content += `Object.entries(payload?.params || {}).forEach(([key, value]) => {`;
        content += 'url.pathname = url.pathname.replace(`:${ key }`, value);';
        content += `});`;
      }

      if (route.metadata.contract.request?.query) {
        content += 'Object.entries(payload?.query || {}).forEach(([key, value]) => {';
        content += 'url.searchParams.set(key, value);';
        content += '});';
      }

      content += 'const response: HttpResponse<Readable> = await HttpClient.request({';
      content += route.metadata.contract.request?.body ? 'body: payload?.body,' : '';
      content += route.metadata.contract.request?.headers ? 'headers: payload?.headers,' : '';
      content += `method: '${ route.method }',`;
      content += `responseType: 'stream',`;
      content += `timeout: payload?.timeout,`;
      content += `url: url.toString(),`;
      content += '});';

      content += `switch (response.statusCode) {`;

      for (const [status, response] of Object.entries(route.metadata?.contract?.responses || {})) {
        content += `case ${ status }:`;
        content += `return <${ pascalCaseName }Response${ status }>{`;

        if (isSchemaArray(response.body?.contentSchema)) {
          content += `body: await streamToJSON(response.body),`;
        } else if (isSchemaBoolean(response.body?.contentSchema)) {
          content += `body: await streamToJSON(response.body),`;
        } else if (isSchemaBuffer(response.body?.contentSchema)) {
          content += `body: await streamToBuffer(response.body),`;
        } else if (isSchemaEnum(response.body?.contentSchema)) {
          content += `body: await streamToJSON(response.body),`;
        } else if (isSchemaNumber(response.body?.contentSchema)) {
          content += `body: await streamToJSON(response.body),`;
        } else if (isSchemaObject(response.body?.contentSchema)) {
          content += `body: await streamToJSON(response.body),`;
        } else if (isSchemaStream(response.body?.contentSchema)) {
          content += `body: response.body,`;
        } else if (isSchemaString(response.body?.contentSchema)) {
          content += `body: await streamToString(response.body),`;
        } else {
          content += `body: response.body,`;
        }

        content += `headers: response.headers,`;
        content += `statusCode: response.statusCode,`;
        content += `statusMessage: response.statusMessage,`;
        content += `};`;
      }

      content += 'default:';
      content += 'return <any>response';

      content += `}`;


      content += `}`;
    }
  }

  content += `}`;

  for (const route of specification.routes) {
    if (route.metadata?.contract?.name) {
      const pascalCaseName: string = pascalCase(route.metadata.contract.name);

      if (route.metadata.contract.request?.body) {
        content += generateType(`${ pascalCaseName }Body`, route.metadata.contract.request.body.contentSchema);
      }

      if (route.metadata.contract.request?.headers) {
        content += generateType(`${ pascalCaseName }Headers`, {
          properties: route.metadata.contract.request.headers,
          strict: false,
          type: 'object',
        });
      }

      if (route.metadata.contract.request?.params) {
        content += generateType(`${ pascalCaseName }Params`, {
          properties: route.metadata.contract.request.params,
          strict: true,
          type: 'object',
        });
      }

      if (route.metadata.contract.request?.query) {
        content += generateType(`${ pascalCaseName }Query`, {
          properties: route.metadata.contract.request.query,
          strict: false,
          type: 'object',
        });
      }

      if (!route.metadata.contract?.responses) {
        content += `export type ${ pascalCaseName }Response = HttpResponse<Readable>;`;
      } else {
        content += `export type ${ pascalCaseName }Response =`;
        for (const status of Object.keys(route.metadata.contract?.responses || {})) {
          content += `| ${ pascalCaseName }Response${ status }`;
        }
        content += `;`;

        for (const [status, response] of Object.entries(route.metadata.contract?.responses || {})) {
          content += `export interface ${ pascalCaseName }Response${ status } extends HttpResponse {`;
          content += `body: ${ pascalCaseName }Response${ status }Body,`;
          content += `headers: ${ pascalCaseName }Response${ status }Headers,`;
          content += `statusCode: ${ status },`;
          content += `statusMessage: string,`;
          content += `}`;

          if (response.body) {
            content += `export type ${ pascalCaseName }Response${ status }Body = ${ generateStructure(response.body.contentSchema) };`;
          } else {
            content += `export type ${ pascalCaseName }Response${ status }Body = unknown;`;
          }

          if (response.headers) {
            content += `export type ${ pascalCaseName }Response${ status }Headers = ${ generateStructure({
              properties: response.headers,
              strict: false,
              type: 'object'
            }) };`;
          } else {
            content += `export type ${ pascalCaseName }Response${ status }Headers = { [name: string]: string; };`;
          }
        }
      }
    }
  }

  return format(content, { semi: true, singleQuote: true, parser: 'typescript' });
}
