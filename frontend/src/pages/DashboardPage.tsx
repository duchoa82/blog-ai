import React from 'react';
import { useNavigate } from 'react-router-dom';

interface DashboardPageProps {
  shopInfo?: {
    shop: string;
    host: string;
  };
}

export default function DashboardPage({ shopInfo }: DashboardPageProps) {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Generate Blog Post',
      description: 'Create AI-powered blog content from your products',
      icon: '✍️',
      action: () => navigate('/generate'),
      variant: 'primary' as const
    },
    {
      title: 'Manage Templates',
      description: 'Create and customize blog post templates',
      icon: '📝',
      action: () => navigate('/templates'),
      variant: 'secondary' as const
    },
    {
      title: 'View Pricing',
      description: 'Choose the perfect plan for your needs',
      icon: '💰',
      action: () => navigate('/pricing'),
      variant: 'secondary' as const
    },
    {
      title: 'App Settings',
      description: 'Configure your app preferences',
      icon: '⚙️',
      action: () => navigate('/settings'),
      variant: 'secondary' as const
    }
  ];

  const stats = [
    { label: 'Blog Posts Created', value: '24', change: '+12%', changeType: 'positive' },
    { label: 'AI Generations', value: '156', change: '+8%', changeType: 'positive' },
    { label: 'SEO Score', value: '92', change: '+5%', changeType: 'positive' },
    { label: 'Traffic Generated', value: '1.2K', change: '+15%', changeType: 'positive' }
  ];

  return (
    <div>
      <ui-title-bar title="Dashboard">
        <button variant="primary" onClick={() => navigate('/generate')}>
          Generate Blog Post
        </button>
      </ui-title-bar>
      
      <ui-layout>
        {/* Welcome Section */}
        <ui-layout-section>
          <ui-card>
            <ui-text variant="heading" as="h1">Welcome to Blog AI! 🚀</ui-text>
            <p>Your AI-powered blog writing assistant for Shopify.</p>
            <p>Create engaging content, manage templates, and boost your SEO with AI-generated blog posts.</p>
            
            {shopInfo && (
              <div style={{ 
                marginTop: '1rem', 
                padding: '1rem', 
                backgroundColor: '#f6f6f7', 
                borderRadius: '4px' 
              }}>
                <p><strong>Shop:</strong> {shopInfo.shop}</p>
                <p><strong>Host:</strong> {shopInfo.host}</p>
              </div>
            )}
          </ui-card>
        </ui-layout-section>
        
        {/* Stats Section */}
        <ui-layout-section>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            {stats.map((stat, index) => (
              <ui-card key={index}>
                <div style={{ textAlign: 'center', padding: '1rem' }}>
                  <ui-text variant="heading" as="h3" style={{ marginBottom: '0.5rem' }}>
                    {stat.value}
                  </ui-text>
                  <p style={{ color: '#6d7175', marginBottom: '0.5rem' }}>
                    {stat.label}
                  </p>
                  <span style={{ 
                    color: stat.changeType === 'positive' ? '#008060' : '#d82c0d',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}>
                    {stat.change}
                  </span>
                </div>
              </ui-card>
            ))}
          </div>
        </ui-layout-section>
        
        {/* Quick Actions */}
        <ui-layout-section>
          <ui-card>
            <ui-text variant="heading" as="h2">Quick Actions</ui-text>
            <p>Get started with these common tasks</p>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem',
              marginTop: '1rem'
            }}>
              {quickActions.map((action, index) => (
                <ui-card key={index} style={{ 
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease',
                  border: '1px solid #e1e3e5'
                }}
                onClick={action.action}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}>
                  <div style={{ padding: '1rem' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                      {action.icon}
                    </div>
                    <ui-text variant="heading" as="h3" style={{ marginBottom: '0.5rem' }}>
                      {action.title}
                    </ui-text>
                    <p style={{ color: '#6d7175', marginBottom: '1rem' }}>
                      {action.description}
                    </p>
                    <ui-button variant={action.variant} full-width>
                      Get Started
                    </ui-button>
                  </div>
                </ui-card>
              ))}
            </div>
          </ui-card>
        </ui-layout-section>
        
        {/* Recent Activity */}
        <ui-layout-section secondary>
          <ui-card>
            <ui-text variant="heading" as="h2">Recent Activity</ui-text>
            
            <div style={{ marginTop: '1rem' }}>
              <div style={{ 
                padding: '0.75rem 0',
                borderBottom: '1px solid #e1e3e5'
              }}>
                <p style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                  Blog post "Organic Cotton T-Shirt Review" published
                </p>
                <p style={{ fontSize: '14px', color: '#6d7175' }}>
                  2 hours ago
                </p>
              </div>
              
              <div style={{ 
                padding: '0.75rem 0',
                borderBottom: '1px solid #e1e3e5'
              }}>
                <p style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                  AI generated 3 blog post ideas
                </p>
                <p style={{ fontSize: '14px', color: '#6d7175' }}>
                  1 day ago
                </p>
              </div>
              
              <div style={{ 
                padding: '0.75rem 0',
                borderBottom: '1px solid #e1e3e5'
              }}>
                <p style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                  Template "Product Review" created
                </p>
                <p style={{ fontSize: '14px', color: '#6d7175' }}>
                  3 days ago
                </p>
              </div>
            </div>
          </ui-card>
        </ui-layout-section>
      </ui-layout>
    </div>
  );
}
