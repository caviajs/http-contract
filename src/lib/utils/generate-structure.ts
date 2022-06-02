import { format } from 'prettier';
import { SchemaAny } from '../schema';
import {
  getSchemaNullable,
  getSchemaRequired,
  getSchemaStrict,
  isSchemaArray,
  isSchemaBoolean,
  isSchemaBuffer,
  isSchemaEnum,
  isSchemaNumber,
  isSchemaObject,
  isSchemaString,
} from '../validator';

export function generateStructure(schema: SchemaAny): string {
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

const schema: SchemaAny = {
  items: {
    properties: {
      code: {
        enum: ['USER_EXISTS', 'INVALID_CAPTCHA_CODE'],
        type: 'enum',
        required: true,
      },
      name: {
        type: 'string',
      },
    },
    type: 'object',
  },
  type: 'array',
};

const test = generateStructure(schema);
console.log(format(`type Test = ${ test }`));
