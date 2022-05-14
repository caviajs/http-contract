import { RoutePath, HttpRouter, ApiSpec } from '@caviajs/http-router';

export class HttpContract {
  public static setup(path: RoutePath, httpRouter: HttpRouter): void {
    httpRouter.route({ handler: (): ApiSpec => httpRouter.apiSpec, method: 'GET', path: path });
  }
}
