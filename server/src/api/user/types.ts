import * as user from '../../common/types/user';

export type User = user.User;

export interface Engine {
  getUsers(): Promise<User[]>;
  getUser(userID: number): Promise<User>;
  deleteUser(userID: number): Promise<void>;
}

export interface Model {
  getUsers(): Promise<User[]>;
  getUser(userID: number): Promise<null | User>;
  deleteUser(userID: number): Promise<boolean>;
}
