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

export interface Engine {
  registerUser(credentials: Credentials): Promise<string>;
  login(credentials: Credentials): Promise<string>;
  getProfile(userID: number): Promise<Profile>;
  changePassword(userID: number, password: Password): Promise<void>;
}

export interface User {
  id: number;
  email: string;
  role: string;
}

export interface EncryptedCredentials {
  hashedPassword: string;
  salt: string;
}

export type UserFull = User & EncryptedCredentials;

export interface NewUser extends EncryptedCredentials {
  email: string;
}

export interface Model {
  getUser(id: number): Promise<null | UserFull>;
  getUserByEmail(email: string): Promise<null | UserFull>;
  createUser(user: NewUser): Promise<number>;
  changeUserPassword(
    userID: number,
    credentials: EncryptedCredentials,
  ): Promise<boolean>;
}

export interface Bcrypt {
  genSalt(rounds: number): Promise<string>;
  hash(password: string, salt: string): Promise<string>;
  compare(password: string, hashedPassword: string): Promise<boolean>;
}

export interface JWT {
  sign(
    payload: any,
    secret: string,
    options: {
      algorithm: 'HS256';
      expiresIn: number;
    },
  ): string;
}
