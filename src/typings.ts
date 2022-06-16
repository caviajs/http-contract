import { SchemaArray } from './lib/schema-array';
import { SchemaBoolean } from './lib/schema-boolean';
import { SchemaBuffer } from './lib/schema-buffer';
import { SchemaEnum } from './lib/schema-enum';
import { SchemaNumber } from './lib/schema-number';
import { SchemaObject } from './lib/schema-object';
import { SchemaStream } from './lib/schema-stream';
import { SchemaString } from './lib/schema-string';

declare module '@caviajs/http-router' {
  export type BodySchema =
    | { contentSchema: SchemaArray | SchemaBoolean | SchemaBuffer | SchemaEnum | SchemaNumber | SchemaObject | SchemaStream; contentType: 'application/json'; }
    | { contentSchema: SchemaBuffer | SchemaStream; contentType: 'application/octet-stream'; }
    | { contentSchema: SchemaObject; contentType: 'application/x-www-form-urlencoded'; }
    | { contentSchema: SchemaBuffer | SchemaStream | SchemaString; contentType: 'application/xml'; }
    | { contentSchema: SchemaBuffer | SchemaStream; contentType: 'image/gif'; }
    | { contentSchema: SchemaBuffer | SchemaStream; contentType: 'image/jpeg'; }
    | { contentSchema: SchemaBuffer | SchemaStream; contentType: 'image/png'; }
    | { contentSchema: SchemaBuffer | SchemaStream; contentType: 'image/tiff'; }
    | { contentSchema: SchemaString | SchemaStream; contentType: 'text/css'; }
    | { contentSchema: SchemaString | SchemaStream; contentType: 'text/csv'; }
    | { contentSchema: SchemaString | SchemaStream; contentType: 'text/html'; }
    | { contentSchema: SchemaString | SchemaStream; contentType: 'text/plain'; }
    | { contentSchema: SchemaBuffer | SchemaStream; contentType: 'video/mp4'; }

  export interface HeadersSchema {
    [name: string]: SchemaString;
  }

  export interface ParamsSchema {
    [name: string]: SchemaString;
  }

  export interface QuerySchema {
    [name: string]: SchemaString;
  }

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
    body: any | undefined;
    // headers: http.IncomingHttpHeaders;
    // params: http.Params;
    query: { [name: string]: string; } | undefined;
  }
}
