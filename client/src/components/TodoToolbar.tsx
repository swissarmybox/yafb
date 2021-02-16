import React from 'react';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';

interface Props {
  onNewClick(): void
}

export function TodoToolbar(props: Props) {
  const leftContents = (
    <React.Fragment>
      <Button label="New" icon="pi pi-plus" className="p-mr-2" />
    </React.Fragment>
  );

  return <Toolbar left={() => leftContents} />;
}
