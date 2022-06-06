import { SchemaNumber } from '../types/schema-number';

export function isSchemaNumber(schema: any): schema is SchemaNumber {
  return schema?.type === 'number';
}
