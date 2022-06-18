import http from 'http';
import { SchemaArray } from './schema-array';
import { SchemaBoolean } from './schema-boolean';
import { SchemaBuffer } from './schema-buffer';
import { SchemaEnum } from './schema-enum';
import { SchemaNumber } from './schema-number';
import { SchemaObject } from './schema-object';
import { SchemaStream } from './schema-stream';
import { SchemaString } from './schema-string';

declare module '@caviajs/http-router' {
  export type BodySchema =
    | { contentSchema: SchemaArray | SchemaBoolean | SchemaBuffer | SchemaEnum | SchemaNumber | SchemaObject | SchemaStream; contentType: 'application/json'; }
    | { contentSchema: SchemaBuffer | SchemaStream; contentType: 'application/octet-stream'; }
    | { contentSchema: SchemaBuffer | SchemaStream | SchemaObject; contentType: 'application/x-www-form-urlencoded'; }
    | { contentSchema: SchemaBuffer | SchemaStream | SchemaString; contentType: 'application/xml'; }
    | { contentSchema: SchemaBuffer | SchemaStream; contentType: 'image/gif'; }
    | { contentSchema: SchemaBuffer | SchemaStream; contentType: 'image/jpeg'; }
    | { contentSchema: SchemaBuffer | SchemaStream; contentType: 'image/png'; }
    | { contentSchema: SchemaBuffer | SchemaStream; contentType: 'image/tiff'; }
    | { contentSchema: SchemaBuffer | SchemaStream | SchemaString; contentType: 'text/css'; }
    | { contentSchema: SchemaBuffer | SchemaStream | SchemaString; contentType: 'text/csv'; }
    | { contentSchema: SchemaBuffer | SchemaStream | SchemaString; contentType: 'text/html'; }
    | { contentSchema: SchemaBuffer | SchemaStream | SchemaString; contentType: 'text/plain'; }
    | { contentSchema: SchemaBuffer | SchemaStream; contentType: 'video/mp4'; }

  export interface HeadersSchema {
    [name: string]: SchemaString;
  }

  export interface ParamsSchema {
    [name: string]: SchemaBoolean | SchemaEnum | SchemaNumber | SchemaString;
  }

  export interface QuerySchema {
    [name: string]: SchemaBoolean | SchemaEnum | SchemaNumber | SchemaString;
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
    params: http.Params | { [name: string]: boolean | number; };
    query: { [name: string]: boolean | number | string; } | undefined;
  }
}
