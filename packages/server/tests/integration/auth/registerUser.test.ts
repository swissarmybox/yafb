import supertest from 'supertest';
import { parseCookie } from '../../utils';

describe('POST /auth/register', () => {
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
    const res = await request.post('/auth/register').send({
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

  it('given credentials, should register and give cookie', async () => {
    // Arrange
    // @ts-ignore
    const request = supertest(global['server']);

    // Act
    const res = await request.post('/auth/register').send({
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

  it('given duplicate emails, should fail to register', async () => {
    // Arrange
    // @ts-ignore
    const request = supertest(global['server']);
    await request.post('/auth/register').send({
      email: 'user@email.com',
      password: '123456',
    });

    // Act
    const res = await request.post('/auth/register').send({
      email: 'user@email.com',
      password: 'abcdefghij',
    });

    // Assert
    expect(res.status).toBe(409);
    expect(res.body.status).toBe('failure');
    expect(res.body.error).toEqual({
      code: 409,
      name: 'DUPLICATE_USER_ERROR',
      message: 'User email already exist',
      isOperational: true,
    });
  });
});
