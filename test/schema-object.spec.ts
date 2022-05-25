import { SchemaObject, Validator } from '../src';

const path: string[] = ['foo', 'bar'];

describe('SchemaObject', () => {
  it('should validate the strict condition correctly', () => {
    // strict: false (default)
    {
      const schema: SchemaObject = {
        type: 'object',
      };

      expect(Validator.validate(schema, { foo: 'hello', bar: 'hello' })).toEqual([]);
      expect(Validator.validate(schema, { foo: 'hello', bar: 'hello' }, path)).toEqual([]);
    }

    {
      const schema: SchemaObject = {
        properties: {
          foo: { type: 'string' },
        },
        type: 'object',
      };

      expect(Validator.validate(schema, { foo: 'hello', bar: 'hello' })).toEqual([]);
      expect(Validator.validate(schema, { foo: 'hello', bar: 'hello' }, path)).toEqual([]);
    }

    // strict: false
    {
      const schema: SchemaObject = {
        type: 'object',
        strict: false,
      };

      expect(Validator.validate(schema, { foo: 'hello', bar: 'hello' })).toEqual([]);
      expect(Validator.validate(schema, { foo: 'hello', bar: 'hello' }, path)).toEqual([]);

      expect(Validator.validate(schema, {})).toEqual([]);
      expect(Validator.validate(schema, {}, path)).toEqual([]);
    }

    {
      const schema: SchemaObject = {
        properties: {
          foo: { type: 'string' },
        },
        strict: false,
        type: 'object',
      };

      expect(Validator.validate(schema, { foo: 'hello', bar: 'hello' })).toEqual([]);
      expect(Validator.validate(schema, { foo: 'hello', bar: 'hello' }, path)).toEqual([]);
    }

    // strict: true
    {
      const schema: SchemaObject = {
        type: 'object',
        strict: true,
      };

      expect(Validator.validate(schema, { foo: 'hello', bar: 'hello' })).toEqual([
        { message: 'The following property is not allowed: foo', path: '' },
        { message: 'The following property is not allowed: bar', path: '' },
      ]);
      expect(Validator.validate(schema, { foo: 'hello', bar: 'hello' }, path)).toEqual([
        { message: 'The following property is not allowed: foo', path: 'foo.bar' },
        { message: 'The following property is not allowed: bar', path: 'foo.bar' },
      ]);
    }

    {
      const schema: SchemaObject = {
        properties: {
          foo: { type: 'string' },
          bar: { type: 'string' },
        },
        strict: true,
        type: 'object',
      };

      expect(Validator.validate(schema, { foo: 'hello', bar: 'hello', baz: 'hello', bax: 'hello' })).toEqual([
        { message: 'The following property is not allowed: baz', path: '' },
        { message: 'The following property is not allowed: bax', path: '' },
      ]);
      expect(Validator.validate(schema, { foo: 'hello', bar: 'hello', baz: 'hello', bax: 'hello' }, path)).toEqual([
        { message: 'The following property is not allowed: baz', path: 'foo.bar' },
        { message: 'The following property is not allowed: bax', path: 'foo.bar' },
      ]);

      expect(Validator.validate(schema, { foo: 'hello', bar: 'hello', baz: 'hello' })).toEqual([
        { message: 'The following property is not allowed: baz', path: '' },
      ]);
      expect(Validator.validate(schema, { foo: 'hello', bar: 'hello', baz: 'hello' }, path)).toEqual([
        { message: 'The following property is not allowed: baz', path: 'foo.bar' },
      ]);

      expect(Validator.validate(schema, { foo: 'hello', bar: 'hello' })).toEqual([]);
      expect(Validator.validate(schema, { foo: 'hello', bar: 'hello' }, path)).toEqual([]);
    }
  });

  it('should validate the nullable condition correctly', () => {
    // nullable: false (default)
    expect(Validator.validate({ type: 'object' }, null)).toEqual([
      { message: 'The value should be object', path: '' },
    ]);
    expect(Validator.validate({ type: 'object' }, null, path)).toEqual([
      { message: 'The value should be object', path: 'foo.bar' },
    ]);

    // nullable: false
    expect(Validator.validate({ nullable: false, type: 'object' }, null)).toEqual([
      { message: 'The value should be object', path: '' },
    ]);
    expect(Validator.validate({ nullable: false, type: 'object' }, null, path)).toEqual([
      { message: 'The value should be object', path: 'foo.bar' },
    ]);

    // nullable: true
    expect(Validator.validate({ nullable: true, type: 'object' }, null)).toEqual([]);
    expect(Validator.validate({ nullable: true, type: 'object' }, null, path)).toEqual([]);
  });

  it('should validate the properties condition correctly', () => {
    const schema: SchemaObject = {
      nullable: false,
      properties: {
        name: {
          required: true,
          type: 'string',
        },
        age: {
          type: 'number',
        },
      },
      required: true,
      type: 'object',
    };

    expect(Validator.validate(schema, undefined)).toEqual([
      { message: 'The value is required', path: '' },
      { message: 'The value should be object', path: '' },
      { message: 'The value is required', path: 'name' },
      { message: 'The value should be string', path: 'name' },
    ]);
    expect(Validator.validate(schema, undefined, path)).toEqual([
      { message: 'The value is required', path: 'foo.bar' },
      { message: 'The value should be object', path: 'foo.bar' },
      { message: 'The value is required', path: 'foo.bar.name' },
      { message: 'The value should be string', path: 'foo.bar.name' },
    ]);

    expect(Validator.validate(schema, {})).toEqual([
      { message: 'The value is required', path: 'name' },
      { message: 'The value should be string', path: 'name' },
    ]);
    expect(Validator.validate(schema, {}, path)).toEqual([
      { message: 'The value is required', path: 'foo.bar.name' },
      { message: 'The value should be string', path: 'foo.bar.name' },
    ]);

    expect(Validator.validate(schema, { age: '1245' })).toEqual([
      { message: 'The value is required', path: 'name' },
      { message: 'The value should be string', path: 'name' },
      { message: 'The value should be number', path: 'age' },
    ]);
    expect(Validator.validate(schema, { age: '1245' }, path)).toEqual([
      { message: 'The value is required', path: 'foo.bar.name' },
      { message: 'The value should be string', path: 'foo.bar.name' },
      { message: 'The value should be number', path: 'foo.bar.age' },
    ]);

    expect(Validator.validate(schema, { name: 'Hello', age: '1245' })).toEqual([
      { message: 'The value should be number', path: 'age' },
    ]);
    expect(Validator.validate(schema, { name: 'Hello', age: '1245' }, path)).toEqual([
      { message: 'The value should be number', path: 'foo.bar.age' },
    ]);

    expect(Validator.validate(schema, { name: 'Hello', age: 1245 })).toEqual([]);
    expect(Validator.validate(schema, { name: 'Hello', age: 1245 }, path)).toEqual([]);

    expect(Validator.validate(schema, { name: 'Hello' })).toEqual([]);
    expect(Validator.validate(schema, { name: 'Hello' }, path)).toEqual([]);
  });

  it('should validate the required condition correctly', () => {
    // required: false (default)
    expect(Validator.validate({ type: 'object' }, undefined)).toEqual([]);
    expect(Validator.validate({ type: 'object' }, undefined, path)).toEqual([]);

    // required: false
    expect(Validator.validate({ required: false, type: 'object' }, undefined)).toEqual([]);
    expect(Validator.validate({ required: false, type: 'object' }, undefined, path)).toEqual([]);

    // required: true
    expect(Validator.validate({ required: true, type: 'object' }, undefined)).toEqual([
      { message: 'The value is required', path: '' },
      { message: 'The value should be object', path: '' },
    ]);
    expect(Validator.validate({ required: true, type: 'object' }, undefined, path)).toEqual([
      { message: 'The value is required', path: 'foo.bar' },
      { message: 'The value should be object', path: 'foo.bar' },
    ]);
  });

  it('should validate the type condition correctly', () => {
    const schema: SchemaObject = {
      nullable: false,
      required: true,
      type: 'object',
    };

    // string
    expect(Validator.validate(schema, 'Hello World')).toEqual([
      { message: 'The value should be object', path: '' },
    ]);
    expect(Validator.validate(schema, 'Hello World', path)).toEqual([
      { message: 'The value should be object', path: 'foo.bar' },
    ]);

    // number
    expect(Validator.validate(schema, 1245)).toEqual([
      { message: 'The value should be object', path: '' },
    ]);
    expect(Validator.validate(schema, 1245, path)).toEqual([
      { message: 'The value should be object', path: 'foo.bar' },
    ]);

    // true
    expect(Validator.validate(schema, true)).toEqual([
      { message: 'The value should be object', path: '' },
    ]);
    expect(Validator.validate(schema, true, path)).toEqual([
      { message: 'The value should be object', path: 'foo.bar' },
    ]);

    // false
    expect(Validator.validate(schema, false)).toEqual([
      { message: 'The value should be object', path: '' },
    ]);
    expect(Validator.validate(schema, false, path)).toEqual([
      { message: 'The value should be object', path: 'foo.bar' },
    ]);

    // undefined
    expect(Validator.validate(schema, undefined)).toEqual([
      { message: 'The value is required', path: '' },
      { message: 'The value should be object', path: '' },
    ]);
    expect(Validator.validate(schema, undefined, path)).toEqual([
      { message: 'The value is required', path: 'foo.bar' },
      { message: 'The value should be object', path: 'foo.bar' },
    ]);

    // symbol
    expect(Validator.validate(schema, Symbol('Hello World'))).toEqual([
      { message: 'The value should be object', path: '' },
    ]);
    expect(Validator.validate(schema, Symbol('Hello World'), path)).toEqual([
      { message: 'The value should be object', path: 'foo.bar' },
    ]);

    // null
    expect(Validator.validate(schema, null)).toEqual([
      { message: 'The value should be object', path: '' },
    ]);
    expect(Validator.validate(schema, null, path)).toEqual([
      { message: 'The value should be object', path: 'foo.bar' },
    ]);

    // NaN
    expect(Validator.validate(schema, NaN)).toEqual([
      { message: 'The value should be object', path: '' },
    ]);
    expect(Validator.validate(schema, NaN, path)).toEqual([
      { message: 'The value should be object', path: 'foo.bar' },
    ]);

    // array
    expect(Validator.validate(schema, [])).toEqual([
      { message: 'The value should be object', path: '' },
    ]);
    expect(Validator.validate(schema, [], path)).toEqual([
      { message: 'The value should be object', path: 'foo.bar' },
    ]);

    // object
    expect(Validator.validate(schema, {})).toEqual([]);
    expect(Validator.validate(schema, {}, path)).toEqual([]);
  });
});
