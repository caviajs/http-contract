import { Schema, SchemaObject } from '@caviajs/validator';

declare module '@caviajs/http-router' {
  export interface RouteMetadata {
    name?: string;
    schema?: {
      readonly request?: {
        readonly body?: Schema;
        readonly headers?: SchemaObject;
        readonly params?: SchemaObject;
        readonly query?: SchemaObject;
      };
      readonly responses?: {
        readonly [status: number]: {
          readonly body?: Schema;
          readonly headers?: SchemaObject;
        };
      };
    };
  }
}
