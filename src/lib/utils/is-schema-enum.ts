import { SchemaEnum } from '../types/schema-enum';

export function isSchemaEnum(schema: any): schema is SchemaEnum {
  return schema?.type === 'enum';
}
