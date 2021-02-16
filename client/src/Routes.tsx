import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { TodoList } from './features/todo/TodoList';
import { NewTodo } from './features/todo/NewTodo';
import { EditTodo } from './features/todo/EditTodo';
import { UserList } from './features/user/UserList';
import { Profile } from './features/account/Profile';
import { NotFound } from './components/NotFound';

export function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={TodoList} />
      <Route path="/todos" exact component={TodoList} />
      <Route path="/todos/new" exact component={NewTodo} />
      <Route path="/todos/:id" exact component={EditTodo} />
      <Route path="/users" exact component={UserList} />
      <Route path="/profile" exact component={Profile} />
      <Route component={NotFound} />
    </Switch>
  );
}
