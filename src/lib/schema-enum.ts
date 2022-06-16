import { ValidationError } from './validation-error';
import { getSchemaNullable } from './utils/get-schema-nullable';
import { getSchemaRequired } from './utils/get-schema-required';

export function isSchemaEnum(schema: any): schema is SchemaEnum {
  return schema?.type === 'enum';
}

export function validateSchemaEnum(schema: SchemaEnum, data: any, path: string[] = []): ValidationError[] {
  if ((getSchemaNullable(schema) === true && data === null) || (getSchemaRequired(schema) === false && data === undefined)) {
    return [];
  }

  const errors: ValidationError[] = [];

  if (getSchemaRequired(schema) === true && data === undefined) {
    errors.push({ message: `The value is required`, path: path.join('.') });
  }

  if (schema.enum.includes(data) === false) {
    errors.push({ message: `The value must be one of the following values: ${ schema.enum.join(', ') }`, path: path.join('.') });
  }

  return errors;
}

export type SchemaEnum = {
  enum: (string | number)[];
  nullable?: boolean;
  required?: boolean;
  type: 'enum';
}
