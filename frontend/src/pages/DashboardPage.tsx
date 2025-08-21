import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronUpIcon, ChevronDownIcon } from '@shopify/polaris-icons';
import { Select, TextContainer, Button } from '@shopify/polaris';
import createApp from '@shopify/app-bridge';
import { TitleBar } from '@shopify/app-bridge/actions';
// import PageHeader from '../components/layout/PageHeader';
import './DashboardPage.css';

interface DashboardPageProps {
  shopInfo: {
    isDevelopment: boolean;
  };
}

export default function DashboardPage({ shopInfo }: DashboardPageProps) {
  const navigate = useNavigate();
  
  // App Bridge setup
  useEffect(() => {
    const config = {
      apiKey: import.meta.env.VITE_SHOPIFY_API_KEY || 'your-api-key',
      host: new URLSearchParams(window.location.search).get('host') || '',
      forceRedirect: true
    };
    
    const app = createApp(config);
    
    // Create App Bridge title bar
    const titleBar = TitleBar.create(app, {
      title: 'Dashboard',
      buttons: {
        primary: {
          label: 'Generate Blog Post',
          onClick: () => navigate('/generate')
        }
      }
    });
    
    // Mount title bar
    titleBar.subscribe(TitleBar.Action.UPDATE, () => {
      console.log('Title bar updated');
    });
  }, [navigate]);
  
  const [brandVoice, setBrandVoice] = useState({
    brandName: '',
    targetAudience: '',
    brandDescription: '',
    brandGuidelines: '',
    writingTone: '',
    industrySector: ''
  });

  const [isBrandVoiceOpen, setIsBrandVoiceOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const handleBrandVoiceChange = (field: string, value: string) => {
    setBrandVoice(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveBrandVoice = () => {
    console.log('Saving brand voice:', brandVoice);
    setIsEditing(false);
    // Hide save bar
    const saveBar = document.getElementById('brand-voice-save-bar');
    if (saveBar) {
      saveBar.hide();
    }
    // TODO: Implement save functionality
  };

  const handleEdit = () => {
    setIsEditing(true);
    // Show save bar using Shopify API
    const saveBar = document.getElementById('brand-voice-save-bar');
    if (saveBar) {
      saveBar.show();
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Hide save bar using Shopify API
    const saveBar = document.getElementById('brand-voice-save-bar');
    if (saveBar) {
      saveBar.hide();
    }
    // TODO: Reset to original values
  };

  // Add event listeners for save bar buttons
  React.useEffect(() => {
    const saveButton = document.getElementById('save-brand-voice-button');
    const discardButton = document.getElementById('discard-brand-voice-button');

    if (saveButton) {
      saveButton.addEventListener('click', () => {
        console.log('Saving brand voice');
        handleSaveBrandVoice();
        const saveBar = document.getElementById('brand-voice-save-bar');
        if (saveBar) {
          saveBar.hide();
        }
      });
    }

    if (discardButton) {
      discardButton.addEventListener('click', () => {
        console.log('Discarding changes');
        handleCancel();
      });
    }

    // Cleanup
    return () => {
      if (saveButton) {
        saveButton.removeEventListener('click', () => {});
      }
      if (discardButton) {
        discardButton.removeEventListener('click', () => {});
      }
    };
  }, []);

  return (
    <div className="dashboard-page">
      {/* Save Bar - Using Shopify Polaris Web Components */}
      <ui-save-bar id="brand-voice-save-bar" style={{ display: 'none' }}>
        <button variant="primary" id="save-brand-voice-button">Save</button>
        <button id="discard-brand-voice-button">Discard</button>
      </ui-save-bar>

      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="page-title">Dashboard</h1>
          </div>
          <div className="header-right">
            <Button 
              variant="primary"
              onClick={() => navigate('/generate')}
            >
              Generate Blog Post
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Brand Voice Setup Section */}
        <div className="brand-voice-section">
          <div className="section-header-accordion">
            <div className="header-left">
              <h2>Brand Voice Setup</h2>
              <p className="header-description">
                Configure your brand voice to generate personalized content that matches your brand identity and resonates with your target audience.
              </p>
            </div>
            <div className="header-right">
              <Button variant="secondary" onClick={handleEdit}>
                Edit
              </Button>
              <button 
                className="accordion-toggle"
                onClick={() => setIsBrandVoiceOpen(!isBrandVoiceOpen)}
              >
                {isBrandVoiceOpen ? (
                  <ChevronUpIcon />
                ) : (
                  <ChevronDownIcon />
                )}
              </button>
            </div>
          </div>
          
          {isBrandVoiceOpen && (
            <div className="brand-voice-form">
              <div className="form-row-1">
                <div className="form-column">
                                  <div className="form-field">
                  <label>Tone</label>
                  <Select
                    label=""
                    labelInline
                    options={[
                      { label: 'Select tone', value: '' },
                      { label: 'Friendly', value: 'friendly' },
                      { label: 'Professional', value: 'professional' },
                      { label: 'Inspirational', value: 'inspirational' },
                      { label: 'Playful', value: 'playful' },
                      { label: 'Serious', value: 'serious' },
                      { label: 'Witty', value: 'witty' },
                      { label: 'Supportive', value: 'supportive' },
                      { label: 'Authoritative', value: 'authoritative' }
                    ]}
                    value={brandVoice.writingTone}
                    onChange={(value) => handleBrandVoiceChange('writingTone', value)}
                    disabled={!isEditing}
                  />
                </div>
                </div>
                <div className="form-column">
                                  <div className="form-field">
                  <label>Formality Level</label>
                  <Select
                    label=""
                    labelInline
                    options={[
                      { label: 'Select level', value: '' },
                      { label: 'Highly Formal', value: 'highly-formal' },
                      { label: 'Semi-Formal', value: 'semi-formal' },
                      { label: 'Casual', value: 'casual' },
                      { label: 'Conversational', value: 'conversational' }
                    ]}
                    value={brandVoice.formalityLevel}
                    onChange={(value) => handleBrandVoiceChange('formalityLevel', value)}
                    disabled={!isEditing}
                  />
                </div>
                </div>
                <div className="form-column">
                                  <div className="form-field">
                  <label>Brand Personality</label>
                  <Select
                    label=""
                    labelInline
                    options={[
                      { label: 'Select personality (choose 3-5)', value: '' },
                      { label: 'Energetic', value: 'energetic' },
                      { label: 'Inspiring', value: 'inspiring' },
                      { label: 'Youthful', value: 'youthful' },
                      { label: 'Playful', value: 'playful' },
                      { label: 'Elegant', value: 'elegant' },
                      { label: 'Luxurious', value: 'luxurious' },
                      { label: 'Minimalist', value: 'minimalist' },
                      { label: 'Bold', value: 'bold' },
                      { label: 'Creative', value: 'creative' },
                      { label: 'Experimental', value: 'experimental' },
                      { label: 'Trustworthy', value: 'trustworthy' },
                      { label: 'Sincere', value: 'sincere' },
                      { label: 'Considerate', value: 'considerate' },
                      { label: 'Analytical', value: 'analytical' },
                      { label: 'Visionary', value: 'visionary' }
                    ]}
                    value={brandVoice.brandPersonality}
                    onChange={(value) => handleBrandVoiceChange('brandPersonality', value)}
                    disabled={!isEditing}
                  />
                </div>
                </div>
              </div>
              
              <div className="form-row-2">
                <div className="form-column">
                                  <div className="form-field">
                  <label>Business Description</label>
                  <TextContainer>
                    <textarea
                      value={brandVoice.businessDescription}
                      onChange={(e) => handleBrandVoiceChange('businessDescription', e.target.value)}
                      placeholder="Describe your business and what you do"
                      rows={3}
                      disabled={!isEditing}
                      className="polaris-textarea"
                    />
                  </TextContainer>
                </div>
                </div>
                <div className="form-column">
                                  <div className="form-field">
                  <label>Target Customer</label>
                  <TextContainer>
                    <textarea
                      value={brandVoice.targetCustomer}
                      onChange={(e) => handleBrandVoiceChange('targetCustomer', e.target.value)}
                      placeholder="Describe your target customers"
                      rows={3}
                      disabled={!isEditing}
                      className="polaris-textarea"
                    />
                  </TextContainer>
                </div>
                </div>
                             </div>
                
                {/* Action Button for Brand Voice Setup */}
                <div style={{ 
                  marginTop: '24px', 
                  paddingTop: '16px', 
                  borderTop: '1px solid #e1e3e5',
                  display: 'flex',
                  justifyContent: 'center'
                }}>
                  <Button 
                    variant="primary" 
                    onClick={() => navigate('/generate')}
                    size="large"
                  >
                    Generate Blog Post
                  </Button>
                </div>
                </div>
              )}
         </div>

        {/* Quick Actions Section */}
        <div className="quick-actions-section">
          <div className="section-header">
            <h2>Quick Actions</h2>
            <p>Get started with these common tasks.</p>
          </div>
          
          <div className="quick-actions-grid">
            <div className="action-card">
              <div className="card-icon">✍️</div>
              <h3>Generate Blog Post</h3>
              <p>Create AI-powered blog content from your products.</p>
              <Button 
                variant="primary" 
                onClick={() => navigate('/generate')}
                size="slim"
              >
                Generate Blog Post
              </Button>
            </div>
            
            <div className="action-card">
              <div className="card-icon">📝</div>
              <h3>Manage Templates</h3>
              <p>Create and customize blog post templates.</p>
              <a href="/templates" className="get-started-link">Get Started</a>
            </div>
            
            <div className="action-card">
              <div className="card-icon">💰</div>
              <h3>View Pricing</h3>
              <p>Choose the perfect plan for your needs.</p>
              <a href="/pricing" className="get-started-link">Get Started</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
