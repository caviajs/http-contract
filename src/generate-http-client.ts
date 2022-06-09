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
  content += `\n`;
  content += `export class ${ name } {`;
  content += `public static connectionUrl: string = '';`;
  content += `\n`;

  for (const route of specification.routes) {
    if (route.metadata?.contract?.name) {
      content += `public static async ${ camelCase(route.metadata?.name) }(payload: {`;

      if (route.metadata?.contract?.request?.body) {
        content += `body: ${ pascalCase(`${ route.metadata.contract.name }Body`) },`;
      }

      if (route.metadata?.contract?.request?.headers) {
        content += `headers: ${ pascalCase(`${ route.metadata.contract.name }Headers`) },`;
      }

      if (route.metadata?.contract?.request?.params) {
        content += `params: ${ pascalCase(`${ route.metadata.contract.name }Params`) },`;
      }

      if (route.metadata?.contract?.request?.query) {
        content += `query: ${ pascalCase(`${ route.metadata.contract.name }Query`) },`;
      }

      content += `timeout?: number,`;

      content += `}): Promise<${ pascalCase(route.metadata?.name) }Response> {`;
      content += `const url: URL = new URL('${ route.path }', this.connectionUrl);`;

      if (route.metadata?.contract?.request?.params) {
        content += `Object.entries(payload.params || {}).forEach(([key, value]) => {`;
        content += 'url.pathname = url.pathname.replace(`:${ key }`, value);';
        content += `});`;
      }

      if (route.metadata?.contract?.request?.query) {
        content += 'Object.entries(payload.query || {}).forEach(([key, value]) => {';
        content += 'url.searchParams.set(key, value);';
        content += '});';
      }

      content += 'const response = await HttpClient.request({';
      content += route.metadata?.contract?.request?.body ? 'body: payload.body,' : '';
      content += route.metadata?.contract?.request?.headers ? 'headers: payload.headers,' : '';
      content += `method: '${ route.method }',`;
      content += `responseType: 'buffer',`; // w zależności od schemy buffer albo stream???
      content += `url: url.toString(),`;
      content += '});';

      if (!route.metadata?.contract?.responses) {
        content += `return <any>response;`;
      } else {
        content += `switch (response.statusCode) {`;

        for (const [status, response] of Object.entries(route.metadata?.contract?.responses || {})) {
          content += `${ status }:`;
          content += `return <${ camelCase(route.metadata.contract.name) }Response${ status }>{`;
          content += `body: response.body,`; // todo auto serializacja tutaj
          content += `headers: response.headers,`;
          content += `statusCode: response.statusCode,`;
          content += `statusMessage: response.statusMessage,`;
          content += `};`;
        }

        content += 'default:';
        content += 'return <any>response';

        content += `}`;
      }

      content += `}`;
    }
  }

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

  content += `}`;

  // tutaj interfejsy
  for (const route of specification.routes) {
    if (route.metadata?.contract?.name) {
      if (route.metadata?.contract?.request?.body) {
        content += generateType(pascalCase(`${ route.metadata.contract.name }Body`), route.metadata.contract.request.body.contentSchema);
      }

      if (route.metadata?.contract?.request?.headers) {
        // { [name: string]: SchemaString }
        content += generateType(pascalCase(`${ route.metadata.contract.name }Headers`), {
          properties: route.metadata.contract.request.headers,
          strict: false,
          type: 'object',
        });
      }

      if (route.metadata?.contract?.request?.params) {
        // { [name: string]: SchemaString }
        content += generateType(pascalCase(`${ route.metadata.contract.name }Params`), {
          properties: route.metadata.contract.request.params,
          strict: true,
          type: 'object',
        });
      }

      if (route.metadata?.contract?.request?.query) {
        // { [name: string]: SchemaString }
        content += generateType(pascalCase(`${ route.metadata.contract.name }Query`), {
          properties: route.metadata.contract.request.query,
          strict: false,
          type: 'object',
        });
      }

      if (route.metadata?.contract?.responses) {
        // export type pascalCase(`${ route.metadata.contract.name }Response`) =
        //   | GetUsersResponse200;

        for (const [status, response] of Object.entries(route.metadata?.schema?.responses || {})) {
          // const nazwaaaa = pascalCase(`${ route.metadata.contract.name }Response${ status }`)
          //
          // export interface nazwaaaa extends HttpResponse {
          //   body: ${nazwaaaa}Body,
          //   headers: ${nazwaaaa}Headers,
          //   statusCode: status,
          //   statusMessage: string,
          // }

          // export type ${nazwaaaa}Body = ...

          // export type ${nazwaaaa}Headers = ...
        }
      }
    }
  }

  return format(content);
}
