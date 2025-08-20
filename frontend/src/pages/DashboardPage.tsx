import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface DashboardPageProps {
  shopInfo: any;
}

export default function DashboardPage({ shopInfo }: DashboardPageProps) {
  const navigate = useNavigate();
  const [brandVoice, setBrandVoice] = useState({
    brandName: '',
    brandDescription: '',
    writingTone: 'professional',
    targetAudience: '',
    industry: '',
    brandGuidelines: ''
  });

  const handleBrandVoiceSave = () => {
    // Save brand voice settings
    console.log('Saving brand voice:', brandVoice);
    // TODO: Implement save to backend
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'generate':
        navigate('/generate');
        break;
      case 'templates':
        navigate('/templates');
        break;
      case 'pricing':
        navigate('/pricing');
        break;
      case 'settings':
        navigate('/settings');
        break;
      default:
        break;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Top Header */}
      <div className="dashboard-header">
        <ui-title-bar title="ENIPA AI Blog Writing Assist">
        </ui-title-bar>
        <div className="header-actions">
          <ui-button variant="primary" onClick={() => handleQuickAction('generate')}>
            Generate Blog Post
          </ui-button>
        </div>
      </div>

      {/* Main Content */}
      <ui-layout>
        {/* Brand Voice Setup Section */}
        <ui-layout-section>
          <ui-card>
            <div className="section-header">
              <ui-text variant="headingLg" as="h2">Brand Voice Setup</ui-text>
              <ui-text variant="bodyMd" as="p">
                Configure your brand voice to generate personalized content that matches your brand identity.
              </ui-text>
            </div>
            
            <div className="brand-voice-form">
              <div className="form-row">
                <div className="form-field">
                  <ui-text variant="bodyMd" as="label">Brand Name</ui-text>
                  <ui-text-field
                    value={brandVoice.brandName}
                    onChange={(e: any) => setBrandVoice({...brandVoice, brandName: e.target.value})}
                    placeholder="Enter your brand name"
                  />
                </div>
                <div className="form-field">
                  <ui-text variant="bodyMd" as="label">Writing Tone</ui-text>
                  <ui-select
                    value={brandVoice.writingTone}
                    onChange={(e: any) => setBrandVoice({...brandVoice, writingTone: e.target.value})}
                    options={[
                      { label: 'Professional', value: 'professional' },
                      { label: 'Casual', value: 'casual' },
                      { label: 'Friendly', value: 'friendly' },
                      { label: 'Authoritative', value: 'authoritative' },
                      { label: 'Creative', value: 'creative' }
                    ]}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-field">
                  <ui-text variant="bodyMd" as="label">Target Audience</ui-text>
                  <ui-text-field
                    value={brandVoice.targetAudience}
                    onChange={(e: any) => setBrandVoice({...brandVoice, targetAudience: e.target.value})}
                    placeholder="e.g., Young professionals, Parents, Tech enthusiasts"
                  />
                </div>
                <div className="form-field">
                  <ui-text variant="bodyMd" as="label">Industry/Sector</ui-text>
                  <ui-text-field
                    value={brandVoice.industry}
                    onChange={(e: any) => setBrandVoice({...brandVoice, industry: e.target.value})}
                    placeholder="e.g., E-commerce, Technology, Fashion"
                  />
                </div>
              </div>
              
              <div className="form-field">
                <ui-text variant="bodyMd" as="label">Brand Description</ui-text>
                <ui-text-field
                  value={brandVoice.brandDescription}
                  onChange={(e: any) => setBrandVoice({...brandVoice, brandDescription: e.target.value})}
                  placeholder="Describe your brand personality, values, and style"
                />
              </div>
              
              <div className="form-field">
                <ui-text variant="bodyMd" as="label">Brand Guidelines</ui-text>
                <ui-text-field
                  value={brandVoice.brandGuidelines}
                  onChange={(e: any) => setBrandVoice({...brandVoice, brandGuidelines: e.target.value})}
                  placeholder="Any specific guidelines for content creation"
                />
              </div>
              
              <div className="form-actions">
                <ui-button variant="primary" onClick={handleBrandVoiceSave}>
                  Save Brand Voice
                </ui-button>
              </div>
            </div>
          </ui-card>
        </ui-layout-section>

        {/* Quick Actions Section */}
        <ui-layout-section>
          <ui-card>
            <div className="section-header">
              <ui-text variant="headingLg" as="h2">Quick Actions</ui-text>
              <ui-text variant="bodyMd" as="p">Get started with these common tasks.</ui-text>
            </div>
            
            <div className="quick-actions-grid">
              <div className="action-card" onClick={() => handleQuickAction('generate')}>
                <div className="action-icon">✍️</div>
                <ui-text variant="headingMd" as="h3">Generate Blog Post</ui-text>
                <ui-text variant="bodyMd" as="p">Create AI-powered blog content from your products.</ui-text>
                <ui-button variant="secondary" size="slim">Get Started</ui-button>
              </div>
              
              <div className="action-card" onClick={() => handleQuickAction('templates')}>
                <div className="action-icon">📝</div>
                <ui-text variant="headingMd" as="h3">Manage Templates</ui-text>
                <ui-text variant="bodyMd" as="p">Create and customize blog post templates.</ui-text>
                <ui-button variant="secondary" size="slim">Get Started</ui-button>
              </div>
              
              <div className="action-card" onClick={() => handleQuickAction('pricing')}>
                <div className="action-icon">💰</div>
                <ui-text variant="headingMd" as="h3">View Pricing</ui-text>
                <ui-text variant="bodyMd" as="p">Choose the perfect plan for your needs.</ui-text>
                <ui-button variant="secondary" size="slim">Get Started</ui-button>
              </div>
              
              <div className="action-card" onClick={() => handleQuickAction('settings')}>
                <div className="action-icon">⚙️</div>
                <ui-text variant="headingMd" as="h3">App Settings</ui-text>
                <ui-text variant="bodyMd" as="p">Configure your app preferences.</ui-text>
                <ui-button variant="secondary" size="slim">Get Started</ui-button>
              </div>
            </div>
          </ui-card>
        </ui-layout-section>

        {/* Stats Overview Section */}
        <ui-layout-section>
          <ui-card>
            <div className="section-header">
              <ui-text variant="headingLg" as="h2">Performance Metrics</ui-text>
            </div>
            
            <div className="stats-grid">
              <div className="stat-card">
                <ui-text variant="headingLg" as="h3">24</ui-text>
                <ui-text variant="bodyMd" as="p">Blog Posts Created</ui-text>
                <ui-text variant="bodySm" as="span" className="stat-change positive">+12%</ui-text>
              </div>
              
              <div className="stat-card">
                <ui-text variant="headingLg" as="h3">156</ui-text>
                <ui-text variant="bodyMd" as="p">AI Generations</ui-text>
                <ui-text variant="bodySm" as="span" className="stat-change positive">+8%</ui-text>
              </div>
              
              <div className="stat-card">
                <ui-text variant="headingLg" as="h3">92</ui-text>
                <ui-text variant="bodyMd" as="p">SEO Score</ui-text>
                <ui-text variant="bodySm" as="span" className="stat-change positive">+5%</ui-text>
              </div>
              
              <div className="stat-card">
                <ui-text variant="headingLg" as="h3">1.2K</ui-text>
                <ui-text variant="bodyMd" as="p">Traffic Generated</ui-text>
                <ui-text variant="bodySm" as="span" className="stat-change positive">+15%</ui-text>
              </div>
            </div>
          </ui-card>
        </ui-layout-section>

        {/* Recent Activity Section */}
        <ui-layout-section>
          <ui-card>
            <div className="section-header">
              <ui-text variant="headingLg" as="h2">Recent Activity</ui-text>
            </div>
            
            <div className="activity-list">
              <div className="activity-item">
                <ui-text variant="bodyMd" as="p">
                  Blog post "Organic Cotton T-Shirt Review" published
                </ui-text>
                <ui-text variant="bodySm" as="span" className="activity-time">2 hours ago</ui-text>
              </div>
              
              <div className="activity-item">
                <ui-text variant="bodyMd" as="p">
                  AI generated 3 blog post ideas
                </ui-text>
                <ui-text variant="bodySm" as="span" className="activity-time">1 day ago</ui-text>
              </div>
              
              <div className="activity-item">
                <ui-text variant="bodyMd" as="p">
                  Brand voice settings updated
                </ui-text>
                <ui-text variant="bodySm" as="span" className="activity-time">2 days ago</ui-text>
              </div>
            </div>
          </ui-card>
        </ui-layout-section>
      </ui-layout>

      <style jsx>{`
        .dashboard-container {
          padding: 0;
          background-color: #f6f6f7;
          min-height: 100vh;
        }

        .dashboard-header {
          background: white;
          border-bottom: 1px solid #e1e3e5;
          margin-bottom: 24px;
        }

        .header-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 16px;
        }

        .section-header {
          margin-bottom: 24px;
        }

        .section-header h2 {
          margin-bottom: 8px;
          color: #202223;
        }

        .section-header p {
          color: #6d7175;
          margin: 0;
        }

        .brand-voice-form {
          margin-top: 24px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 24px;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-field label {
          font-weight: 500;
          color: #202223;
        }

        .form-actions {
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid #e1e3e5;
        }

        .quick-actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          margin-top: 24px;
        }

        .action-card {
          background: white;
          border: 1px solid #e1e3e5;
          border-radius: 8px;
          padding: 24px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .action-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border-color: #5c6ac4;
        }

        .action-icon {
          font-size: 32px;
          text-align: center;
        }

        .action-card h3 {
          margin: 0;
          color: #202223;
        }

        .action-card p {
          margin: 0;
          color: #6d7175;
          flex-grow: 1;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
          margin-top: 24px;
        }

        .stat-card {
          background: white;
          border: 1px solid #e1e3e5;
          border-radius: 8px;
          padding: 24px;
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .stat-card h3 {
          margin: 0;
          font-size: 32px;
          font-weight: 600;
          color: #202223;
        }

        .stat-card p {
          margin: 0;
          color: #6d7175;
        }

        .stat-change {
          font-weight: 500;
        }

        .stat-change.positive {
          color: #008060;
        }

        .activity-list {
          margin-top: 24px;
        }

        .activity-item {
          padding: 16px 0;
          border-bottom: 1px solid #e1e3e5;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .activity-item:last-child {
          border-bottom: none;
        }

        .activity-item p {
          margin: 0;
          color: #202223;
        }

        .activity-time {
          color: #6d7175;
          font-size: 14px;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .quick-actions-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }

          .action-card,
          .stat-card {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
}
