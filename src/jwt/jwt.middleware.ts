import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UserService } from 'src/user/user.service';
import { JwtService } from './jwt.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    console.log('--------------00000-------------');
    if ('x-jwt' in req.headers) {
      const token = req.headers['x-jwt'];
      console.log('token log:: ' + token);
      const decoded = this.jwtService.verify(token.toString());
      console.log('decoded log:: ' + decoded);
      if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
        try {
          const user = await this.userService.findById(decoded['id']);
          req['user'] = user;
        } catch (err) {
          console.log(err);
        }
      }
    }
    next();
  }
}
