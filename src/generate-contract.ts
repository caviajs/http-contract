// #!/usr/bin/env node
//
// import yargs from 'yargs';
// import { join, sep } from 'path';
// import fs from 'fs';
// import { cyan } from 'colorette';
// import { noCase } from 'no-case';
// import { hideBin } from 'yargs/helpers';
// import { HttpClient } from '@caviajs/http-client';
// import { Specification } from '@caviajs/http-router';
// import { SchemaAny } from './lib/schema';
// import {
//   getSchemaNullable,
//   getSchemaRequired,
//   getSchemaStrict,
//   isSchemaArray,
//   isSchemaBoolean,
//   isSchemaBuffer,
//   isSchemaEnum,
//   isSchemaNumber, isSchemaObject, isSchemaString
// } from './lib/validator';
// import { camelCase } from './lib/utils/camel-case';
// import { pascalCase } from './lib/utils/pascal-case';
// import { kebabCase } from './lib/utils/kebab-case';
//
//
// function composeHttpClientTemplate(name: string, specification: Specification): string {
//   let content: string = '';
//
//   content += `// This file was generated by Cavia, please don't edit it!\n`;
//   content += `import { HttpClient, HttpResponse } from '@caviajs/http-client';\n`;
//   content += `\n`;
//   content += `export class ${ name } {\n`;
//   content += `\tpublic static connectionUrl: string = '';\n`;
//
//   for (const route of specification.routes) {
//     if (route.metadata?.name) {
//       content += `\n`;
//       content += `\tpublic static async ${ camelCase(route.metadata?.name) }(\n`;
//
//       if (route.metadata?.schema?.request?.body) {
//         content += `\t\tbody: ${ pascalCase(route.metadata?.name) }Body,\n`;
//       }
//
//       if (route.metadata?.schema?.request?.headers) {
//         content += `\t\theaders: ${ pascalCase(route.metadata?.name) }Headers,\n`;
//       }
//
//       if (route.metadata?.schema?.request?.params) {
//         content += `\t\tparams: ${ pascalCase(route.metadata?.name) }Params,\n`;
//       }
//
//       if (route.metadata?.schema?.request?.query) {
//         content += `\t\tquery: ${ pascalCase(route.metadata?.name) }Query,\n`;
//       }
//
//       content += `\t): Promise<${ pascalCase(route.metadata?.name) }Response> {\n`;
//       content += `\t\tconst url: URL = new URL('${ route.path }', this.connectionUrl);\n`;
//       content += `\n`;
//
//       if (route.metadata?.schema?.request?.params) {
//         content += `\t\tObject.entries(params || {}).forEach(([key, value]) => {\n`;
//         content += '\t\t\turl.pathname = url.pathname.replace(`:${ key }`, value);\n';
//         content += `\t\t});\n`;
//         content += `\n`;
//       }
//
//       if (route.metadata?.schema?.request?.query) {
//         content += '\t\tObject.entries(query || {}).forEach(([key, value]) => {\n';
//         content += '\t\t\turl.searchParams.set(key, value);\n';
//         content += '\t\t});\n';
//         content += `\n`;
//       }
//
//       content += '\t\tconst response = await HttpClient.request({\n';
//
//       if (route.metadata?.schema?.request?.body) {
//         content += '\t\t\tbody: body,\n';
//       }
//
//       if (route.metadata?.schema?.request?.headers) {
//         content += '\t\t\theaders: headers,\n';
//       }
//
//       content += `\t\t\tmethod: '${ route.method }',\n`;
//       content += `\t\t\tresponseType: 'buffer',\n`;
//       content += `\t\t\turl: url.toString(),\n`;
//       content += `\t\t});\n`;
//       content += `\n`;
//
//       if (route.metadata?.schema?.responses) {
//         content += `\t\tswitch (response.statusCode) {\n`;
//
//         Object.entries(route.metadata?.schema?.responses || {}).forEach(([status, response], index, array) => {
//           content += `\t\t\tcase ${ status }:\n`;
//           content += `\t\t\t\treturn <${ camelCase(route.metadata?.name) }Response${ status }>{\n`;
//
//           if (isSchemaArray(response?.body)) {
//             content += `\t\t\t\t\tbody: JSON.parse(response.body.toString()),\n`;
//           } else if (isSchemaBoolean(response?.body)) {
//             content += `\t\t\t\t\tbody: JSON.parse(response.body.toString()),\n`;
//           } else if (isSchemaBuffer(response?.body)) {
//             content += `\t\t\t\t\tbody: response.body,\n`;
//           } else if (isSchemaEnum(response?.body)) {
//             // SchemaEnum => json albo text ??
//           } else if (isSchemaNumber(response?.body)) {
//             content += `\t\t\t\t\tbody: JSON.parse(response.body.toString()),\n`;
//           } else if (isSchemaObject(response?.body)) {
//             content += `\t\t\t\t\tbody: JSON.parse(response.body.toString()),\n`;
//           } else if (isSchemaString(response?.body)) {
//             content += `\t\t\t\t\tbody: response.body.toString(),\n`;
//           } else {
//             content += `\t\t\t\t\tbody: response.body,\n`;
//           }
//
//           content += `\t\t\t\t\theaders: response.headers,\n`;
//           content += `\t\t\t\t\tstatusCode: response.statusCode,\n`;
//           content += `\t\t\t\t\tstatusMessage: response.statusMessage,\n`;
//           content += `\t\t\t\t};\n`;
//         });
//
//         content += `\t\t\tdefault:\n`;
//         content += `\t\t\t\treturn <any>response;\n`;
//
//         content += `\t\t}\n`;
//       } else {
//         content += `\t\t\t\treturn <any>response;\n`;
//       }
//
//       content += `\t}\n`;
//     }
//   }
//
//   content += `}\n`;
//
//   for (const route of specification.routes) {
//     if (route.metadata?.name) {
//       content += `\n`;
//
//       if (route.metadata?.schema?.request?.body) {
//         content += generateTypeBySchema(`${ pascalCase(route.metadata?.name) }Body`, route.metadata?.schema?.request?.body);
//         content += `\n`;
//       }
//
//       if (route.metadata?.schema?.request?.headers) {
//         content += generateTypeBySchema(`${ pascalCase(route.metadata?.name) }Headers`, route.metadata?.schema?.request?.headers);
//         content += `\n`;
//       }
//
//       if (route.metadata?.schema?.request?.params) {
//         content += generateTypeBySchema(`${ pascalCase(route.metadata?.name) }Params`, route.metadata?.schema?.request?.params);
//         content += `\n`;
//       }
//
//       if (route.metadata?.schema?.request?.query) {
//         content += generateTypeBySchema(`${ pascalCase(route.metadata?.name) }Query`, route.metadata?.schema?.request?.query);
//         content += `\n`;
//       }
//
//       if (route.metadata?.schema?.responses) {
//         content += `export type ${ pascalCase(route.metadata?.name) }Response =\n`;
//
//         Object.entries(route.metadata?.schema?.responses || {}).forEach(([status, response], index, array) => {
//           content += `\t| ${ pascalCase(route.metadata?.name) }Response${ status }${ index === array.length - 1 ? ';' : '' }\n`;
//         });
//
//         for (const [status, response] of Object.entries(route.metadata?.schema?.responses || {})) {
//           content += `\n`;
//           content += `export interface ${ pascalCase(route.metadata?.name) }Response${ status } extends HttpResponse {\n`;
//           content += `\tbody: ${ pascalCase(route.metadata?.name) }Response${ status }Body,\n`;
//           content += `\theaders: ${ pascalCase(route.metadata?.name) }Response${ status }Headers,\n`;
//           content += `\tstatusCode: ${ status },\n`;
//           content += `\tstatusMessage: string,\n`;
//           content += `}\n`;
//
//           content += `\n`;
//           content += generateTypeBySchema(`${ pascalCase(route.metadata?.name) }Response${ status }Body`, response.body);
//
//           content += `\n`;
//           content += generateTypeBySchema(`${ pascalCase(route.metadata?.name) }Response${ status }Headers`, response.headers);
//         }
//       } else {
//         content += `export type ${ pascalCase(route.metadata?.name) }Response = HttpResponse;\n`;
//       }
//     }
//   }
//
//   content += `\n`;
//
//   return content;
// }
//
// (async (): Promise<void> => {
//   const argv = yargs(hideBin(process.argv))
//     .positional('output', { demandOption: true, type: 'string' })
//     .positional('url', { demandOption: true, type: 'string' })
//     .parseSync();
//
//   const apiSpecResponse = await HttpClient.request({
//     method: 'GET',
//     responseType: 'buffer',
//     url: argv.url as string,
//   });
//
//   if (apiSpecResponse.statusCode >= 400) {
//     throw new Error(apiSpecResponse.statusMessage);
//   }
//
//   const apiSpec: Specification = JSON.parse(apiSpecResponse.body.toString());
//
//   const paths: string[] = (argv.output as string).replace(/(\/|\\)/g, sep).split(sep);
//   const distDir: string = join(process.cwd(), ...paths.slice(0, -1));
//
//   if (!fs.existsSync(distDir)) {
//     fs.mkdirSync(distDir);
//   }
//
//   const dist: string = join(distDir, `${ kebabCase(paths[paths.length - 1]) }-contract.ts`);
//
//   fs.writeFileSync(dist, composeHttpClientTemplate(`${ pascalCase(paths[paths.length - 1]) }Contract`, apiSpec));
//
//   process.stdout.write(`File '${ cyan(dist) }' has been generated\n`);
// })();
