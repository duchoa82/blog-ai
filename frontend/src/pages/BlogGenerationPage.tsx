import React, { useState } from 'react';
import './BlogGenerationPage.css';

export default function BlogGenerationPage() {
  const [brandVoice, setBrandVoice] = useState({
    tone: 'professional',
    formalityLevel: 'semi-formal',
    brandPersonality: 'professional',
    businessDescription: '',
    targetCustomer: ''
  });

  const [contentDetails, setContentDetails] = useState({
    keywords: '',
    blogType: 'product-review'
  });

  const [generatedTitles, setGeneratedTitles] = useState<string[]>([]);
  const [recommendedTitle, setRecommendedTitle] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleBrandVoiceChange = (field: string, value: string) => {
    setBrandVoice(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContentChange = (field: string, value: string) => {
    setContentDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGenerateTitles = async () => {
    if (!brandVoice.businessDescription || !brandVoice.targetCustomer || !contentDetails.keywords) {
      alert('Please fill in all required fields');
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const mockTitles = [
        "How to Choose the Perfect Product for Your Needs",
        "Industry Trends: What's Hot in 2024",
        "Product Spotlight: Why This Item Stands Out",
        "Customer Success Stories: Real Results from Real People",
        "My Take: Why This Trend Matters for Your Business",
        "Behind the Scenes: How We Create Quality Products",
        "Fun Facts: Surprising Things About Our Products"
      ];
      
      setGeneratedTitles(mockTitles);
      setRecommendedTitle(mockTitles[0]); // First title as recommended
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="blog-generation-page">
      {/* Top Header */}
      <div className="top-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="page-title">AI Blog Generation</h1>
          </div>
          <div className="header-right">
            <button className="generate-button">
              Generate Blog Post
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Brand Voice Configuration Section */}
        <div className="brand-voice-section">
          <div className="section-header">
            <h2>Brand Voice Configuration</h2>
            <p>Set your brand voice to generate personalized blog titles</p>
          </div>
          
          <div className="brand-voice-form">
            <div className="form-columns">
              <div className="form-column">
                <div className="form-field">
                  <label>Tone</label>
                  <select
                    value={brandVoice.tone}
                    onChange={(e) => handleBrandVoiceChange('tone', e.target.value)}
                  >
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="friendly">Friendly</option>
                    <option value="formal">Formal</option>
                    <option value="creative">Creative</option>
                    <option value="technical">Technical</option>
                  </select>
                </div>
                <div className="form-field">
                  <label>Formality Level</label>
                  <select
                    value={brandVoice.formalityLevel}
                    onChange={(e) => handleBrandVoiceChange('formalityLevel', e.target.value)}
                  >
                    <option value="formal">Formal</option>
                    <option value="semi-formal">Semi-formal</option>
                    <option value="casual">Casual</option>
                  </select>
                </div>
                <div className="form-field">
                  <label>Brand Personality</label>
                  <select
                    value={brandVoice.brandPersonality}
                    onChange={(e) => handleBrandVoiceChange('brandPersonality', e.target.value)}
                  >
                    <option value="professional">Professional</option>
                    <option value="friendly">Friendly</option>
                    <option value="innovative">Innovative</option>
                    <option value="trustworthy">Trustworthy</option>
                  </select>
                </div>
              </div>
              
              <div className="form-column">
                <div className="form-field">
                  <label>Business Description</label>
                  <textarea
                    value={brandVoice.businessDescription}
                    onChange={(e) => handleBrandVoiceChange('businessDescription', e.target.value)}
                    placeholder="Describe your business and what you do"
                    rows={3}
                  />
                </div>
                <div className="form-field">
                  <label>Target Customer</label>
                  <textarea
                    value={brandVoice.targetCustomer}
                    onChange={(e) => handleBrandVoiceChange('targetCustomer', e.target.value)}
                    placeholder="Describe your target customers"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Details Section */}
        <div className="content-details-section">
          <div className="section-header">
            <h2>Blog Content Details</h2>
            <p>Provide keywords and content type for your blog</p>
          </div>
          
          <div className="content-form">
            <div className="form-row">
              <div className="form-field">
                <label>Keywords</label>
                <input
                  type="text"
                  value={contentDetails.keywords}
                  onChange={(e) => handleContentChange('keywords', e.target.value)}
                  placeholder="Enter keywords for your blog (comma separated)"
                />
              </div>
              <div className="form-field">
                <label>Blog Type</label>
                <select
                  value={contentDetails.blogType}
                  onChange={(e) => handleContentChange('blogType', e.target.value)}
                >
                  <option value="product-review">Product Review</option>
                  <option value="how-to-guide">How-to Guide</option>
                  <option value="lifestyle">Lifestyle</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="generate-section">
          <button 
            className="generate-titles-button" 
            onClick={handleGenerateTitles}
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Generate 7 Blog Titles'}
          </button>
        </div>

        {/* Generated Titles Section */}
        {generatedTitles.length > 0 && (
          <div className="titles-section">
            <div className="section-header">
              <h2>Generated Blog Titles</h2>
              <p>AI-generated titles based on your brand voice and content</p>
            </div>
            
            <div className="titles-list">
              {generatedTitles.map((title, index) => (
                <div key={index} className={`title-item ${index === 0 ? 'recommended' : ''}`}>
                  <div className="title-number">{index + 1}</div>
                  <div className="title-content">
                    <div className="title-text">{title}</div>
                    <div className="title-pillar">
                      {index === 0 && 'Educational / How-to'}
                      {index === 1 && 'Industry Insights / Trends'}
                      {index === 2 && 'Product-focused'}
                      {index === 3 && 'Customer Stories / Testimonials'}
                      {index === 4 && 'Opinion / Thought Leadership'}
                      {index === 5 && 'Behind-the-scenes / Company Culture'}
                      {index === 6 && 'Fun / Engaging / Light-hearted'}
                    </div>
                  </div>
                  {index === 0 && <div className="recommended-badge">Recommended</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isGenerating && (
          <div className="loading-section">
            <div className="loading-content">
              <h3>Generating Your Blog Titles...</h3>
              <p>AI is analyzing your brand voice and creating personalized titles</p>
              <div className="spinner"></div>
              <p className="loading-note">This may take a few moments...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
