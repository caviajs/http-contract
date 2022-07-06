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
  export interface RequestBodySchema {
    'application/json'?: SchemaArray | SchemaBoolean | SchemaBuffer | SchemaNumber | SchemaObject | SchemaStream;
    'application/octet-stream'?: SchemaBuffer | SchemaStream;
    'application/pdf'?: SchemaBuffer | SchemaStream;
    'application/x-www-form-urlencoded'?: SchemaBuffer | SchemaStream | SchemaObject;
    'application/xml'?: SchemaBuffer | SchemaStream | SchemaString;
    'image/gif'?: SchemaBuffer | SchemaStream;
    'image/jpeg'?: SchemaBuffer | SchemaStream;
    'image/png'?: SchemaBuffer | SchemaStream;
    'image/tiff'?: SchemaBuffer | SchemaStream;
    'multipart/form-data'?: SchemaBuffer | SchemaStream;
    'text/css'?: SchemaBuffer | SchemaStream | SchemaString;
    'text/csv'?: SchemaBuffer | SchemaStream | SchemaString;
    'text/html'?: SchemaBuffer | SchemaStream | SchemaString;
    'text/plain'?: SchemaBuffer | SchemaStream | SchemaString;
    'video/mp4'?: SchemaBuffer | SchemaStream;
  }

  export interface RequestHeadersSchema {
    [name: string]: SchemaEnum | SchemaString;
  }

  export interface RequestParamsSchema {
    [name: string]: SchemaBoolean | SchemaEnum | SchemaNumber | SchemaString;
  }

  export interface RequestQuerySchema {
    [name: string]: SchemaBoolean | SchemaEnum | SchemaNumber | SchemaString;
  }

  export type ResponseBodySchema =
    | SchemaArray
    | SchemaBoolean
    | SchemaBuffer
    | SchemaEnum
    | SchemaNumber
    | SchemaObject
    | SchemaStream
    | SchemaString;

  export interface ResponseHeadersSchema {
    [name: string]: SchemaEnum | SchemaString;
  }

  export interface RouteMetadata {
    readonly contract?: {
      readonly name?: string;
      readonly request?: {
        readonly body?: RequestBodySchema;
        readonly headers?: RequestHeadersSchema;
        readonly params?: RequestParamsSchema;
        readonly query?: RequestQuerySchema;
      };
      readonly responses?: {
        readonly [status: number]: {
          readonly body?: ResponseBodySchema;
          readonly headers?: ResponseHeadersSchema;
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
