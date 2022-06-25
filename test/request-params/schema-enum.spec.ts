import { HttpRouter } from '@caviajs/http-router';
import http from 'http';
import supertest from 'supertest';
import { HttpContract, SchemaEnum, ValidationError } from '../../src';
import * as schemaEnum from '../../src/schema-enum';

const PARAM_NAME: string = 'id';
const PARAM_VALUE: string = 'hello';
const PARAM_SCHEMA: SchemaEnum = { enum: ['hello', 'world'], type: 'enum' };
const PATH: string[] = ['request', 'params', PARAM_NAME];

describe('SchemaEnum', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should attempt to convert the data to enum and then call validateSchemaEnum', async () => {
    const validateSchemaEnumSpy = jest.spyOn(schemaEnum, 'validateSchemaEnum');

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

    expect(validateSchemaEnumSpy).toHaveBeenNthCalledWith(1, PARAM_SCHEMA, PARAM_VALUE, PATH);
  });

  it('should return 400 if validateSchemaEnum return an array with errors', async () => {
    const errors: ValidationError[] = [{ message: 'Lorem ipsum', path: PATH.join('.') }];

    jest
      .spyOn(schemaEnum, 'validateSchemaEnum')
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
