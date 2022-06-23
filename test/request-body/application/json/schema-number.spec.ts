import { HttpRouter } from '@caviajs/http-router';
import http from 'http';
import supertest from 'supertest';
import { HttpContract } from '../../../../src';

it('should convert request stream to number', async () => {
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
              contentSchema: { type: 'number' },
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
    .send('1245');

  expect(typeof body).toEqual('number');
  expect(body).toEqual(1245);
});
