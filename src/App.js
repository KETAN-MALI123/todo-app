import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './components/ThemeContext';
import NavBar from './components/NavBar';
import NavForm from './components/NavForm';
import TodoList from './components/TodoList';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [currentCategory, setCurrentCategory] = useState('All'); // ✅ New state

  // ✅ SINGLE addTodo function with dueDate and reminder
  const addTodo = (text, category = 'Personal', dueDate = '', reminder = false) => {
    const newTodo = {
      id: Date.now(),
      text: text,
      category: category,
      completed: false,
      deleted: false,
      dueDate: dueDate,
      reminder: reminder,
      createdAt: new Date()
    };
    setTodos([...todos, newTodo]);
  };

  const completeTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id) => {
    const userConfirmed = window.confirm('Are you sure you want to delete this task?');
    if (userConfirmed) {
      setTodos(todos.map(todo =>
        todo.id === id ? { ...todo, deleted: true } : todo
      ));
    }
  };

  // ✅ Filter todos based on current category
  const getFilteredTodos = () => {
    const activeTodos = todos.filter(todo => !todo.deleted);

    switch (currentCategory) {
      case 'All':
        return activeTodos;
      case 'My Day':
        const today = new Date().toDateString();
        return activeTodos.filter(todo =>
          new Date(todo.createdAt).toDateString() === today
        );
      case 'Personal':
        return activeTodos.filter(todo => todo.category === 'Personal');
      case 'Work':
        return activeTodos.filter(todo => todo.category === 'Work');
      case 'Health':
        return activeTodos.filter(todo => todo.category === 'Health');
      case 'Deleted':
        return todos.filter(todo => todo.deleted);
      default:
        return activeTodos;
    }
  };

  const filteredTodos = getFilteredTodos();

  // ✅ Reminder check karne ka function
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      todos.forEach(todo => {
        if (todo.reminder && todo.dueDate && !todo.completed && !todo.deleted) {
          const dueDate = new Date(todo.dueDate);
          if (dueDate.toDateString() === now.toDateString()) {
            alert(`🔔 Reminder: "${todo.text}" is due today!`);
          }
        }
      });
    };

    const checkDailyReminders = () => {
      const now = new Date();
      const timeUntil9AM = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        9, 0, 0
      ) - now;

      const timeoutId = setTimeout(() => {
        checkReminders();
        checkDailyReminders();
      }, timeUntil9AM > 0 ? timeUntil9AM : 24 * 60 * 60 * 1000 + timeUntil9AM);

      return timeoutId;
    };

    const timeoutId = checkDailyReminders();
    return () => clearTimeout(timeoutId);
  }, [todos]);

  // ✅ Calculate category counts for navbar (including My Day)
  const getCategoryCounts = () => {
    const activeTodos = todos.filter(todo => !todo.deleted);
    const deletedTodos = todos.filter(todo => todo.deleted);
    const today = new Date().toDateString();
    const myDayCount = activeTodos.filter(todo =>
      new Date(todo.createdAt).toDateString() === today
    ).length;

    return {
      'My Day': myDayCount,
      'Personal': activeTodos.filter(todo => todo.category === 'Personal').length,
      'Work': activeTodos.filter(todo => todo.category === 'Work').length,
      'Health': activeTodos.filter(todo => todo.category === 'Health').length,
      'Deleted': deletedTodos.length
    };
  };

  const categoryCounts = getCategoryCounts();

  // ✅ Calculate Progress (for filtered todos)
  const getProgressStats = () => {
    const totalTasks = filteredTodos.filter(todo => !todo.deleted).length;
    const completedTasks = filteredTodos.filter(todo => !todo.deleted && todo.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return { totalTasks, completedTasks, pendingTasks, progressPercentage };
  }

  const progressStats = getProgressStats();

  return (
    <ThemeProvider>
      <div className="my-App">
        <NavBar
          heading="Todo-App"
          categoryCounts={categoryCounts}
          currentCategory={currentCategory} // ✅ New prop
          onCategoryChange={setCurrentCategory} // ✅ New prop
        />

        <NavForm onAddTodo={addTodo} />

        <TodoList
          todos={filteredTodos} // ✅ Filtered todos pass 
          onCompleteTodo={completeTodo}
          onDeleteTodo={deleteTodo}
          progressStats={progressStats}
          currentCategory={currentCategory} 
        />
      </div>
    </ThemeProvider>
  );
}

export default App;