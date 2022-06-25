import { HttpRouter } from '@caviajs/http-router';
import http from 'http';
import supertest from 'supertest';
import { HttpContract, SchemaNumber, ValidationError } from '../../src';
import * as schemaNumber from '../../src/schema-number';

const PARAM_NAME: string = 'id';
const PARAM_VALUE: number = 1245;
const PARAM_SCHEMA: SchemaNumber = { type: 'number' };
const PATH: string[] = ['request', 'params', PARAM_NAME];

describe('SchemaNumber', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should attempt to convert the data to number and then call validateSchemaNumber', async () => {
    const validateSchemaNumberSpy = jest.spyOn(schemaNumber, 'validateSchemaNumber');

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

    expect(typeof param).toEqual('number');
    expect(param).toEqual(PARAM_VALUE);

    expect(validateSchemaNumberSpy).toHaveBeenNthCalledWith(1, PARAM_SCHEMA, PARAM_VALUE, PATH);
  });

  it('should return 400 if validateSchemaNumber return an array with errors', async () => {
    const errors: ValidationError[] = [{ message: 'Lorem ipsum', path: PATH.join('.') }];

    jest
      .spyOn(schemaNumber, 'validateSchemaNumber')
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
