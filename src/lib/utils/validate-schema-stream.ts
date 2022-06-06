import { SchemaStream } from '../types/schema-stream';
import { getSchemaNullable } from './get-schema-nullable';
import { getSchemaRequired } from './get-schema-required';
import { ValidationError } from '../types/validation-error';
import { Readable } from 'stream';

export function validateSchemaStream(schema: SchemaStream, data: any, path: string[] = []): ValidationError[] {
  if ((getSchemaNullable(schema) === true && data === null) || (getSchemaRequired(schema) === false && data === undefined)) {
    return [];
  }

  const errors: ValidationError[] = [];

  if (getSchemaRequired(schema) === true && data === undefined) {
    errors.push({ message: `The value is required`, path: path.join('.') });
  }

  if ((data instanceof Readable) === false) {
    errors.push({ message: `The value should be stream`, path: path.join('.') });
  }

  // maxLength?
  // minLength?

  return errors;
}
