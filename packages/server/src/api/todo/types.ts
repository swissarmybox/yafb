export type { Todo, NewTodo, UpdateTodo } from '../../../common/types/todo';

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
