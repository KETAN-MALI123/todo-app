import { useTheme } from './ThemeContext';
import './TodoList.css';

function TodoList({ todos, onCompleteTodo, onDeleteTodo, progressStats, currentCategory }) {
    const { isDarkMode } = useTheme();

    const formatDueDate = (dateString) => {
        if (!dateString) return null;
        const today = new Date();
        const dueDate = new Date(dateString);
        const diffTime = dueDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Tomorrow';
        if (diffDays === -1) return 'Yesterday';
        if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
        return `In ${diffDays} days`;
    };

    // ✅ Show different empty messages based on category
    const getEmptyMessage = () => {
        switch (currentCategory) {
            case 'My Day':
                return {
                    title: "No tasks for today!",
                    message: "Add tasks to see them here"
                };
            case 'Deleted':
                return {
                    title: "No deleted tasks!",
                    message: "Deleted tasks will appear here"
                };
            default:
                return {
                    title: "No tasks yet!",
                    message: "Start by adding your first task"
                };
        }
    };

    const emptyMessage = getEmptyMessage();

    return (
        <div className={`todo-list-container ${isDarkMode ? 'dark' : 'light'}`}>
            <div className={`todo-list-content ${isDarkMode ? 'dark-content' : 'light-content'}`}>
                {/* Header with Current Category */}
                <div className="todo-list-header">
                    <div className="header-left">
                        <h2 className="todo-list-title">
                            {currentCategory === 'My Day' && '🌞 '}
                            {currentCategory === 'All' && '📋 '}
                            {currentCategory === 'Personal' && '👤 '}
                            {currentCategory === 'Work' && '💼 '}
                            {currentCategory === 'Health' && '🏥 '}
                            {currentCategory === 'Deleted' && '🗑️ '}
                            {currentCategory} Tasks
                        </h2>
                        <div className="task-summary">
                            <span className="total-count">Total: {todos.length}</span>
                            {progressStats && currentCategory !== 'Deleted' && (
                                <span className="completed-count">
                                    Completed: {progressStats.completedTasks}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="total-count-badge">
                        {todos.length} {currentCategory === 'Deleted' ? 'Deleted' : 'Tasks'}
                    </div>
                </div>

                {/* Progress Section - Hide for Deleted category */}
                {progressStats && progressStats.totalTasks > 0 && currentCategory !== 'Deleted' && (
                    <div className={`progress-card ${isDarkMode ? 'progress-dark' : 'progress-light'}`}>
                        <div className="progress-card-header">
                            <h3 className="progress-title">
                                📊 Your Progress
                            </h3>
                            <div className="progress-stats-badge">
                                <span className="progress-percentage">
                                    {Math.round(progressStats.progressPercentage)}%
                                </span>
                                <span className="progress-label">Complete</span>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="progress-bar-container">
                            <div
                                className="progress-bar-fill"
                                style={{ width: `${progressStats.progressPercentage}%` }}
                            ></div>
                        </div>

                        {/* Improved Stats */}
                        <div className="progress-details">
                            <div className="progress-stat">
                                <div className="stat-value completed">{progressStats.completedTasks}</div>
                                <div className="stat-label">Completed</div>
                            </div>
                            <div className="progress-divider"></div>
                            <div className="progress-stat">
                                <div className="stat-value pending">{progressStats.pendingTasks}</div>
                                <div className="stat-label">Pending</div>
                            </div>
                            <div className="progress-divider"></div>
                            <div className="progress-stat">
                                <div className="stat-value total">{progressStats.totalTasks}</div>
                                <div className="stat-label">Total</div>
                            </div>
                        </div>
                    </div>
                )}

                {todos.length === 0 ? (
                    /* Empty State with dynamic messages */
                    <div className="empty-state">
                        <div className="empty-icon">
                            {currentCategory === 'My Day' && '🌞'}
                            {currentCategory === 'Deleted' && '🗑️'}
                            {(currentCategory === 'All' || currentCategory === 'Personal' || currentCategory === 'Work' || currentCategory === 'Health') && '📝'}
                        </div>
                        <h3 className="empty-title">
                            {emptyMessage.title}
                        </h3>
                        <p className="empty-message">
                            {emptyMessage.message}
                        </p>
                    </div>
                ) : (
                    /* Tasks List */
                    <div className="tasks-container">
                        {todos.map(todo => (
                            <div
                                key={todo.id}
                                className={`task-item ${todo.completed ? 'completed' : ''} ${isDarkMode ? 'task-dark' : 'task-light'}`}
                                onClick={() => currentCategory !== 'Deleted' && onCompleteTodo(todo.id)}
                            >
                                <div className="task-main-content">
                                    <div className="task-left">
                                        {/* Checkbox - Hide for Deleted tasks */}
                                        {currentCategory !== 'Deleted' && (
                                            <div className={`task-checkbox ${todo.completed ? 'checked' : ''}`}>
                                                {todo.completed && (
                                                    <span className="checkmark">✓</span>
                                                )}
                                            </div>
                                        )}

                                        {/* Task Text */}
                                        <span className={`task-text ${todo.completed ? 'completed-text' : ''}`}>
                                            {todo.text}
                                        </span>
                                    </div>

                                    {/* Action Buttons - Different for Deleted */}
                                    <div className="task-actions">
                                        {currentCategory === 'Deleted' ? (
                                            /* Deleted tasks actions */
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    // TODO: Add restore functionality
                                                    // alert('Restore functionality coming soon!');
                                                }}
                                                className="complete-btn"
                                            >
                                                {/* 🔄 Restore */}
                                            </button>
                                        ) : (
                                            /* Active tasks actions */
                                            <>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onCompleteTodo(todo.id);
                                                    }}
                                                    className={`complete-btn ${todo.completed ? 'undo-btn' : ''}`}
                                                >
                                                    {todo.completed ? '↶ Undo' : '✓ Complete'}
                                                </button>

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onDeleteTodo(todo.id);
                                                    }}
                                                    className="delete-btn"
                                                >
                                                    🗑️ Delete
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Task Meta Information */}
                                {(todo.dueDate || todo.reminder) && currentCategory !== 'Deleted' && (
                                    <div className="task-meta">
                                        {/* Due Date */}
                                        {todo.dueDate && (
                                            <div className="due-date-info">
                                                <span className="date-icon">📅</span>
                                                <span className="date-text">{new Date(todo.dueDate).toLocaleDateString()}</span>
                                                <span className={`date-badge ${todo.completed ? 'completed-badge' : ''}`}>
                                                    {formatDueDate(todo.dueDate)}
                                                </span>
                                            </div>
                                        )}

                                        {/* Reminder */}
                                        {todo.reminder && (
                                            <span className={`reminder-badge ${todo.completed ? 'completed-badge' : ''}`}>
                                                🔔 Reminder
                                            </span>
                                        )}
                                    </div>
                                )}

                                {/* Category Badge */}
                                {currentCategory === 'All' && (
                                    <div className="task-category">
                                        <span className={`category-tag ${todo.category?.toLowerCase()}`}>
                                            {todo.category === 'Personal' && '👤'}
                                            {todo.category === 'Work' && '💼'}
                                            {todo.category === 'Health' && '🏥'}
                                            {todo.category}
                                        </span>
                                    </div>
                                )}

                                {/* Completion Status */}
                                {todo.completed && currentCategory !== 'Deleted' && (
                                    <div className="completion-status">
                                        ✅ Completed on {new Date(todo.createdAt).toLocaleDateString()}
                                    </div>
                                )}

                                {/* Deleted Status */}
                                {currentCategory === 'Deleted' && (
                                    <div className="completion-status deleted-status">
                                        🗑️ Deleted on {new Date().toLocaleDateString()}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default TodoList;