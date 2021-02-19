import * as Knex from "knex";
import bcrypt from 'bcrypt'

export async function seed(knex: Knex): Promise<void> {
  await knex("users").del();

  const adminPass = 'admin'
  const adminSalt = await bcrypt.genSalt(10)
  const adminHashedPass = await bcrypt.hash(adminPass, adminSalt)

    await knex("users").insert([
        {
          id: 1,
          email: "admin@mail.com",
          hashed_password: adminHashedPass,
          salt: adminSalt,
          role_id: 1,
        },
    ])

  const userPass = 'user'
  const userSalt = await bcrypt.genSalt(10)
  const userHashedPass = await bcrypt.hash(userPass, userSalt)

    await knex('users').insert([
        {
          id: 2,
          email: "user@mail.com",
          hashed_password: userHashedPass,
          salt: userSalt,
          role_id: 2,
        },
    ]);
};
