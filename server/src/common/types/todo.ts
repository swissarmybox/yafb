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
