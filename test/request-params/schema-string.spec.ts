import { HttpRouter } from '@caviajs/http-router';
import http from 'http';
import supertest from 'supertest';
import { HttpContract, SchemaString, ValidationError } from '../../src';
import * as schemaString from '../../src/schema-string';

const PARAM_NAME: string = 'id';
const PARAM_VALUE: string = 'hello';
const PARAM_SCHEMA: SchemaString = { type: 'string' };
const PATH: string[] = ['request', 'params', PARAM_NAME];

describe('SchemaString', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should attempt to convert the data to string and then call validateSchemaString', async () => {
    const validateSchemaStringSpy = jest.spyOn(schemaString, 'validateSchemaString');

    let param: any;

    const httpRouter: HttpRouter = new HttpRouter();

    httpRouter
      .intercept(HttpContract.setup())
      .route({
        handler: (request) => {
          param = request.params[PARAM_NAME];
        },
        metadata: {
          contract: {
            request: {
              params: {
                [PARAM_NAME]: PARAM_SCHEMA,
              },
            },
          },
        },
        method: 'POST',
        path: '/:id?',
      });

    const httpServer: http.Server = http.createServer((request, response) => {
      httpRouter.handle(request, response);
    });

    await supertest(httpServer)
      .post(`/${ PARAM_VALUE }`);

    expect(typeof param).toEqual('string');
    expect(param).toEqual(PARAM_VALUE);

    expect(validateSchemaStringSpy).toHaveBeenNthCalledWith(1, PARAM_SCHEMA, PARAM_VALUE, PATH);
  });

  it('should return 400 if validateSchemaString return an array with errors', async () => {
    const errors: ValidationError[] = [{ message: 'Lorem ipsum', path: PATH.join('.') }];

    jest
      .spyOn(schemaString, 'validateSchemaString')
      .mockImplementation(() => errors);

    const httpRouter: HttpRouter = new HttpRouter();

    httpRouter
      .intercept(HttpContract.setup())
      .route({
        handler: () => undefined,
        metadata: {
          contract: {
            request: {
              params: {
                [PARAM_NAME]: PARAM_SCHEMA,
              },
            },
          },
        },
        method: 'POST',
        path: '/:id?',
      });

    const httpServer: http.Server = http.createServer((request, response) => {
      httpRouter.handle(request, response);
    });

    const response = await supertest(httpServer)
      .post(`/${ PARAM_VALUE }`);

    expect(response.body).toEqual(errors);
    expect(response.statusCode).toEqual(400);
  });
});
