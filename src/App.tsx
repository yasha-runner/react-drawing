import React from 'react';
import style from './App.module.css';
import Canvas from './components/Canvas/Canvas';
import Sidebar from './components/Sidebar/Sidebar';

const App: React.FC = () => {
  return (
    <main className={style.main}>
      <Sidebar />
      <Canvas />
    </main>
  );
};

export default App;
