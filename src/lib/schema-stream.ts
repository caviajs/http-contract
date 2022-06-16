import { ValidationError } from './validation-error';
import { getSchemaNullable } from './utils/get-schema-nullable';
import { getSchemaRequired } from './utils/get-schema-required';
import { Readable } from 'stream';

export function isSchemaStream(schema: any): schema is SchemaStream {
  return schema?.type === 'stream';
}

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

export type SchemaStream = {
  maxLength?: number;
  minLength?: number;
  nullable?: boolean;
  required?: boolean;
  type: 'stream';
}
