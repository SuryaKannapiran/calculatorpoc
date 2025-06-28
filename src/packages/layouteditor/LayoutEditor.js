import React, { useState } from 'react';
import './LayoutEditor.css';

const LayoutEditor = ({ currentLayout, onLayoutUpdate }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      setError('Please enter a description of the layout changes you want to make.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:3001/layout/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentLayout,
          userPrompt: prompt.trim()
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update layout');
      }

      if (data.success) {
        setSuccess('Layout updated successfully!');
        onLayoutUpdate(data.updatedLayout);
        setPrompt('');
      } else {
        throw new Error(data.error || 'Failed to update layout');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit(e);
    }
  };

  return (
    <div className="layout-editor">
      <div className="layout-editor-container">
        <header className="layout-editor-header">
          <h1 className="layout-editor-title">
            <span className="title-icon">🎨</span>
            Layout Editor
          </h1>
          <p className="layout-editor-description">
            Describe your layout changes in natural language and watch them come to life!
          </p>
        </header>

        <main className="layout-editor-main">
          <div className="prompt-section">
            <h2 className="section-title">Describe Your Changes</h2>
            
            <form onSubmit={handleSubmit} className="prompt-form">
              <div className="prompt-input-container">
                <textarea
                  className="prompt-input"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="e.g., 'Add a slider with name as No of Users', 'Create a new card section for user preferences', 'Add a row with two input fields for name and email'"
                  rows={4}
                  disabled={isLoading}
                />
                <div className="prompt-hint">
                  💡 Tip: Press Ctrl+Enter (or Cmd+Enter) to submit
                </div>
              </div>

              <button
                type="submit"
                className="submit-button"
                disabled={isLoading || !prompt.trim()}
              >
                {isLoading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Updating Layout...
                  </>
                ) : (
                  'Update Layout'
                )}
              </button>
            </form>

            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            {success && (
              <div className="success-message">
                <span className="success-icon">✅</span>
                {success}
              </div>
            )}
          </div>

          <div className="examples-section">
            <h3 className="examples-title">Example Prompts</h3>
            <div className="examples-grid">
              <div className="example-item">
                <strong>Add a slider:</strong>
                <p>"Add a slider with name as No of Users"</p>
              </div>
              <div className="example-item">
                <strong>Create a card:</strong>
                <p>"Create a new card section for user preferences"</p>
              </div>
              <div className="example-item">
                <strong>Add inputs:</strong>
                <p>"Add a row with two input fields for name and email"</p>
              </div>
              <div className="example-item">
                <strong>Modify layout:</strong>
                <p>"Change the theme to dark mode"</p>
              </div>
            </div>
          </div>

          <div className="current-layout-section">
            <h3 className="section-title">Current Layout</h3>
            <div className="layout-preview">
              <pre className="layout-json">
                {JSON.stringify(currentLayout, null, 2)}
              </pre>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LayoutEditor; 