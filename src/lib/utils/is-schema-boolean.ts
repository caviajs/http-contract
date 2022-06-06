import { SchemaBoolean } from '../types/schema-boolean';

export function isSchemaBoolean(schema: any): schema is SchemaBoolean {
  return schema?.type === 'boolean';
}
