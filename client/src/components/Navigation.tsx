import React from 'react';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';

export function Navigation() {
  const items = [
    {
      label: 'Todos',
      command: (event) => {
        window.location.hash = '/todos';
      },
    },
    {
      label: 'Users',
      command: (event) => {
        window.location.hash = '/users';
      },
    },
    {
      label: 'Account',
      command: (event) => {
        window.location.hash = '/profile';
      },
    },
  ];

  return (
    <Menubar
      model={items}
      end={<Button label="Logout" icon="pi pi-power-off" />}
    />
  );
}
