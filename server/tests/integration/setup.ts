// @ts-nocheck
import { infras, server } from '../../src';

beforeAll(async () => {
  global['infras'] = infras;
  global['server'] = server;
});

afterAll(async () => {
  await global['infras'].db.disconnect();
  await new Promise((resolve) => {
    global['server'].close(() => resolve());
  });
});
