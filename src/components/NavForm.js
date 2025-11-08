import React, { useState } from 'react';
import { useTheme } from './ThemeContext';
import './NavForm.css';

function NavForm({ onAddTodo }) {
  const [inputValue, setInputValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Personal');
  const [dueDate, setDueDate] = useState('');
  const [enableReminder, setEnableReminder] = useState(false);

  const { isDarkMode } = useTheme();

  const categories = [
    { name: 'Personal', color: '#3498db', icon: '👤' },
    { name: 'Work', color: '#e74c3c', icon: '💼' },
    { name: 'Health', color: '#2ecc71', icon: '🏥' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAddTodo(inputValue, selectedCategory, dueDate, enableReminder);
      setInputValue('');
      setDueDate('');
      setEnableReminder(false);
    }
  };

  return (
    <div className="navform-container">
      <div className={`navform-header ${isDarkMode ? 'navform-dark' : 'navform-light'}`}>
        <h2 className="navform-title">
          🎯 What's Your Plan Today?
        </h2>

        <form onSubmit={handleSubmit} className="navform-form">
          {/* Input Area First */}
          <input
            type="text"
            placeholder="✍️ Add a new task..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className={`navform-input ${isDarkMode ? 'input-dark' : 'input-light'}`}
          />

          {/* Add Button - Now More Prominent */}
          <button
            type="submit"
            className={`navform-button ${isDarkMode ? 'button-dark' : 'button-light'}`}
          >
            ➕ Add Task
          </button>

          {/* Then Other Options */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`navform-select ${isDarkMode ? 'input-dark' : 'input-light'}`}
          >
            {categories.map(category => (
              <option key={category.name} value={category.name}>
                {category.icon} {category.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className={`navform-date ${isDarkMode ? 'input-dark' : 'input-light'}`}
          />

          <label className={`navform-checkbox-label ${isDarkMode ? 'input-dark' : 'input-light'}`}>
            <input
              type="checkbox"
              checked={enableReminder}
              onChange={(e) => setEnableReminder(e.target.checked)}
              className="navform-checkbox"
            />
            🔔 Reminder
          </label>
        </form>
      </div>
    </div>
  );
}

export default NavForm;