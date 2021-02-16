import supertest from 'supertest';
import { parseCookie } from '../utils';

describe('POST /auth/login', () => {
  const USERTABLE = 'users';

  beforeEach(async () => {
    // @ts-ignore
    await global['infras'].db.resetTable(USERTABLE);
  });

  it('given faulty credentials, should fail to register', async () => {
    // Arrange
    // @ts-ignore
    const request = supertest(global['server']);

    // Act
    const res = await request.post('/auth/login').send({
      emailxyz: 1,
      password: '123456',
    });

    // Assert
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('failure');
    expect(res.body.error).toEqual({
      code: 400,
      name: 'INVALID_PARAMETER_ERROR',
      message: '"email" is required',
      isOperational: true,
    });
  });

  it('given unregistered credentials, should fails to login', async () => {
    // Arrange
    // @ts-ignore
    const request = supertest(global['server']);

    // Act
    const res = await request.post('/auth/login').send({
      email: 'user@email.com',
      password: '123456',
    });

    // Assert
    expect(res.status).toBe(401);
    expect(res.body.status).toBe('failure');
    expect(res.body.error).toEqual({
      code: 401,
      name: 'UNAUTHORIZED_ERROR',
      message: 'User is not registered',
      isOperational: true,
    });
  });

  it('given wrong password, should fails to login', async () => {
    // Arrange
    // @ts-ignore
    const request = supertest(global['server']);
    await request.post('/auth/register').send({
      email: 'user@email.com',
      password: '123456',
    });

    // Act
    const res = await request.post('/auth/login').send({
      email: 'user@email.com',
      password: 'abcdefg',
    });

    // Assert
    expect(res.status).toBe(401);
    expect(res.body.status).toBe('failure');
    expect(res.body.error).toEqual({
      code: 401,
      name: 'UNAUTHORIZED_ERROR',
      message: 'Invalid password',
      isOperational: true,
    });
  });

  it('given correct password, should successfully login', async () => {
    // Arrange
    // @ts-ignore
    const request = supertest(global['server']);
    await request.post('/auth/register').send({
      email: 'user@email.com',
      password: '123456',
    });

    // Act
    const res = await request.post('/auth/login').send({
      email: 'user@email.com',
      password: '123456',
    });

    // Assert
    const jwtCookie = parseCookie(res.header);

    expect(jwtCookie.length).toBeGreaterThan(0);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      status: 'success',
      data: null,
    });
  });
});
