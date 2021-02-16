import React from 'react';
import { UserTable } from '../../components/UserTable'

export function UserList() {
  const users = [
    {
      id: 1,
      email: 'Hello',
      role: 'World',
      createdAt: (new Date()).toString(),
      updatedAt: (new Date()).toString(),
    },
    {
      id: 2,
      email: 'Hola',
      role: 'Mundo',
      createdAt: (new Date()).toString(),
      updatedAt: (new Date()).toString(),
    },
  ];

  return <UserTable users={users} />;
}
