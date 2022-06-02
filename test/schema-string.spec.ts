import { SchemaString, Validator } from '../src';

const path: string[] = ['foo', 'bar'];

describe('SchemaString', () => {
  it('should validate the expressions condition correctly', () => {
    const schema: SchemaString = {
      expressions: [
        /^[A-Z]/,
        /[A-Z]$/,
      ],
      type: 'string',
    };

    // valid
    expect(Validator.validate(schema, 'FoO')).toEqual([]);
    expect(Validator.validate(schema, 'FoO', path)).toEqual([]);

    // invalid
    expect(Validator.validate(schema, 'Foo')).toEqual([
      { message: 'The value should match a regular expression /[A-Z]$/', path: '' },
    ]);
    expect(Validator.validate(schema, 'Foo', path)).toEqual([
      { message: 'The value should match a regular expression /[A-Z]$/', path: 'foo.bar' },
    ]);

    expect(Validator.validate(schema, 'foo')).toEqual([
      { message: 'The value should match a regular expression /^[A-Z]/', path: '' },
      { message: 'The value should match a regular expression /[A-Z]$/', path: '' },
    ]);
    expect(Validator.validate(schema, 'foo', path)).toEqual([
      { message: 'The value should match a regular expression /^[A-Z]/', path: 'foo.bar' },
      { message: 'The value should match a regular expression /[A-Z]$/', path: 'foo.bar' },
    ]);
  });

  it('should validate the maxLength condition correctly', () => {
    const schema: SchemaString = {
      maxLength: 10,
      type: 'string',
    };

    // longer than maxLength
    expect(Validator.validate(schema, 'HelloHelloHello')).toEqual([
      { message: 'The value must be shorter than or equal to 10 characters', path: '' },
    ]);
    expect(Validator.validate(schema, 'HelloHelloHello', path)).toEqual([
      { message: 'The value must be shorter than or equal to 10 characters', path: 'foo.bar' },
    ]);

    // equal to maxLength
    expect(Validator.validate(schema, 'HelloHello')).toEqual([]);
    expect(Validator.validate(schema, 'HelloHello', path)).toEqual([]);

    // shorter than maxLength
    expect(Validator.validate(schema, 'Hello')).toEqual([]);
    expect(Validator.validate(schema, 'Hello', path)).toEqual([]);
  });

  it('should validate the minLength condition correctly', () => {
    const schema: SchemaString = {
      minLength: 10,
      type: 'string',
    };

    // longer than minLength
    expect(Validator.validate(schema, 'HelloHelloHello')).toEqual([]);
    expect(Validator.validate(schema, 'HelloHelloHello', path)).toEqual([]);

    // equal to minLength
    expect(Validator.validate(schema, 'HelloHello')).toEqual([]);
    expect(Validator.validate(schema, 'HelloHello', path)).toEqual([]);

    // shorter than minLength
    expect(Validator.validate(schema, 'Hello')).toEqual([
      { message: 'The value must be longer than or equal to 10 characters', path: '' },
    ]);
    expect(Validator.validate(schema, 'Hello', path)).toEqual([
      { message: 'The value must be longer than or equal to 10 characters', path: 'foo.bar' },
    ]);
  });

  it('should validate the nullable condition correctly', () => {
    // nullable: false (default)
    expect(Validator.validate({ type: 'string' }, null)).toEqual([
      { message: 'The value should be string', path: '' },
    ]);
    expect(Validator.validate({ type: 'string' }, null, path)).toEqual([
      { message: 'The value should be string', path: 'foo.bar' },
    ]);

    // nullable: false
    expect(Validator.validate({ nullable: false, type: 'string' }, null)).toEqual([
      { message: 'The value should be string', path: '' },
    ]);
    expect(Validator.validate({ nullable: false, type: 'string' }, null, path)).toEqual([
      { message: 'The value should be string', path: 'foo.bar' },
    ]);

    // nullable: true
    expect(Validator.validate({ nullable: true, type: 'string' }, null)).toEqual([]);
    expect(Validator.validate({ nullable: true, type: 'string' }, null, path)).toEqual([]);
  });

  it('should validate the required condition correctly', () => {
    // required: false (default)
    expect(Validator.validate({ type: 'string' }, undefined)).toEqual([]);
    expect(Validator.validate({ type: 'string' }, undefined, path)).toEqual([]);

    // required: false
    expect(Validator.validate({ required: false, type: 'string' }, undefined)).toEqual([]);
    expect(Validator.validate({ required: false, type: 'string' }, undefined, path)).toEqual([]);

    // required: true
    expect(Validator.validate({ required: true, type: 'string' }, undefined)).toEqual([
      { message: 'The value is required', path: '' },
      { message: 'The value should be string', path: '' },
    ]);
    expect(Validator.validate({ required: true, type: 'string' }, undefined, path)).toEqual([
      { message: 'The value is required', path: 'foo.bar' },
      { message: 'The value should be string', path: 'foo.bar' },
    ]);
  });

  it('should validate the type condition correctly', () => {
    const schema: SchemaString = {
      nullable: false,
      required: true,
      type: 'string',
    };

    // string
    expect(Validator.validate(schema, 'Hello World')).toEqual([]);
    expect(Validator.validate(schema, 'Hello World', path)).toEqual([]);

    // number
    expect(Validator.validate(schema, 1245)).toEqual([
      { message: 'The value should be string', path: '' },
    ]);
    expect(Validator.validate(schema, 1245, path)).toEqual([
      { message: 'The value should be string', path: 'foo.bar' },
    ]);

    // true
    expect(Validator.validate(schema, true)).toEqual([
      { message: 'The value should be string', path: '' },
    ]);
    expect(Validator.validate(schema, true, path)).toEqual([
      { message: 'The value should be string', path: 'foo.bar' },
    ]);

    // false
    expect(Validator.validate(schema, false)).toEqual([
      { message: 'The value should be string', path: '' },
    ]);
    expect(Validator.validate(schema, false, path)).toEqual([
      { message: 'The value should be string', path: 'foo.bar' },
    ]);

    // buffer
    expect(Validator.validate(schema, Buffer.from('Hello World'))).toEqual([
      { message: 'The value should be string', path: '' },
    ]);
    expect(Validator.validate(schema, Buffer.from('Hello World'), path)).toEqual([
      { message: 'The value should be string', path: 'foo.bar' },
    ]);

    // undefined
    expect(Validator.validate(schema, undefined)).toEqual([
      { message: 'The value is required', path: '' },
      { message: 'The value should be string', path: '' },
    ]);
    expect(Validator.validate(schema, undefined, path)).toEqual([
      { message: 'The value is required', path: 'foo.bar' },
      { message: 'The value should be string', path: 'foo.bar' },
    ]);

    // symbol
    expect(Validator.validate(schema, Symbol('Hello World'))).toEqual([
      { message: 'The value should be string', path: '' },
    ]);
    expect(Validator.validate(schema, Symbol('Hello World'), path)).toEqual([
      { message: 'The value should be string', path: 'foo.bar' },
    ]);

    // null
    expect(Validator.validate(schema, null)).toEqual([
      { message: 'The value should be string', path: '' },
    ]);
    expect(Validator.validate(schema, null, path)).toEqual([
      { message: 'The value should be string', path: 'foo.bar' },
    ]);

    // NaN
    expect(Validator.validate(schema, NaN)).toEqual([
      { message: 'The value should be string', path: '' },
    ]);
    expect(Validator.validate(schema, NaN, path)).toEqual([
      { message: 'The value should be string', path: 'foo.bar' },
    ]);

    // array
    expect(Validator.validate(schema, [])).toEqual([
      { message: 'The value should be string', path: '' },
    ]);
    expect(Validator.validate(schema, [], path)).toEqual([
      { message: 'The value should be string', path: 'foo.bar' },
    ]);

    // object
    expect(Validator.validate(schema, {})).toEqual([
      { message: 'The value should be string', path: '' },
    ]);
    expect(Validator.validate(schema, {}, path)).toEqual([
      { message: 'The value should be string', path: 'foo.bar' },
    ]);
  });
});
