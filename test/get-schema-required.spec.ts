import { getSchemaRequired } from '../src/get-schema-required';

it('should return false as default value', () => {
  expect(getSchemaRequired({})).toEqual(false);
});

it('should return value from property', () => {
  expect(getSchemaRequired({ required: false })).toEqual(false);
  expect(getSchemaRequired({ required: true })).toEqual(true);
});
