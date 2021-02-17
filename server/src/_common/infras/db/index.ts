import Knex from 'knex';
import {
  FindAllOpts,
  FindOneOpts,
  InsertOneOpts,
  UpdateOneOpts,
  DeleteOneOpts,
  DB,
} from './types';

export function createDB(knex: Knex): DB {
  async function disconnect(): Promise<void> {
    await knex.destroy();
  }

  async function findAll(table: string, opts: FindAllOpts): Promise<unknown[]> {
    const select = opts.select || ['*'];
    const where = opts.where || {};

    if (opts.join) {
      return await knex
        .from(table)
        .innerJoin(opts.join.table, opts.join.first, opts.join.second)
        .select(...select)
        .where(where);
    }

    return await knex
      .from(table)
      .select(...select)
      .where(where);
  }

  async function findOne(
    table: string,
    opts: FindOneOpts,
  ): Promise<null | unknown> {
    const select = opts.select || ['*'];

    let rows: unknown[] = [];

    if (opts.join) {
      rows = await knex
        .from(table)
        .innerJoin(opts.join.table, opts.join.first, opts.join.second)
        .select(...select)
        .where(opts.where);
    } else {
      rows = await knex
        .from(table)
        .select(...select)
        .where(opts.where);
    }

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  }

  async function insertOne(
    table: string,
    opts: InsertOneOpts,
  ): Promise<number> {
    const [id] = await knex.from(table).insert(opts.data, 'id');

    return id;
  }

  async function updateOne(
    table: string,
    opts: UpdateOneOpts,
  ): Promise<boolean> {
    const rowChanged = await knex
      .from(table)
      .update(opts.data)
      .where(opts.where);

    if (rowChanged === 0) {
      return false;
    }

    return true;
  }

  async function deleteOne(
    table: string,
    opts: DeleteOneOpts,
  ): Promise<boolean> {
    const rowChanged = await knex.from(table).del().where(opts.where);

    if (rowChanged === 0) {
      return false;
    }

    return true;
  }

  async function deleteAll(table: string): Promise<void> {
    await knex.from(table).del();
  }

  async function resetTable(table: string): Promise<void> {
    await knex.raw(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE`);
  }

  return {
    disconnect,
    findAll,
    findOne,
    insertOne,
    updateOne,
    deleteOne,
    deleteAll,
    resetTable,
  };
}
