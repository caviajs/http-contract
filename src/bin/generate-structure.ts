import { getSchemaRequired } from '../lib/get-schema-required';
import { getSchemaStrict } from '../lib/get-schema-strict';
import { getSchemaNullable } from '../lib/get-schema-nullable';
import { isSchemaArray, SchemaArray } from '../lib/schema-array';
import { isSchemaBoolean, SchemaBoolean } from '../lib/schema-boolean';
import { isSchemaBuffer, SchemaBuffer } from '../lib/schema-buffer';
import { isSchemaEnum, SchemaEnum } from '../lib/schema-enum';
import { isSchemaNumber, SchemaNumber } from '../lib/schema-number';
import { isSchemaObject, SchemaObject } from '../lib/schema-object';
import { isSchemaStream, SchemaStream } from '../lib/schema-stream';
import { isSchemaString, SchemaString } from '../lib/schema-string';

export function generateStructure(schema: SchemaArray | SchemaBoolean | SchemaBuffer | SchemaEnum | SchemaNumber | SchemaObject | SchemaStream | SchemaString): string {
  let content: string = '';

  if (isSchemaArray(schema)) {
    content += `${ generateStructure(schema.items) }[]`;
  } else if (isSchemaBoolean(schema)) {
    content += 'boolean';
  } else if (isSchemaBuffer(schema)) {
    content += 'Buffer';
  } else if (isSchemaEnum(schema)) {
    Object.values(schema.enum).forEach((value, index) => {
      if (index !== 0) {
        content += '|';
      }

      if (typeof value === 'string') {
        content += `'${ value }'`;
      } else if (typeof value === 'number') {
        content += `${ value }`;
      } else {
        content += `unknown`;
      }
    });
  } else if (isSchemaNumber(schema)) {
    content += 'number';
  } else if (isSchemaObject(schema)) {
    content += '{';

    Object.entries(schema.properties || {}).forEach(([propertyKey, propertySchema]) => {
      content += `'${ propertyKey }'${ getSchemaRequired(propertySchema) ? '' : '?' }: ${ generateStructure(propertySchema) };`;
    });

    if (getSchemaStrict(schema) === false) {
      content += `[name: string]: any;`;
    }

    content += '}';
  } else if (isSchemaStream(schema)) {
    content += 'Readable';
  } else if (isSchemaString(schema)) {
    content += 'string';
  } else {
    content += 'unknown';
  }

  if (getSchemaNullable(schema) === true) {
    content += '| null';
  }

  return content;
}
