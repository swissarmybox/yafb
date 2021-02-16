import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import type { Todo } from '../features/todo/types'

interface Props {
  todos: Todo[];
  editTodo(todoID: number): void;
  deleteTodo(todoID: number): void;
}

export function TodoTable(props: Props) {
  const {
    todos,
    editTodo,
    deleteTodo,
  } = props;

  const actionBodyTemplate = (rowData: Todo) => {
    return (
      <>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success p-mr-2"
          onClick={() => editTodo(rowData.id)}
        />

        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning"
          onClick={() => deleteTodo(rowData.id)}
        />
      </>
    );
  }

  return (
    <DataTable value={todos}>
      <Column field="id" header="ID"></Column>
      <Column field="title" header="Title"></Column>
      <Column field="done" header="Done"></Column>
      <Column field="updatedAt" header="Updated"></Column>
      <Column header="Actions" body={actionBodyTemplate}></Column>
    </DataTable>
  )
}
