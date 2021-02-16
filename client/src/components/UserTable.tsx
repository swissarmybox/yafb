import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import type { User } from '../features/user/types'

interface Props {
  users: User[];
}

export function UserTable(props: Props) {
  return (
    <DataTable value={props.users}>
      <Column field="id" header="ID"></Column>
      <Column field="email" header="Email"></Column>
      <Column field="role" header="Role"></Column>
      <Column field="createdAt" header="Created"></Column>
      <Column field="updatedAt" header="Updated"></Column>
    </DataTable>
  )
}
