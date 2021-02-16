import supertest from 'supertest';
import { parseCookie } from '../../utils';

describe('DELETE /api/user/:id', () => {
  const USERTABLE = 'users';
  const ADMIN_ROLE = 1;
  const USER_ROLE = 2;

  beforeEach(async () => {
    // @ts-ignore
    await global['infras'].db.resetTable(USERTABLE);
  });

  it('given no cookie, should fail to delete user', async () => {
    // Arrange
    // @ts-ignore
    const request = supertest(global['server']);

    // Act
    const res = await request.delete('/api/users/1').send();

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

  it('given cookie but incorrect role, should fail to delete user', async () => {
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
      .delete('/api/users/1')
      .set('Cookie', `jwt=${jwtCookie};`)
      .send();

    // Assert
    expect(res2.status).toBe(401);
    expect(res2.body.status).toBe('failure');
    expect(res2.body.error).toEqual({
      code: 401,
      name: 'UNAUTHORIZED_ERROR',
      message: 'User is not authorized',
      isOperational: true,
    });
  });

  it('given cookie, correct role but wrong user id, should fail to delete user', async () => {
    // Arrange
    const email = 'admin@email.com';
    const password = '123456';

    // @ts-ignore
    const request = supertest(global['server']);
    await request.post('/auth/register').send({
      email,
      password,
    });

    // @ts-ignore
    const db = global['infras'].db;
    const admin = await db.findOne(USERTABLE, {
      where: {
        email,
      },
    });

    await db.updateOne(USERTABLE, {
      where: {
        id: admin.id,
      },
      data: {
        role_id: ADMIN_ROLE,
      },
    });

    const res = await request.post('/auth/login').send({
      email,
      password,
    });

    const jwtCookie = parseCookie(res.header);

    // Act
    const res2 = await request
      .delete('/api/users/abcdef')
      .set('Cookie', `jwt=${jwtCookie};`)
      .send();

    // Assert
    expect(res2.status).toBe(400);
    expect(res2.body.status).toBe('failure');
    expect(res2.body.error).toEqual({
      code: 400,
      name: 'INVALID_PARAMETER_ERROR',
      message: '"value" must be a number',
      isOperational: true,
    });
  });

  it('given cookie, correct role but non existing user id, should fail to delete user', async () => {
    // Arrange
    const email = 'admin@email.com';
    const password = '123456';

    // @ts-ignore
    const request = supertest(global['server']);
    await request.post('/auth/register').send({
      email,
      password,
    });

    // @ts-ignore
    const db = global['infras'].db;
    const admin = await db.findOne(USERTABLE, {
      where: {
        email,
      },
    });

    await db.updateOne(USERTABLE, {
      where: {
        id: admin.id,
      },
      data: {
        role_id: ADMIN_ROLE,
      },
    });

    const res = await request.post('/auth/login').send({
      email,
      password,
    });

    const jwtCookie = parseCookie(res.header);

    // Act
    const res2 = await request
      .delete('/api/users/2')
      .set('Cookie', `jwt=${jwtCookie};`)
      .send();

    // Assert
    expect(res2.status).toBe(404);
    expect(res2.body.status).toBe('failure');
    expect(res2.body.error).toEqual({
      code: 404,
      name: 'NOT_FOUND_ERROR',
      message: 'Failed to delete user with id 2',
      isOperational: true,
    });
  });

  it('given cookie and correct role, should be able to delete user', async () => {
    // Arrange
    const email = 'admin@email.com';
    const password = '123456';

    // @ts-ignore
    const request = supertest(global['server']);
    await request.post('/auth/register').send({
      email,
      password,
    });

    // @ts-ignore
    const db = global['infras'].db;
    const admin = await db.findOne(USERTABLE, {
      where: {
        email,
      },
    });

    await db.updateOne(USERTABLE, {
      where: {
        id: admin.id,
      },
      data: {
        role_id: ADMIN_ROLE,
      },
    });

    await db.insertOne(USERTABLE, {
      data: {
        email: 'hello@world.com',
        role_id: USER_ROLE,
        salt: 'abcde',
        hashed_password: 'fghij',
      },
    });

    const res = await request.post('/auth/login').send({
      email,
      password,
    });

    const jwtCookie = parseCookie(res.header);

    // Act
    const res2 = await request
      .delete('/api/users/2')
      .set('Cookie', `jwt=${jwtCookie};`)
      .send();

    // Assert
    expect(res2.status).toBe(200);
    expect(res2.body).toEqual({
      status: 'success',
      data: null,
    });
  });
});
