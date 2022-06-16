import { isSchemaArray } from '../lib/utils/is-schema-array';
import { isSchemaBoolean } from '../lib/utils/is-schema-boolean';
import { isSchemaBuffer } from '../lib/utils/is-schema-buffer';
import { isSchemaEnum } from '../lib/utils/is-schema-enum';
import { isSchemaNumber } from '../lib/utils/is-schema-number';
import { isSchemaObject } from '../lib/utils/is-schema-object';
import { getSchemaRequired } from '../lib/utils/get-schema-required';
import { getSchemaStrict } from '../lib/utils/get-schema-strict';
import { isSchemaString } from '../lib/utils/is-schema-string';
import { isSchemaStream } from '../lib/utils/is-schema-stream';
import { getSchemaNullable } from '../lib/utils/get-schema-nullable';
import { SchemaArray } from '../lib/schema-array';
import { SchemaBoolean } from '../lib/schema-boolean';
import { SchemaBuffer } from '../lib/schema-buffer';
import { SchemaEnum } from '../lib/schema-enum';
import { SchemaNumber } from '../lib/schema-number';
import { SchemaObject } from '../lib/schema-object';
import { SchemaStream } from '../lib/schema-stream';
import { SchemaString } from '../lib/schema-string';

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
