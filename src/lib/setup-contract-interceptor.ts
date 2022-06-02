import http from 'http';
import { Observable } from 'rxjs';
import { HttpException } from '@caviajs/http-exception';
import { HttpRouter, Next } from '@caviajs/http-router';
import { getContentTypeMime } from './utils/get-content-type-mime';
import { ValidationError, Validator } from './validator';

export function setupContractInterceptor(httpRouter: HttpRouter): void {
  httpRouter.intercept((request: http.IncomingMessage, response: http.ServerResponse, next: Next): Observable<any> => {
    const errors: ValidationError[] = [];

    if (request.metadata?.contract?.request?.body) {
      const mime: string | undefined = getContentTypeMime(request.headers['content-type'] || '');

      // + buffer magic number scanning?
      if (request.metadata.contract.request.body.contentType.toLowerCase() !== mime?.toLowerCase()) {
        errors.push({ message: 'The content-type is invalid', path: 'request' });
      }

      errors.push(...Validator.validate(request.metadata.contract.request.body.contentSchema, request['body']));
    }

    if (request.metadata?.contract?.request?.headers) {
      for (const [name, schema] of Object.entries(request.metadata.contract.request.headers)) {
        errors.push(...Validator.validate(schema, request['headers'], ['request', 'headers', name]));
      }
    }

    if (request.metadata?.contract?.request?.params) {
      for (const [name, schema] of Object.entries(request.metadata.contract.request.params)) {
        errors.push(...Validator.validate(schema, request['headers'], ['request', 'params', name]));
      }
    }

    if (request.metadata?.contract?.request?.query) {
      for (const [name, schema] of Object.entries(request.metadata.contract.request.query)) {
        errors.push(...Validator.validate(schema, request['headers'], ['request', 'query', name]));
      }
    }

    // tutaj walidajca response?
    // request.metadata.contract.responses[200].body;
    // request.metadata.contract.responses[200].headers;

    if (errors.length > 0) {
      throw new HttpException(400, errors);
    }

    return next.handle();
  });
}
