import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Spreadsheet from './Spreadsheet'; // Import the Spreadsheet component

function App() {
  const [headerTitle, setHeaderTitle] = useState("Student Spreadsheet");
  const [isEditingHeaderTitle, setIsEditingHeaderTitle] = useState(false);
  const [editingHeaderTitleValue, setEditingHeaderTitleValue] = useState("");
  const headerTitleInputRef = useRef(null);

  useEffect(() => {
    if (isEditingHeaderTitle && headerTitleInputRef.current) {
      headerTitleInputRef.current.focus();
      headerTitleInputRef.current.select();
    }
  }, [isEditingHeaderTitle]);

  const startHeaderTitleEdit = () => {
    setEditingHeaderTitleValue(headerTitle);
    setIsEditingHeaderTitle(true);
  };

  const handleHeaderTitleInputChange = (e) => {
    setEditingHeaderTitleValue(e.target.value);
  };

  const saveHeaderTitleEdit = () => {
    const trimmedTitle = editingHeaderTitleValue.trim();
    if (trimmedTitle) {
      setHeaderTitle(trimmedTitle);
    }
    setIsEditingHeaderTitle(false);
  };

  const handleHeaderTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveHeaderTitleEdit();
    } else if (e.key === 'Escape') {
      setIsEditingHeaderTitle(false);
      setEditingHeaderTitleValue('');
    }
  };
  return (
    <div className="App">
      <header className="App-header">
        {isEditingHeaderTitle ? (
          <input
            ref={headerTitleInputRef}
            type="text"
            value={editingHeaderTitleValue}
            onChange={handleHeaderTitleInputChange}
            onBlur={saveHeaderTitleEdit}
            onKeyDown={handleHeaderTitleKeyDown}
            className="app-title-input"
          />
        ) : (
          <div className="app-title-display" onDoubleClick={startHeaderTitleEdit} title="Double-click to edit title">
            {headerTitle}
          </div>
        )}
      </header>
      <main>
        <div className="spreadsheet-container">
          <Spreadsheet />
        </div>
      </main>
    </div>
  );
}

export default App;
