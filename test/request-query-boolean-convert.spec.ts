import { HttpRouter } from '@caviajs/http-router';
import { HttpContract } from '../src';
import http from 'http';
import supertest from 'supertest';

it('should convert boolean string to a boolean ("true")', async () => {
  let included: any;

  const httpRouter: HttpRouter = new HttpRouter();

  httpRouter
    .intercept(HttpContract.setup())
    .route({
      handler: (req) => {
        included = req.query.included;
      },
      metadata: {
        contract: {
          request: {
            query: {
              included: {
                type: 'boolean',
              },
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
    .query({ included: 'true' });

  expect(included).toEqual(true);
  expect(typeof included).toBe('boolean');
});

it('should convert boolean string to a boolean ("false")', async () => {
  let included: any;

  const httpRouter: HttpRouter = new HttpRouter();

  httpRouter
    .intercept(HttpContract.setup())
    .route({
      handler: (req) => {
        included = req.query.included;
      },
      metadata: {
        contract: {
          request: {
            query: {
              included: {
                type: 'boolean',
              },
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
    .query({ included: 'false' });

  expect(included).toEqual(false);
  expect(typeof included).toBe('boolean');
});
