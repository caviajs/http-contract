import { SchemaEnum } from '../types/schema-enum';
import { ValidationError } from '../types/validation-error';
import { getSchemaRequired } from './get-schema-required';
import { getSchemaNullable } from './get-schema-nullable';

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
