import { Specification } from '@caviajs/http-router';
import { generateStructure } from './generate-structure';
import { generateType } from './generate-type';
import { pascalCase } from './lib/utils/pascal-case';
import { format } from 'prettier';
import { camelCase } from './lib/utils/camel-case';

export function generateHttpClient(name: string, specification: Specification): string {
  let content: string = '';

  content += `import { HttpClient, HttpResponse } from '@caviajs/http-client';`;
  content += `import { Readable } from 'stream';`;

  content += `export class ${ name } {`;
  content += `public static connectionUrl: string = '';`;

  for (const route of specification.routes) {
    if (route.metadata?.contract?.name) {
      const camelCaseName: string = camelCase(route.metadata.contract.name);
      const pascalCaseName: string = pascalCase(route.metadata.contract.name);

      content += `public static async ${ camelCaseName }(payload: {`;
      content += route.metadata.contract.request?.body ? `body: ${ pascalCaseName }Body,` : '';
      content += route.metadata.contract.request?.headers ? `headers: ${ pascalCaseName }Headers,` : '';
      content += route.metadata.contract.request?.params ? `params: ${ pascalCaseName }Params,` : '';
      content += route.metadata.contract.request?.query ? `query: ${ pascalCaseName }Query,` : '';
      content += `timeout?: number,`;
      content += `}): Promise<${ pascalCaseName }Response> {`;
      content += `const url: URL = new URL('${ route.path }', this.connectionUrl);`;

      if (route.metadata.contract.request?.params) {
        content += `Object.entries(payload.params || {}).forEach(([key, value]) => {`;
        content += 'url.pathname = url.pathname.replace(`:${ key }`, value);';
        content += `});`;
      }

      if (route.metadata.contract.request?.query) {
        content += 'Object.entries(payload.query || {}).forEach(([key, value]) => {';
        content += 'url.searchParams.set(key, value);';
        content += '});';
      }

      content += 'const response: HttpResponse<Readable> = await HttpClient.request({';
      content += route.metadata.contract.request?.body ? 'body: payload.body,' : '';
      content += route.metadata.contract.request?.headers ? 'headers: payload.headers,' : '';
      content += `method: '${ route.method }',`;
      content += `responseType: 'stream',`;
      content += `timeout: payload.timeout,`;
      content += `url: url.toString(),`;
      content += '});';

      if (!route.metadata.contract?.responses) {
        content += `return <${ pascalCaseName }Response>response;`;
      } else {
        content += `switch (response.statusCode) {`;

        for (const [status, response] of Object.entries(route.metadata?.contract?.responses || {})) {
          content += `${ status }:`;
          content += `return <${ camelCaseName }Response${ status }>{`;
          content += `body: response.body,`; // todo auto serializacja tutaj streamToBuffer, streamToJson, streamToString ?
          content += `headers: response.headers,`;
          content += `statusCode: response.statusCode,`;
          content += `statusMessage: response.statusMessage,`;
          content += `};`;
        }

        content += 'default:';
        content += 'return <HttpResponse<Readable>>response';

        content += `}`;
      }

      content += `}`;
    }
  }

  content += `}`;

  // for() {
  // tutaj metody
  // public static async getUsers(payload: { body, headers, params, query, timeout }): Promise<GetUsersResponse> {
  //     const url: URL = new URL('/users/:id', this.connectionUrl);
  //
  //    Object.entries(params || {}).forEach(([key, value]) => {
  //       url.pathname = url.pathname.replace(`:${ key }`, value);
  //     });
  //
  //     const response = await HttpClient.request({
  //       method: 'GET',
  //       responseType: 'buffer',
  //       url: url.toString(),
  //     });
  //
  //     switch (response.statusCode) {
  //       case 200:
  //         return <GetUsersResponse200>{
  //           body: JSON.parse(response.body.toString()),
  //           headers: response.headers,
  //           statusCode: response.statusCode,
  //           statusMessage: response.statusMessage,
  //         };
  //       default:
  //         return <any>response;
  //     }
  //   }
  // }

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
          content += response.body ? `body: ${ pascalCaseName }Response${ status }Body,` : 'any,';
          content += response.headers ? `headers: ${ pascalCaseName }Response${ status }Headers,` : 'any,';
          content += `statusCode: ${ status },`;
          content += `statusMessage: string,`;
          content += `}`;

          content += `export type ${ pascalCaseName }Response${ status }Body = any;`;

          content += `export type ${ pascalCaseName }Response${ status }Headers = any;`;
        }
      }
    }
  }

  return format(content);
}
