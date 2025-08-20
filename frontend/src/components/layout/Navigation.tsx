import React from 'react';
import { useLocation } from 'react-router-dom';

export default function Navigation() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
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
          width: 100%;
          height: 100%;
          background-color: #202223;
          color: white;
          padding: 20px 0;
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
      `}</style>
    </div>
  );
}
