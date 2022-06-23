import { HttpRouter, RouteMetadata } from '@caviajs/http-router';
import http from 'http';
import supertest from 'supertest';
import { HttpContract } from '../../src';

function createServer(routeMetadata: RouteMetadata): http.Server {
  const httpRouter: HttpRouter = new HttpRouter();

  httpRouter
    .intercept(HttpContract.setup())
    .route({
      handler: () => undefined,
      metadata: routeMetadata,
      method: 'POST',
      path: '/',
    });

  return http.createServer((request, response) => {
    httpRouter.handle(request, response);
  });
}

it('should validate the required condition correctly', async () => {
  // required: false (default)
  {
    const httpServer = createServer({
      contract: {
        request: {
          query: {
            age: {
              type: 'boolean',
            },
          },
        },
      },
    });

    const response = await supertest(httpServer)
      .post('/');

    expect(response.body).toEqual({});
    expect(response.headers['content-type']).toBeUndefined();
    expect(response.statusCode).toEqual(200);
  }

  // required: false
  {
    const httpServer = createServer({
      contract: {
        request: {
          query: {
            age: {
              required: false,
              type: 'boolean',
            },
          },
        },
      },
    });

    const response = await supertest(httpServer)
      .post('/');

    expect(response.body).toEqual({});
    expect(response.headers['content-type']).toBeUndefined();
    expect(response.statusCode).toEqual(200);
  }

  // required: true
  {
    const httpServer = createServer({
      contract: {
        request: {
          query: {
            age: {
              required: true,
              type: 'boolean',
            },
          },
        },
      },
    });

    const response = await supertest(httpServer)
      .post('/');

    expect(response.body).toEqual([
      { message: 'The value is required', path: 'request.query.age' },
      { message: 'The value should be boolean', path: 'request.query.age' },
    ]);
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(response.statusCode).toEqual(400);
  }
});

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
