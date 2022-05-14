declare module '@caviajs/http-server' {
  export interface RouteMetadata {
    id: string;
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
