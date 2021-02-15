import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { Routes } from './Routes';
import { Navigation } from './components/Navigation';
import './App.css';

export function App() {
  return (
    <>
      <Navigation />
      <div className="p-grid">
        <div className="p-col">
          <Router>
            <Routes />
          </Router>
        </div>
      </div>
    </>
  );
}
