import ThemeToggle from "./ThemeToggle";
import { useTheme } from './ThemeContext';
import './NavBar.css';

function NavBar({ heading, categoryCounts, currentCategory, onCategoryChange }) {
  const { isDarkMode } = useTheme();

  const categories = [
    { name: 'All', color: '#9b59b6', icon: '📋' },
    { name: 'My Day', color: '#f39c12', icon: '🌞' },
    { name: 'Personal', color: '#3498db', icon: '👤' },
    { name: 'Work', color: '#e74c3c', icon: '💼' },
    { name: 'Health', color: '#2ecc71', icon: '🏥' },
    { name: 'Deleted', color: '#95a5a6', icon: '🗑️' }
  ];

  return (
    <nav className={`navbar navbar-expand-lg ${isDarkMode ? 'nav-dark' : 'nav-light'}`}>
      <div className="container">
        {/* App Title */}
        <span className="navbar-brand app-title">
          📝 {heading}
        </span>

        <div className="nav-right-section">
          {/* Category Counts - Now Clickable */}
          <div className="category-nav">
            {categories.map(category => (
              <div
                key={category.name}
                className={`category-item ${isDarkMode ? 'category-dark' : 'category-light'} ${currentCategory === category.name ? 'active-category' : ''
                  }`}
                onClick={() => onCategoryChange(category.name)}
                style={{ cursor: 'pointer' }}
              >
                <div className="category-icon">
                  {category.icon}
                </div>
                <span className="category-name">
                  {category.name}
                </span>
                <span
                  className="category-count"
                  style={{ color: category.color }}
                >
                  {categoryCounts[category.name] || 0}
                </span>
              </div>
            ))}

            {/* ✅ Theme Toggle - Mobile */}
            <div className="theme-toggle-mobile">
              <ThemeToggle />
            </div>
          </div>

          {/* ✅ Theme Toggle - Desktop */}
          <div className="theme-toggle-desktop">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;