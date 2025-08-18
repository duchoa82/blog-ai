import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavigationItem {
  label: string;
  destination: string;
  icon: string;
  selected?: boolean;
}

interface AppNavigationProps {
  shop?: string;
}

export function AppNavigation({ shop }: AppNavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems: NavigationItem[] = [
    {
      label: 'Dashboard',
      destination: '/',
      icon: '🏠',
      selected: location.pathname === '/'
    },
    {
      label: 'Blog Posts',
      destination: '/posts',
      icon: '📝',
      selected: location.pathname === '/posts'
    },
    {
      label: 'Create Post',
      destination: '/create',
      icon: '➕',
      selected: location.pathname === '/create'
    },
    {
      label: 'Products',
      destination: '/products',
      icon: '📦',
      selected: location.pathname === '/products'
    },
    {
      label: 'Analytics',
      destination: '/analytics',
      icon: '📊',
      selected: location.pathname === '/analytics'
    },
    {
      label: 'Settings',
      destination: '/settings',
      icon: '⚙️',
      selected: location.pathname === '/settings'
    }
  ];

  const handleNavigationClick = (destination: string) => {
    navigate(destination);
  };

  return (
    <div style={{ 
      width: '240px', 
      backgroundColor: '#f6f6f7', 
      borderRight: '1px solid #e1e3e5',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 100
    }}>
      {/* App Header */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #e1e3e5',
        backgroundColor: '#ffffff'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: '#000000',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontWeight: 'bold',
            fontSize: '16px'
          }}>
            B
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Blog AI</h2>
            {shop && (
              <p style={{ 
                margin: '4px 0 0 0', 
                fontSize: '12px', 
                color: '#6d7175',
                textTransform: 'capitalize'
              }}>
                {shop.replace('.myshopify.com', '')}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <div style={{ padding: '16px 0' }}>
        {navigationItems.map((item) => (
          <div
            key={item.destination}
            onClick={() => handleNavigationClick(item.destination)}
            style={{
              padding: '12px 16px',
              cursor: 'pointer',
              backgroundColor: item.selected ? '#e3f2fd' : 'transparent',
              borderLeft: item.selected ? '3px solid #008060' : '3px solid transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (!item.selected) {
                e.currentTarget.style.backgroundColor = '#f1f2f3';
              }
            }}
            onMouseLeave={(e) => {
              if (!item.selected) {
                e.currentTarget.style.backgroundColor = item.selected ? '#e3f2fd' : 'transparent';
              }
            }}
          >
            <span style={{ fontSize: '18px' }}>{item.icon}</span>
            <span style={{ 
              fontSize: '14px',
              color: item.selected ? '#000000' : '#6d7175',
              fontWeight: item.selected ? '500' : '400'
            }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ 
        padding: '16px',
        borderTop: '1px solid #e1e3e5',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#ffffff'
      }}>
        <button 
          onClick={() => navigate('/create')}
          style={{
            width: '100%',
            padding: '12px 16px',
            backgroundColor: '#008060',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          ➕ Create New Post
        </button>
      </div>
    </div>
  );
}
