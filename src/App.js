import React, { useState } from 'react';
import './App.css';
import LayoutEditor from './packages/layouteditor/LayoutEditor';
import { defaultLayout } from './packages/layouteditor/data/defaultLayout';

function App() {
  const [currentLayout, setCurrentLayout] = useState(defaultLayout);

  const handleLayoutUpdate = (updatedLayout) => {
    setCurrentLayout(updatedLayout);
  };

  return (
    <div className="app">
      <LayoutEditor 
        currentLayout={currentLayout}
        onLayoutUpdate={handleLayoutUpdate}
      />
    </div>
  );
}

export default App; 