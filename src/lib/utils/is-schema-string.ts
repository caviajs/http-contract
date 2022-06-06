import { SchemaString } from '../types/schema-string';

export function isSchemaString(schema: any): schema is SchemaString {
  return schema?.type === 'string';
}
