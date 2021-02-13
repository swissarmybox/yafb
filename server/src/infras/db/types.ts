export interface FindAllOpts {
  where?: {
    [field: string]: string | number | boolean;
  };
  select?: string[];
}

export interface FindOneOpts {
  where: {
    [field: string]: string | number | boolean;
  };
  select?: string[];
}

export interface InsertOneOpts {
  data: {
    [field: string]: string | number | boolean;
  };
}

export interface UpdateOneOpts {
  where: {
    [field: string]: string | number | boolean;
  };
  data: {
    [field: string]: string | number | boolean;
  };
}

export interface DeleteOneOpts {
  where: {
    [field: string]: string | number | boolean;
  };
}

export interface DB {
  disconnect(): Promise<void>;
  findAll(table: string, opts: FindAllOpts): Promise<unknown[]>;
  findOne(table: string, opts: FindOneOpts): Promise<null | unknown>;
  insertOne(table: string, opts: InsertOneOpts): Promise<number>;
  updateOne(table: string, opts: UpdateOneOpts): Promise<boolean>;
  deleteOne(table: string, opts: DeleteOneOpts): Promise<boolean>;
  deleteAll(table: string): Promise<void>;
  resetTable(table: string): Promise<void>;
}
