import { SchemaBuffer } from '../types/schema-buffer';

export function isSchemaBuffer(schema: any): schema is SchemaBuffer {
  return schema?.type === 'buffer';
}
