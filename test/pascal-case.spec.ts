import { pascalCase } from '../src/pascal-case';

it('should convert the text to pascal case', () => {
  expect(pascalCase('hello world 123')).toBe('HelloWorld123');
});
