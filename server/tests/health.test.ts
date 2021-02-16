import supertest from 'supertest';

describe('Health API', () => {
  it('should returns 200', async () => {
    // @ts-ignore
    const request = supertest(global['server']);
    const res = await request.get('/health');

    expect(res.status).toBe(200);
  });
});
