import { SchemaArray } from '../types/schema-array';

export function isSchemaArray(schema: any): schema is SchemaArray {
  return schema?.type === 'array';
}
