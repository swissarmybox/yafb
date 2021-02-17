export interface Todo {
  id: number;
  title: string;
  description: string;
  done: boolean;
  createdAt: string;
  updatedAt: string;
}

export type NewTodo = Omit<Todo, 'id' | 'done' | 'createdAt' | 'updatedAt'>;
export type UpdateTodo = Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>;

export interface Engine {
  getTodos(userID: number): Promise<Todo[]>;
  getTodo(userID: number, todoID: number): Promise<Todo>;
  createTodo(userID: number, todo: NewTodo): Promise<number>;
  updateTodo(userID: number, todoID: number, todo: UpdateTodo): Promise<void>;
  deleteTodo(userID: number, todoID: number): Promise<void>;
}

export interface Model {
  getTodos(userID: number): Promise<Todo[]>;
  getTodo(userID: number, todoID: number): Promise<null | Todo>;
  createTodo(userID: number, todo: NewTodo): Promise<number>;
  updateTodo(
    userID: number,
    todoID: number,
    todo: UpdateTodo,
  ): Promise<boolean>;
  deleteTodo(userID: number, todoID: number): Promise<boolean>;
}
