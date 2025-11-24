import { Request } from 'express';
import { UserPayload } from './user.interface';

export interface RequestWithUser extends Request {
  user: UserPayload;
}
