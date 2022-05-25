import { SchemaArray, SchemaBoolean, SchemaBuffer, SchemaEnum, SchemaNumber, SchemaObject, SchemaString } from './lib/schema';

declare module '@caviajs/http-router' {
  export type RequestBodySchema =
    | SchemaArray | SchemaBoolean | SchemaBuffer | SchemaEnum | SchemaNumber | SchemaObject | SchemaString;
  export type RequestHeadersSchema = SchemaObject;
  export type RequestParamsSchema = SchemaObject;
  export type RequestQuerySchema = SchemaObject;

  export type ResponseBodySchema =
    | SchemaArray | SchemaBoolean | SchemaBuffer | SchemaEnum | SchemaNumber | SchemaObject | SchemaString;
  export type ResponseHeadersSchema = SchemaObject;

  export interface RouteMetadata {
    name?: string;
    schema?: {
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
