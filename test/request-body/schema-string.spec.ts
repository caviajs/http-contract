import { HttpRouter } from '@caviajs/http-router';
import http from 'http';
import supertest from 'supertest';
import { HttpContract, SchemaString, ValidationError } from '../../src';
import * as schemaString from '../../src/schema-string';

const CONTENT_TYPES: string[] = [
  'application/xml',
  'text/css',
  'text/csv',
  'text/html',
  'text/plain',
];

const DATA: string = 'Hello World';
const PATH: string[] = ['request', 'body'];
const SCHEMA: SchemaString = { type: 'string' };

describe('SchemaString', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should attempt to convert the data to string and then call validateSchemaString', async () => {
    for (const CONTENT_TYPE of CONTENT_TYPES) {
      const validateSchemaStringSpy = jest
        .spyOn(schemaString, 'validateSchemaString');

      let body: any;

      const httpRouter: HttpRouter = new HttpRouter();

      httpRouter
        .intercept(HttpContract.setup())
        .route({
          handler: (request) => {
            body = request.body;
          },
          metadata: {
            contract: {
              request: {
                body: {
                  [CONTENT_TYPE]: SCHEMA,
                },
              },
            },
          },
          method: 'POST',
          path: '/',
        });

      const httpServer: http.Server = http.createServer((request, response) => {
        httpRouter.handle(request, response);
      });

      await supertest(httpServer)
        .post('/')
        .set('Content-Type', CONTENT_TYPE)
        .send(DATA);

      expect(typeof body).toEqual('string');
      expect(body).toEqual(DATA);

      expect(validateSchemaStringSpy).toHaveBeenNthCalledWith(1, SCHEMA, DATA, PATH);
    }
  });

  it('should return 400 if validateSchemaString return an array with errors', async () => {
    for (const CONTENT_TYPE of CONTENT_TYPES) {
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
                body: {
                  [CONTENT_TYPE]: SCHEMA,
                },
              },
            },
          },
          method: 'POST',
          path: '/',
        });

      const httpServer: http.Server = http.createServer((request, response) => {
        httpRouter.handle(request, response);
      });

      const response = await supertest(httpServer)
        .post('/')
        .set('Content-Type', CONTENT_TYPE)
        .send(DATA);

      expect(response.body).toEqual(errors);
      expect(response.statusCode).toEqual(400);
    }
  });
});
