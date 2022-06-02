import http from 'http';
import { Observable } from 'rxjs';
import { HttpException } from '@caviajs/http-exception';
import { Interceptor, Next } from '@caviajs/http-router';
import { ValidationError } from './types/validation-error';
import { getContentTypeMime } from './utils/get-content-type-mime';

export function createValidator(): Interceptor {
  return (request: http.IncomingMessage, response: http.ServerResponse, next: Next): Observable<any> => {
    const errors: ValidationError[] = [];

    // tutaj walidacja requesta?
    request.metadata.contract.request.body.contentType; // getContentTypeMime(request.headers['content-type'])
    request.metadata.contract.request.body.contentSchema;

    request.metadata.contract.request.headers;
    request.metadata.contract.request.params;
    request.metadata.contract.request.query;

    // tutaj walidajca response?
    request.metadata.contract.responses[200].body;
    request.metadata.contract.responses[200].headers;

    if (errors.length > 0) {
      throw new HttpException(400, errors);
    }

    return next.handle();
  };
}
