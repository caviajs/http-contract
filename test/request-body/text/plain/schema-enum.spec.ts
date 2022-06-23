import { HttpRouter } from '@caviajs/http-router';
import http from 'http';
import supertest from 'supertest';
import { HttpContract } from '../../../../src';

it('should convert request stream to string', async () => {
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
              contentSchema: { enum: ['hello', 'world'], type: 'enum' },
              contentType: 'text/plain',
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
    .set('Content-Type', 'text/plain')
    .send('hello');

  expect(typeof body).toEqual('string');
  expect(body).toEqual('hello');
});
