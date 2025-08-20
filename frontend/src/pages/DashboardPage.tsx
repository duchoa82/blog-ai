import React, { useState } from 'react';
import './DashboardPage.css';

interface DashboardPageProps {
  shopInfo: {
    isDevelopment: boolean;
  };
}

export default function DashboardPage({ shopInfo }: DashboardPageProps) {
  const [brandVoice, setBrandVoice] = useState({
    brandName: '',
    targetAudience: '',
    brandDescription: '',
    brandGuidelines: '',
    writingTone: '',
    industrySector: ''
  });

  const handleBrandVoiceChange = (field: string, value: string) => {
    setBrandVoice(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveBrandVoice = () => {
    console.log('Saving brand voice:', brandVoice);
    // TODO: Implement save functionality
  };

  return (
    <div className="dashboard-page">
      {/* Top Header */}
      <div className="top-header">
        <div className="header-content">
          <div className="header-left">
            <span className="brand-icon">B</span>
            <h1 className="app-title">ENIPA AI Blog Writing Assist</h1>
          </div>
          <div className="header-right">
            <button className="generate-button" variant="primary">
              Generate Blog Post
            </button>
            <div className="more-options">⋯</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Brand Voice Setup Section */}
        <div className="brand-voice-section">
          <div className="section-header">
            <h2>Brand Voice Setup</h2>
            <p>Configure your brand voice to generate personalized content that matches your brand identity.</p>
          </div>
          
          <div className="brand-voice-form">
            <div className="form-columns">
              <div className="form-column">
                <div className="form-field">
                  <label>Brand Name</label>
                  <input
                    type="text"
                    value={brandVoice.brandName}
                    onChange={(e) => handleBrandVoiceChange('brandName', e.target.value)}
                    placeholder="Enter your brand name"
                  />
                </div>
                <div className="form-field">
                  <label>Target Audience</label>
                  <input
                    type="text"
                    value={brandVoice.targetAudience}
                    onChange={(e) => handleBrandVoiceChange('targetAudience', e.target.value)}
                    placeholder="Describe your target audience"
                  />
                </div>
                <div className="form-field">
                  <label>Brand Description</label>
                  <textarea
                    value={brandVoice.brandDescription}
                    onChange={(e) => handleBrandVoiceChange('brandDescription', e.target.value)}
                    placeholder="Describe your brand"
                    rows={3}
                  />
                </div>
                <div className="form-field">
                  <label>Brand Guidelines</label>
                  <textarea
                    value={brandVoice.brandGuidelines}
                    onChange={(e) => handleBrandVoiceChange('brandGuidelines', e.target.value)}
                    placeholder="Your brand guidelines"
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="form-column">
                <div className="form-field">
                  <label>Writing Tone</label>
                  <select
                    value={brandVoice.writingTone}
                    onChange={(e) => handleBrandVoiceChange('writingTone', e.target.value)}
                  >
                    <option value="">Select tone</option>
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="friendly">Friendly</option>
                    <option value="authoritative">Authoritative</option>
                    <option value="conversational">Conversational</option>
                  </select>
                </div>
                <div className="form-field">
                  <label>Industry/Sector</label>
                  <input
                    type="text"
                    value={brandVoice.industrySector}
                    onChange={(e) => handleBrandVoiceChange('industrySector', e.target.value)}
                    placeholder="Your industry or sector"
                  />
                </div>
              </div>
            </div>
            
            <div className="form-actions">
              <button 
                className="save-button" 
                variant="primary"
                onClick={handleSaveBrandVoice}
              >
                Save Brand Voice
              </button>
            </div>
          </div>
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
              <a href="/generate" className="get-started-link">Get Started</a>
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
