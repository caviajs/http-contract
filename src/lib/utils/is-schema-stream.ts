import { SchemaStream } from '../types/schema-stream';

export function isSchemaStream(schema: any): schema is SchemaStream {
  return schema?.type === 'stream';
}
