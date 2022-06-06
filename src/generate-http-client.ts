// import { Specification } from '@caviajs/http-router';
// import { generateStructure } from './generate-structure';
//
// export function generateHttpClient(name: string, specification: Specification): string {
//   let content: string = '';
//
//   content += `import { HttpClient, HttpResponse } from '@caviajs/http-client';`;
//   content += `\n`;
//   content += `export class ${ name } {`;
//   content += `public static connectionUrl: string = '';`;
//   content += `\n`;
//
//   // tutaj metody
//   content += `}`;
//
//   // tutaj interfejsy
//   for (const route of specification.routes) {
//     if (route.metadata?.name) {
//       if (route.metadata?.schema?.request?.body) {
//       }
//
//       if (route.metadata?.schema?.request?.headers) {
//       }
//
//       if (route.metadata?.schema?.request?.params) {
//       }
//
//       if (route.metadata?.schema?.request?.query) {
//       }
//
//       if (route.metadata?.schema?.responses) {
//         for (const [status, response] of Object.entries(route.metadata?.schema?.responses || {})) {
//
//         }
//       }
//     }
//   }
//
//   return content;
// }
