import { Color } from './Color';
import { User } from './User';

export type Player = {
  user: User,
  code: string,
  language: string,
  submissions: any,
  solved: boolean,
  color: Color,
};
