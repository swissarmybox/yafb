import React from 'react';
import { TodoToolbar } from '../../components/TodoToolbar'
import { TodoTable } from '../../components/TodoTable'

export function TodoList() {
  const products = [
    {
      id: 1,
      title: 'Hello',
      description: 'World',
      done: 'false',
      updatedAt: (new Date()).toString(),
    },
    {
      id: 2,
      title: 'Hola',
      description: 'Mundo',
      done: 'true',
      updatedAt: (new Date()).toString(),
    },
  ];

  return (
    <>
      <TodoToolbar />
      <TodoTable todos={products} />
    </>
  );
}
