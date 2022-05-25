import { SchemaBoolean, Validator } from '../src';

const path: string[] = ['foo', 'bar'];

describe('SchemaBoolean', () => {
  it('should validate the nullable condition correctly', () => {
    // nullable: false (default)
    expect(Validator.validate({ type: 'boolean' }, null)).toEqual([
      { message: 'The value should be boolean', path: '' },
    ]);
    expect(Validator.validate({ type: 'boolean' }, null, path)).toEqual([
      { message: 'The value should be boolean', path: 'foo.bar' },
    ]);

    // nullable: false
    expect(Validator.validate({ nullable: false, type: 'boolean' }, null)).toEqual([
      { message: 'The value should be boolean', path: '' },
    ]);
    expect(Validator.validate({ nullable: false, type: 'boolean' }, null, path)).toEqual([
      { message: 'The value should be boolean', path: 'foo.bar' },
    ]);

    // nullable: true
    expect(Validator.validate({ nullable: true, type: 'boolean' }, null)).toEqual([]);
    expect(Validator.validate({ nullable: true, type: 'boolean' }, null, path)).toEqual([]);
  });

  it('should validate the required condition correctly', () => {
    // required: false (default)
    expect(Validator.validate({ type: 'boolean' }, undefined)).toEqual([]);
    expect(Validator.validate({ type: 'boolean' }, undefined, path)).toEqual([]);

    // required: false
    expect(Validator.validate({ required: false, type: 'boolean' }, undefined)).toEqual([]);
    expect(Validator.validate({ required: false, type: 'boolean' }, undefined, path)).toEqual([]);

    // required: true
    expect(Validator.validate({ required: true, type: 'boolean' }, undefined)).toEqual([
      { message: 'The value is required', path: '' },
      { message: 'The value should be boolean', path: '' },
    ]);
    expect(Validator.validate({ required: true, type: 'boolean' }, undefined, path)).toEqual([
      { message: 'The value is required', path: 'foo.bar' },
      { message: 'The value should be boolean', path: 'foo.bar' },
    ]);
  });

  it('should validate the type condition correctly', () => {
    const schema: SchemaBoolean = {
      nullable: false,
      required: true,
      type: 'boolean',
    };

    // string
    expect(Validator.validate(schema, 'Hello World')).toEqual([
      { message: 'The value should be boolean', path: '' },
    ]);
    expect(Validator.validate(schema, 'Hello World', path)).toEqual([
      { message: 'The value should be boolean', path: 'foo.bar' },
    ]);

    // number
    expect(Validator.validate(schema, 1245)).toEqual([
      { message: 'The value should be boolean', path: '' },
    ]);
    expect(Validator.validate(schema, 1245, path)).toEqual([
      { message: 'The value should be boolean', path: 'foo.bar' },
    ]);

    // true
    expect(Validator.validate(schema, true)).toEqual([]);
    expect(Validator.validate(schema, true, path)).toEqual([]);

    // false
    expect(Validator.validate(schema, false)).toEqual([]);
    expect(Validator.validate(schema, false, path)).toEqual([]);

    // undefined
    expect(Validator.validate(schema, undefined)).toEqual([
      { message: 'The value is required', path: '' },
      { message: 'The value should be boolean', path: '' },
    ]);
    expect(Validator.validate(schema, undefined, path)).toEqual([
      { message: 'The value is required', path: 'foo.bar' },
      { message: 'The value should be boolean', path: 'foo.bar' },
    ]);

    // symbol
    expect(Validator.validate(schema, Symbol('Hello World'))).toEqual([
      { message: 'The value should be boolean', path: '' },
    ]);
    expect(Validator.validate(schema, Symbol('Hello World'), path)).toEqual([
      { message: 'The value should be boolean', path: 'foo.bar' },
    ]);

    // null
    expect(Validator.validate(schema, null)).toEqual([
      { message: 'The value should be boolean', path: '' },
    ]);
    expect(Validator.validate(schema, null, path)).toEqual([
      { message: 'The value should be boolean', path: 'foo.bar' },
    ]);

    // NaN
    expect(Validator.validate(schema, NaN)).toEqual([
      { message: 'The value should be boolean', path: '' },
    ]);
    expect(Validator.validate(schema, NaN, path)).toEqual([
      { message: 'The value should be boolean', path: 'foo.bar' },
    ]);

    // array
    expect(Validator.validate(schema, [])).toEqual([
      { message: 'The value should be boolean', path: '' },
    ]);
    expect(Validator.validate(schema, [], path)).toEqual([
      { message: 'The value should be boolean', path: 'foo.bar' },
    ]);

    // object
    expect(Validator.validate(schema, {})).toEqual([
      { message: 'The value should be boolean', path: '' },
    ]);
    expect(Validator.validate(schema, {}, path)).toEqual([
      { message: 'The value should be boolean', path: 'foo.bar' },
    ]);
  });
});
