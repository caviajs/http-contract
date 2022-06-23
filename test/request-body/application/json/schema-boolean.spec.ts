import { HttpRouter } from '@caviajs/http-router';
import http from 'http';
import supertest from 'supertest';
import { HttpContract } from '../../../../src';

it('should convert request stream to boolean (true)', async () => {
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
              contentSchema: { type: 'boolean' },
              contentType: 'application/json',
            },
          }
        }
      },
      method: 'POST',
      path: '/',
    });

  const httpServer: http.Server = http.createServer((request, response) => {
    httpRouter.handle(request, response);
  });

  await supertest(httpServer)
    .post('/')
    .set('Content-Type', 'application/json')
    .send('true');

  expect(typeof body).toEqual('boolean');
  expect(body).toEqual(true);
});

it('should convert request stream to boolean (false)', async () => {
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
              contentSchema: { type: 'boolean' },
              contentType: 'application/json',
            },
          }
        }
      },
      method: 'POST',
      path: '/',
    });

  const httpServer: http.Server = http.createServer((request, response) => {
    httpRouter.handle(request, response);
  });

  await supertest(httpServer)
    .post('/')
    .set('Content-Type', 'application/json')
    .send('false');

  expect(typeof body).toEqual('boolean');
  expect(body).toEqual(false);
});
