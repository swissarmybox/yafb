import { APIResult } from './common';

export interface Credentials {
  email: string;
  password: string;
}

export interface Profile {
  id: number;
  email: string;
  role: string;
}

export interface Password {
  oldPassword: string;
  newPassword: string;
}
