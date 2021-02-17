export interface User {
  id: number;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

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
