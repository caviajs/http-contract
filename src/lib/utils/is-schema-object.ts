import { SchemaObject } from '../types/schema-object';

export function isSchemaObject(schema: any): schema is SchemaObject {
  return schema?.type === 'object';
}
