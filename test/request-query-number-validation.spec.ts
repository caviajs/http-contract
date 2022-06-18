import { HttpRouter, RouteMetadata } from '@caviajs/http-router';
import http from 'http';
import supertest from 'supertest';
import { HttpContract } from '../src';

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

it('should validate the max condition correctly', async () => {
  const httpServer = createServer({
    contract: {
      request: {
        query: {
          age: {
            max: 10,
            type: 'number',
          },
        },
      },
    },
  });

  // greater than max
  {
    const response = await supertest(httpServer)
      .post('/')
      .query({ age: '15' });

    expect(response.body).toEqual([
      { message: 'The value should be less than or equal to 10', path: 'request.query.age' },
    ]);
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(response.statusCode).toEqual(400);
  }

  // equal to max
  {
    const response = await supertest(httpServer)
      .post('/')
      .query({ age: '10' });

    expect(response.body).toEqual({});
    expect(response.headers['content-type']).toBeUndefined();
    expect(response.statusCode).toEqual(200);
  }

  // less than max
  {
    const response = await supertest(httpServer)
      .post('/')
      .query({ age: '5' });

    expect(response.body).toEqual({});
    expect(response.headers['content-type']).toBeUndefined();
    expect(response.statusCode).toEqual(200);
  }
});


it('should validate the min condition correctly', async () => {
  const httpServer = createServer({
    contract: {
      request: {
        query: {
          age: {
            min: 10,
            type: 'number',
          },
        },
      },
    },
  });

  // greater than min
  {
    const response = await supertest(httpServer)
      .post('/')
      .query({ age: '15' });

    expect(response.body).toEqual({});
    expect(response.headers['content-type']).toBeUndefined();
    expect(response.statusCode).toEqual(200);
  }

  // equal to min
  {
    const response = await supertest(httpServer)
      .post('/')
      .query({ age: '10' });

    expect(response.body).toEqual({});
    expect(response.headers['content-type']).toBeUndefined();
    expect(response.statusCode).toEqual(200);
  }

  // less than min
  {
    const response = await supertest(httpServer)
      .post('/')
      .query({ age: '5' });

    expect(response.body).toEqual([
      { message: 'The value should be greater than or equal to 10', path: 'request.query.age' },
    ]);
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(response.statusCode).toEqual(400);
  }
});

it('should validate the required condition correctly', async () => {
  // required: false (default)
  {
    const httpServer = createServer({
      contract: {
        request: {
          query: {
            age: {
              type: 'number',
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
              type: 'number',
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
              type: 'number',
            },
          },
        },
      },
    });

    const response = await supertest(httpServer)
      .post('/');

    expect(response.body).toEqual([
      { message: 'The value is required', path: 'request.query.age' },
      { message: 'The value should be number', path: 'request.query.age' },
    ]);
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8');
    expect(response.statusCode).toEqual(400);
  }
});
