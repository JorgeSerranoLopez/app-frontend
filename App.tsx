import React, { useState } from 'react';
import { LayoutGrid } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { LoadAssistant } from './components/LoadAssistant';
import { Recommendation } from './components/Recommendation';
import { ViewState, SelectedItem, FurnitureItem } from './types';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);

  // Calculate totals
  const totalBlocks = selectedItems.reduce((acc, item) => acc + item.blocks, 0);

  // Actions
  const handleAddItem = (item: FurnitureItem) => {
    const newItem: SelectedItem = {
      ...item,
      instanceId: Math.random().toString(36).substr(2, 9),
    };
    setSelectedItems((prev) => [...prev, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    setSelectedItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleReset = () => {
    setSelectedItems([]);
  };

  const handleStartQuote = () => {
    handleReset();
    setCurrentView('assistant');
  };

  const handleFinish = () => {
    setCurrentView('result');
  };

  const handleGoHome = () => {
    setCurrentView('dashboard');
  };

  // Render View Switcher
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onStartQuote={handleStartQuote} />;
      case 'assistant':
        return (
          <LoadAssistant
            selectedItems={selectedItems}
            onAddItem={handleAddItem}
            onRemoveItem={handleRemoveItem}
            onReset={handleReset}
            onFinish={handleFinish}
          />
        );
      case 'result':
        return (
          <Recommendation
            totalBlocks={totalBlocks}
            onBack={() => setCurrentView('assistant')}
            onRestart={handleGoHome}
          />
        );
      default:
        return <Dashboard onStartQuote={handleStartQuote} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => setCurrentView('dashboard')}
          >
            <div className="bg-blue-600 p-1.5 rounded-lg text-white">
              <LayoutGrid className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500">
              MudanzaApp
            </span>
          </div>
          
          {currentView !== 'dashboard' && (
             <div className="text-sm font-medium text-slate-500">
                {currentView === 'assistant' ? 'Paso 1: Cubicaje' : 'Paso 2: Resultado'}
             </div>
          )}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderView()}
      </main>
    </div>
  );
}

export default App;