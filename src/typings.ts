import { SchemaBuffer, SchemaObject, SchemaString } from './lib/schema';

declare module '@caviajs/http-router' {
  export type BodySchema =
    | { contentSchema: SchemaObject; contentType: 'application/json'; }
    | { contentSchema: SchemaBuffer; contentType: 'application/octet-stream'; }
    | { contentSchema: SchemaObject; contentType: 'application/x-www-form-urlencoded'; }
    | { contentSchema: SchemaBuffer; contentType: 'image/gif'; }
    | { contentSchema: SchemaBuffer; contentType: 'image/jpeg'; }
    | { contentSchema: SchemaBuffer; contentType: 'image/png'; }
    | { contentSchema: SchemaBuffer; contentType: 'image/tiff'; }
    | { contentSchema: SchemaString; contentType: 'text/plain'; }

  export type HeadersSchema = { [name: string]: SchemaString; }

  export type ParamsSchema = { [name: string]: SchemaString; }

  export type QuerySchema = { [name: string]: SchemaString; }

  export interface RouteMetadata {
    readonly contract?: {
      readonly name?: string;
      readonly request?: {
        readonly body?: BodySchema;
        readonly headers?: HeadersSchema;
        readonly params?: ParamsSchema;
        readonly query?: QuerySchema;
      };
      readonly responses?: {
        readonly [status: number]: {
          readonly body?: BodySchema;
          readonly headers?: HeadersSchema;
        };
      };
    };
  }
}

declare module 'http' {
  export interface IncomingMessage {
    // todo: inferred by contract?
    // body: any | undefined;
    // headers: http.IncomingHttpHeaders;
    // params: http.Params;
    // query: {};
  }
}
