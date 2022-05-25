import { SchemaEnum, Validator } from '../src';

const path: string[] = ['foo', 'bar'];

describe('SchemaEnum', () => {
  it('should validate the enum condition correctly', () => {
    const schema: SchemaEnum = {
      enum: ['Hello', 1245, 'World'],
      nullable: false,
      required: true,
      type: 'enum',
    };

    // valid
    expect(Validator.validate(schema, 'Hello')).toEqual([]);
    expect(Validator.validate(schema, 'Hello', path)).toEqual([]);

    expect(Validator.validate(schema, 1245)).toEqual([]);
    expect(Validator.validate(schema, 1245, path)).toEqual([]);

    expect(Validator.validate(schema, 'World')).toEqual([]);
    expect(Validator.validate(schema, 'World', path)).toEqual([]);

    // invalid
    expect(Validator.validate(schema, 'Foo')).toEqual([
      { message: 'The value must be one of the following values: Hello, 1245, World', path: '' },
    ]);
    expect(Validator.validate(schema, 'Foo', path)).toEqual([
      { message: 'The value must be one of the following values: Hello, 1245, World', path: 'foo.bar' },
    ]);
  });

  it('should validate the nullable condition correctly', () => {
    // nullable: false (default)
    expect(Validator.validate({ enum: ['Hello', 'World'], type: 'enum' }, null)).toEqual([
      { message: 'The value must be one of the following values: Hello, World', path: '' },
    ]);
    expect(Validator.validate({ enum: ['Hello', 'World'], type: 'enum' }, null, path)).toEqual([
      { message: 'The value must be one of the following values: Hello, World', path: 'foo.bar' },
    ]);

    // nullable: false
    expect(Validator.validate({ enum: ['Hello', 'World'], nullable: false, type: 'enum' }, null)).toEqual([
      { message: 'The value must be one of the following values: Hello, World', path: '' },
    ]);
    expect(Validator.validate({ enum: ['Hello', 'World'], nullable: false, type: 'enum' }, null, path)).toEqual([
      { message: 'The value must be one of the following values: Hello, World', path: 'foo.bar' },
    ]);

    // nullable: true
    expect(Validator.validate({ enum: ['Hello', 'World'], nullable: true, type: 'enum' }, null)).toEqual([]);
    expect(Validator.validate({ enum: ['Hello', 'World'], nullable: true, type: 'enum' }, null, path)).toEqual([]);
  });

  it('should validate the required condition correctly', () => {
    // required: false (default)
    expect(Validator.validate({ enum: ['Hello', 'World'], type: 'enum' }, undefined)).toEqual([]);
    expect(Validator.validate({ enum: ['Hello', 'World'], type: 'enum' }, undefined, path)).toEqual([]);

    // required: false
    expect(Validator.validate({ enum: ['Hello', 'World'], required: false, type: 'enum' }, undefined)).toEqual([]);
    expect(Validator.validate({ enum: ['Hello', 'World'], required: false, type: 'enum' }, undefined, path)).toEqual([]);

    // required: true
    expect(Validator.validate({ enum: ['Hello', 'World'], required: true, type: 'enum' }, undefined)).toEqual([
      { message: 'The value is required', path: '' },
      { message: 'The value must be one of the following values: Hello, World', path: '' },
    ]);
    expect(Validator.validate({ enum: ['Hello', 'World'], required: true, type: 'enum' }, undefined, path)).toEqual([
      { message: 'The value is required', path: 'foo.bar' },
      { message: 'The value must be one of the following values: Hello, World', path: 'foo.bar' },
    ]);
  });

  it('should validate the type condition correctly', () => {
    const schema: SchemaEnum = {
      enum: ['Hello', 'World'],
      nullable: false,
      required: true,
      type: 'enum',
    };

    // string
    expect(Validator.validate(schema, 'Hello World')).toEqual([
      { message: 'The value must be one of the following values: Hello, World', path: '' },
    ]);
    expect(Validator.validate(schema, 'Hello World', path)).toEqual([
      { message: 'The value must be one of the following values: Hello, World', path: 'foo.bar' },
    ]);

    // number
    expect(Validator.validate(schema, 1245)).toEqual([
      { message: 'The value must be one of the following values: Hello, World', path: '' },
    ]);
    expect(Validator.validate(schema, 1245, path)).toEqual([
      { message: 'The value must be one of the following values: Hello, World', path: 'foo.bar' },
    ]);

    // true
    expect(Validator.validate(schema, true)).toEqual([
      { message: 'The value must be one of the following values: Hello, World', path: '' },
    ]);
    expect(Validator.validate(schema, true, path)).toEqual([
      { message: 'The value must be one of the following values: Hello, World', path: 'foo.bar' },
    ]);

    // false
    expect(Validator.validate(schema, false)).toEqual([
      { message: 'The value must be one of the following values: Hello, World', path: '' },
    ]);
    expect(Validator.validate(schema, false, path)).toEqual([
      { message: 'The value must be one of the following values: Hello, World', path: 'foo.bar' },
    ]);

    // undefined
    expect(Validator.validate(schema, undefined)).toEqual([
      { message: 'The value is required', path: '' },
      { message: 'The value must be one of the following values: Hello, World', path: '' },
    ]);
    expect(Validator.validate(schema, undefined, path)).toEqual([
      { message: 'The value is required', path: 'foo.bar' },
      { message: 'The value must be one of the following values: Hello, World', path: 'foo.bar' },
    ]);

    // symbol
    expect(Validator.validate(schema, Symbol('Hello World'))).toEqual([
      { message: 'The value must be one of the following values: Hello, World', path: '' },
    ]);
    expect(Validator.validate(schema, Symbol('Hello World'), path)).toEqual([
      { message: 'The value must be one of the following values: Hello, World', path: 'foo.bar' },
    ]);

    // null
    expect(Validator.validate(schema, null)).toEqual([
      { message: 'The value must be one of the following values: Hello, World', path: '' },
    ]);
    expect(Validator.validate(schema, null, path)).toEqual([
      { message: 'The value must be one of the following values: Hello, World', path: 'foo.bar' },
    ]);

    // NaN
    expect(Validator.validate(schema, NaN)).toEqual([
      { message: 'The value must be one of the following values: Hello, World', path: '' },
    ]);
    expect(Validator.validate(schema, NaN, path)).toEqual([
      { message: 'The value must be one of the following values: Hello, World', path: 'foo.bar' },
    ]);

    // array
    expect(Validator.validate(schema, [])).toEqual([
      { message: 'The value must be one of the following values: Hello, World', path: '' },
    ]);
    expect(Validator.validate(schema, [], path)).toEqual([
      { message: 'The value must be one of the following values: Hello, World', path: 'foo.bar' },
    ]);

    // object
    expect(Validator.validate(schema, {})).toEqual([
      { message: 'The value must be one of the following values: Hello, World', path: '' },
    ]);
    expect(Validator.validate(schema, {}, path)).toEqual([
      { message: 'The value must be one of the following values: Hello, World', path: 'foo.bar' },
    ]);
  });
});
