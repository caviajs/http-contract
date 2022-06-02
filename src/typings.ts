import { SchemaArray, SchemaBoolean, SchemaBuffer, SchemaEnum, SchemaNumber, SchemaObject, SchemaString } from './lib/schema';

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

  export interface RouteMetadata {
    contract?: {
      readonly name?: string;
      readonly request?: {
        readonly body?: BodySchema;
        readonly headers?: {
          [name: string]: SchemaString;
        };
        readonly params?: {
          [name: string]: SchemaString;
        };
        readonly query?: {
          [name: string]: SchemaString;
        };
      };
      readonly responses?: {
        readonly [status: number]: {
          readonly body?: BodySchema;
          readonly headers?: {
            [name: string]: SchemaString;
          };
        };
      };
    };
  }
}
