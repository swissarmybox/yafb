import supertest from 'supertest';
import { parseCookie } from '../../utils';

describe('PATCH /auth/password', () => {
  const USERTABLE = 'users';

  beforeEach(async () => {
    // @ts-ignore
    await global['infras'].db.resetTable(USERTABLE);
  });

  it('given no cookie, should fail to change password', async () => {
    // Arrange
    // @ts-ignore
    const request = supertest(global['server']);

    // Act
    const res = await request.patch('/auth/password').send({
      oldPassword: 'hello',
      newPassword: 'world',
    });

    // Assert
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('failure');
    expect(res.body.error).toEqual({
      code: 400,
      name: 'TOKEN_INVALID_ERROR',
      message: 'JWT token not found',
      isOperational: true,
    });
  });

  it('given cookie but faulty credentials, should fail to change password', async () => {
    // Arrange
    // @ts-ignore
    const request = supertest(global['server']);
    const res = await request.post('/auth/register').send({
      email: 'user@email.com',
      password: '123456',
    });

    const jwtCookie = parseCookie(res.header);

    // Act
    const res2 = await request
      .patch('/auth/password')
      .set('Cookie', `jwt=${jwtCookie};`)
      .send({
        papapassword: 'hello',
        newPassword: 'world',
      });

    // Assert
    expect(res2.status).toBe(400);
    expect(res2.body.status).toBe('failure');
    expect(res2.body.error).toEqual({
      code: 400,
      name: 'INVALID_PARAMETER_ERROR',
      message: '"oldPassword" is required',
      isOperational: true,
    });
  });

  it('given cookie but incorrect password, should fail to change password', async () => {
    // Arrange
    // @ts-ignore
    const request = supertest(global['server']);
    const res = await request.post('/auth/register').send({
      email: 'user@email.com',
      password: '123456',
    });

    const jwtCookie = parseCookie(res.header);

    // Act
    const res2 = await request
      .patch('/auth/password')
      .set('Cookie', `jwt=${jwtCookie};`)
      .send({
        oldPassword: 'abcdefghij',
        newPassword: 'world',
      });

    // Assert
    expect(res2.status).toBe(401);
    expect(res2.body.status).toBe('failure');
    expect(res2.body.error).toEqual({
      code: 401,
      name: 'UNAUTHORIZED_ERROR',
      message: 'Invalid old password',
      isOperational: true,
    });
  });

  it('given cookie and correct password, should be able to change password and logout', async () => {
    // Arrange
    // @ts-ignore
    const request = supertest(global['server']);
    const res = await request.post('/auth/register').send({
      email: 'user@email.com',
      password: '123456',
    });

    const jwtCookie = parseCookie(res.header);

    // Act
    const res2 = await request
      .patch('/auth/password')
      .set('Cookie', `jwt=${jwtCookie};`)
      .send({
        oldPassword: '123456',
        newPassword: '12345678',
      });

    // Assert
    const jwtCookie2 = parseCookie(res2.header);
    expect(jwtCookie2.length).toBe(0); // Logout
    expect(res2.status).toBe(200);
    expect(res2.body).toEqual({
      status: 'success',
      data: null,
    });

    // Act
    const res3 = await request.post('/auth/login').send({
      email: 'user@email.com',
      password: '12345678',
    });

    // Assert
    const jwtCookie3 = parseCookie(res3.header);

    expect(jwtCookie3.length).toBeGreaterThan(0);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      status: 'success',
      data: null,
    });
  });
});
