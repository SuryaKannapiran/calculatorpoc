import React, { useState } from 'react';
import './App.css';
import GenericCalculator from './packages/calculator/GenericCalculator';
import LayoutEditor from './packages/layouteditor/LayoutEditor';
import Navigation from './components/Navigation';
import { pricingData } from './packages/calculator/data/pricingData';
import { defaultLayout } from './packages/layouteditor/data/defaultLayout';

function App() {
  const [currentScreen, setCurrentScreen] = useState('calculator');
  const [currentLayout, setCurrentLayout] = useState(defaultLayout);

  const handleLayoutUpdate = (updatedLayout) => {
    setCurrentLayout(updatedLayout);
  };

  const handleScreenChange = (screen) => {
    setCurrentScreen(screen);
  };

  return (
    <div className="app">
      <Navigation 
        currentScreen={currentScreen} 
        onScreenChange={handleScreenChange} 
      />
      
      {currentScreen === 'calculator' && (
        <GenericCalculator pricingData={pricingData} />
      )}
      
      {currentScreen === 'layout-editor' && (
        <LayoutEditor 
          currentLayout={currentLayout}
          onLayoutUpdate={handleLayoutUpdate}
        />
      )}
    </div>
  );
}

export default App; 