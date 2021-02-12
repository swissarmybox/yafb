export type { User } from '../../../common/types/user';

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
