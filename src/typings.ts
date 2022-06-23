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
  /**
   * In the context of the incoming request, mime type refers to the Content-Type header.
   * In response context, key refers to Accept in request headers.
   */
  export interface BodySchema {
    'application/json'?: SchemaArray | SchemaBoolean | SchemaBuffer | SchemaNumber | SchemaObject | SchemaStream;
    'application/octet-stream'?: SchemaBuffer | SchemaStream;
    'application/x-www-form-urlencoded'?: SchemaBuffer | SchemaStream | SchemaObject;
    'application/xml'?: SchemaBuffer | SchemaStream | SchemaString;
    'image/gif'?: SchemaBuffer | SchemaStream;
    'image/jpeg'?: SchemaBuffer | SchemaStream;
    'image/png'?: SchemaBuffer | SchemaStream;
    'image/tiff'?: SchemaBuffer | SchemaStream;
    'text/css'?: SchemaBuffer | SchemaStream | SchemaString;
    'text/csv'?: SchemaBuffer | SchemaStream | SchemaString;
    'text/html'?: SchemaBuffer | SchemaStream | SchemaString;
    'text/plain'?: SchemaBuffer | SchemaStream | SchemaString;
    'video/mp4'?: SchemaBuffer | SchemaStream;
  }

  export interface HeadersSchema {
    [name: string]: SchemaEnum | SchemaString;
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
    // params: http.Params | { [name: string]: boolean | number; };
    query: { [name: string]: boolean | number | string; } | undefined;
  }
}
