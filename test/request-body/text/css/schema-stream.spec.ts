import { HttpRouter } from '@caviajs/http-router';
import http from 'http';
import supertest from 'supertest';
import { Readable } from 'stream';
import { HttpContract } from '../../../../src';

it('should convert request stream to Readable stream', async () => {
  let body: Readable;
  let bodyBuffer: Buffer = Buffer.alloc(0);

  const httpRouter: HttpRouter = new HttpRouter();

  httpRouter
    .intercept(HttpContract.setup())
    .route({
      handler: async (request) => {
        body = request.body;

        await new Promise<void>(resolve => {
          request.body.on('data', (chunk: Buffer) => bodyBuffer = Buffer.concat([bodyBuffer, chunk]));
          request.body.on('end', () => resolve());
        });
      },
      metadata: {
        contract: {
          request: {
            body: {
              'text/css': { type: 'stream' },
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
    .set('Content-Type', 'text/css')
    .send('Hello World');

  expect(body instanceof Readable).toEqual(true);
  expect(bodyBuffer.toString()).toEqual('Hello World');
});
