import supertest from 'supertest';
import { parseCookie } from '../../../utils';

describe('DELETE /api/todos/:id', () => {
  const USER_TABLE = 'users';
  const TODO_TABLE = 'todos';

  beforeEach(async () => {
    // @ts-ignore
    const db = global['infras'].db;

    await db.resetTable(TODO_TABLE);
    await db.resetTable(USER_TABLE);
  });

  it('given no cookie, should fail to delete todo', async () => {
    // Arrange
    // @ts-ignore
    const request = supertest(global['server']);

    // Act
    const res = await request.delete('/api/todos/1').send();

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

  it('given cookie but wrong todo id, should fail to delete todo', async () => {
    // Arrange
    const email = 'user@email.com';
    const password = '123456';

    // @ts-ignore
    const request = supertest(global['server']);
    await request.post('/auth/register').send({
      email,
      password,
    });

    const res = await request.post('/auth/login').send({
      email,
      password,
    });

    const jwtCookie = parseCookie(res.header);

    // Act
    const res2 = await request
      .delete('/api/todos/abcdefg')
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

  it('given cookie but non existing todo id, should fail to delete todo', async () => {
    // Arrange
    const email = 'user@email.com';
    const password = '123456';

    // @ts-ignore
    const request = supertest(global['server']);
    await request.post('/auth/register').send({
      email,
      password,
    });

    const res = await request.post('/auth/login').send({
      email,
      password,
    });

    const jwtCookie = parseCookie(res.header);

    // Act
    const res2 = await request
      .delete('/api/todos/1')
      .set('Cookie', `jwt=${jwtCookie};`)
      .send();

    // Assert
    expect(res2.status).toBe(404);
    expect(res2.body.status).toBe('failure');
    expect(res2.body.error).toEqual({
      code: 404,
      name: 'NOT_FOUND_ERROR',
      message: 'Failed to delete todo with id 1',
      isOperational: true,
    });
  });

  it('given cookie, should be able to delete todo', async () => {
    // Arrange
    const email = 'user@email.com';
    const password = '123456';

    // @ts-ignore
    const request = supertest(global['server']);
    await request.post('/auth/register').send({
      email,
      password,
    });

    // @ts-ignore
    const db = global['infras'].db;

    const user = await db.findOne(USER_TABLE, {
      where: {
        email,
      },
    });

    await db.insertOne(TODO_TABLE, {
      data: {
        title: 'Todo 1',
        description: 'Todo 1',
        user_id: user.id,
      },
    });

    const res = await request.post('/auth/login').send({
      email,
      password,
    });

    const jwtCookie = parseCookie(res.header);

    // Act
    const res2 = await request
      .delete('/api/todos/1')
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
