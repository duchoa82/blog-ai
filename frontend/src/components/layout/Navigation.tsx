import React from 'react';

export default function Navigation() {
  const getCurrentPath = () => {
    return window.location.pathname;
  };
  
  const isActive = (path: string) => {
    const currentPath = getCurrentPath();
    if (path === '/' && currentPath === '/') return true;
    if (path !== '/' && currentPath.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="navigation-sidebar">
      <ui-nav-menu>
        <a href="/" rel="home" className={isActive('/') ? 'active' : ''}>
          Home
        </a>
        <a href="/templates" className={isActive('/templates') ? 'active' : ''}>
          Templates
        </a>
        <a href="/settings" className={isActive('/settings') ? 'active' : ''}>
          Settings
        </a>
      </ui-nav-menu>

      <style>{`
        .navigation-sidebar {
          position: fixed;
          left: 0;
          top: 0;
          width: 240px;
          height: 100vh;
          background-color: #202223;
          color: white;
          padding: 20px 0;
          z-index: 1000;
        }

        .navigation-sidebar ui-nav-menu {
          width: 100%;
        }

        .navigation-sidebar a {
          display: block;
          padding: 12px 24px;
          color: #ffffff;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: background-color 0.2s ease;
        }

        .navigation-sidebar a:hover {
          background-color: #2c2e2f;
        }

        .navigation-sidebar a.active {
          background-color: #5c6ac4;
          color: white;
        }

        /* Adjust main content to account for sidebar */
        .main-content {
          margin-left: 240px;
          padding: 20px;
        }
      `}</style>
    </div>
  );
}
