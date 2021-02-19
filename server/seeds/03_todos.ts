import * as Knex from "knex";

export async function seed(knex: Knex): Promise<void> {
    await knex("todos").del();

    await knex("todos").insert([
        {
          id: 1,
          title: 'Buy eggs',
          description: 'Buy a dozen of eggs from 711',
          user_id: 2,
        },
        {
          id: 2,
          title: 'Buy milk',
          description: 'Buy a carton of milk from Walgreen',
          user_id: 2,
        },
        {
          id: 3,
          title: 'Feed dog',
          description: 'Feed dog at 5 PM',
          user_id: 2,
        },
        {
          id: 4,
          title: 'Yoga class',
          description: 'Yoga class today at 6:30 PM',
          user_id: 2,
        }
    ]);
};
