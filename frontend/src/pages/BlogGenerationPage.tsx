import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  Layout, 
  Select, 
  TextField, 
  TextContainer,
  Badge,
  Button,
  Tag
} from '@shopify/polaris';
import { 
  TextBoldIcon, 
  TextItalicIcon, 
  TextUnderlineIcon, 
  ListBulletedIcon, 
  TextColorIcon, 
  LinkIcon, 
  ImageIcon 
} from '@shopify/polaris-icons';
import createApp from '@shopify/app-bridge';
import { TitleBar } from '@shopify/app-bridge/actions';
import './BlogGenerationPage.css';
import shopifyBlogService, { BlogData } from '../services/shopifyBlogService';
import shopifyArticleService from '../services/shopifyArticleService';
import shopConfigService from '../services/shopConfigService';
import shopifySessionService from '../services/shopifySessionService';
import RichTextEditor from '../components/RichTextEditor';

export default function BlogGenerationPage() {
  const navigate = useNavigate();
  
  // App Bridge setup
  useEffect(() => {
    const config = {
      apiKey: import.meta.env.VITE_SHOPIFY_API_KEY || 'your-api-key',
      host: new URLSearchParams(window.location.search).get('host') || '',
      forceRedirect: true
    };
    
    const app = createApp(config);
    
    // Create App Bridge title bar (no buttons)
    const titleBar = TitleBar.create(app, {
      title: 'AI Blog Generation'
    });
    
    // Mount title bar  
    titleBar.subscribe(TitleBar.Action.UPDATE, () => {
      console.log('Title bar updated');
    });
  }, []);
  
  const [contentSettings, setContentSettings] = useState({
    styleVoice: 'conversational',
    depthLength: 'standard',
    goalCta: 'engagement',
    readerPerspective: 'second-person-you'
  });

  const [keywords, setKeywords] = useState('');
  const [keywordsTags, setKeywordsTags] = useState<string[]>([]);
  
  const [contentDetails, setContentDetails] = useState({
    keywords: 'summer fashion, t-shirts, 2025 trends',
    postTitle: 'Summer T-Shirt Trends 2025',
    selectedProduct: '',
    blogUrl: 'summer-t-shirt-trends-2025',
    blogContent: `<h2>The Evolution of Summer T-Shirts: From Basic to Trendsetting</h2>
<p>As we approach Summer 2025, the fashion landscape is evolving with exciting new trends that promise to redefine casual elegance. T-shirts, once considered basic wardrobe staples, are now at the forefront of innovative design and sustainable fashion movements.</p>

<p>The humble t-shirt has undergone a remarkable transformation, evolving from simple undergarments to sophisticated fashion statements. Summer 2025 sees this evolution reaching new heights, with designers reimagining the classic silhouette through innovative cuts, sustainable materials, and bold artistic expressions.</p>

<p>This season's t-shirt trends reflect a broader cultural shift toward conscious consumption and artistic self-expression, making them more than just clothing items—they're canvases for personal storytelling and environmental responsibility.</p>`
  });

  const [showBlogEditor, setShowBlogEditor] = useState(false);
  const [showGeneratedTitles, setShowGeneratedTitles] = useState(false);
  const [generatedTitles, setGeneratedTitles] = useState<string[]>([]);
  const [selectedTitle, setSelectedTitle] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [shopConfig, setShopConfig] = useState<any>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Initialize shop configuration
  useEffect(() => {
    initializeShopConfig();
  }, []);

  const initializeShopConfig = async () => {
    try {
      const config = shopConfigService.getConfig();
      setShopConfig(config);
      
      if (config && shopConfigService.isConfigValid()) {
        shopifyBlogService.initialize(config.storeDomain, config.accessToken, config.apiVersion);
      }
    } catch (error) {
      console.error('Error initializing shop configuration:', error);
    }
  };

  const handlePublishBlog = async () => {
          if (!shopConfig || !shopConfigService.isConfigValid()) {
        alert('Please configure your Shopify store first');
        return;
      }

    try {
      console.log('Publishing blog post...');
      
      // Get or create blog container
      let blogId: number;
      try {
        const blogs = await shopifyBlogService.getBlogs();
        if (blogs.blogs && blogs.blogs.length > 0) {
          blogId = blogs.blogs[0].id;
          console.log('Using existing blog:', blogId);
        } else {
          // Create new blog container
          const blogData: BlogData = {
            title: 'AI Generated Blog',
            handle: 'ai-generated-blog',
            tags: 'AI, Generated, Blog',
            commentable: 'moderate'
          };
          
          const blogResponse = await shopifyBlogService.createBlog(blogData);
          blogId = blogResponse.id;
          console.log('Created new blog container:', blogId);
        }
      } catch (error) {
        console.error('Error with blog container:', error);
        throw error;
      }

      // Initialize article service
      const shopDomain = shopifySessionService.getCurrentShop() || shopConfig.storeDomain;
      const accessToken = shopifySessionService.getAccessToken() || shopConfig.accessToken;
      
      if (!shopDomain || !accessToken) {
        throw new Error('Shop domain or access token not available');
      }

      shopifyArticleService.initialize(shopDomain, accessToken, shopConfig.apiVersion);

      // Create article data
      const articleData = {
        title: contentDetails.postTitle,
        body_html: contentDetails.blogContent,
        author: 'AI Blog Generator',
        tags: contentDetails.keywords,
        published: true,
        template_suffix: 'ai-generated'
      };

      console.log('Article data to publish:', articleData);

      // Publish article
      const articleResponse = await shopifyArticleService.createArticle(blogId, articleData);
      console.log('Article published successfully:', articleResponse);

      alert('Blog post published successfully!');
      setShowBlogEditor(false);
      
    } catch (error) {
      console.error('Error publishing blog:', error);
      alert(`Failed to publish blog: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleGenerateTitles = async () => {
    if (!keywords.trim()) {
      alert('Please enter keywords first');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await aiService.generateBlogTitles({
        brandVoice: {
          tone: contentSettings.styleVoice,
          formalityLevel: contentSettings.depthLength,
          brandPersonality: 'modern',
          businessDescription: 'Fashion and Lifestyle',
          targetCustomer: 'Fashion-conscious consumers'
        },
        keywords: keywords.split(',').map(k => k.trim()),
        language: 'en'
      });

      if (response.success) {
        setGeneratedTitles(response.titles);
        setSelectedTitle(response.recommendedTitle);
        setShowGeneratedTitles(true);
      } else {
        alert('Failed to generate titles');
      }
    } catch (error) {
      console.error('Error generating titles:', error);
      alert('Failed to generate titles');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTitleSelect = (title: string) => {
    setSelectedTitle(title);
    setContentDetails(prev => ({ ...prev, postTitle: title }));
  };

  const handleContentSettingsChange = (field: string, value: string) => {
    setContentSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleKeywordsChange = (value: string) => {
    setKeywords(value);
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setKeywordsTags(tags);
  };

  const handleSaveChanges = () => {
    setHasUnsavedChanges(false);
    // TODO: Implement save logic
  };

  const handleCancelChanges = () => {
    setHasUnsavedChanges(false);
    // TODO: Implement cancel logic
  };

  return (
    <div className="blog-generation-page">
      <div className="page-header">
        <h1>AI Blog Generation</h1>
        <p>Generate engaging blog content for your Shopify store</p>
      </div>

      {/* Shopify Store Connection Status */}
      <Card>
        <div style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600' }}>
                Shopify Store Connection
              </h3>
                             <p style={{ margin: '0', color: '#6d7175', fontSize: '14px' }}>
                 {shopConfig && shopConfigService.isConfigValid()
                   ? `Connected to ${shopConfig.storeDomain}` 
                   : 'Not configured - Please configure your Shopify store to publish blogs'
                 }
               </p>
             </div>
             {(!shopConfig || !shopConfigService.isConfigValid()) && (
              <Button 
                variant="primary" 
                onClick={() => navigate('/auth')}
              >
                Install App
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Content Settings */}
      <Card>
        <div style={{ padding: '20px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>
            Content Settings
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                Style & Voice
              </label>
              <Select
                options={[
                  { label: 'Conversational', value: 'conversational' },
                  { label: 'Professional', value: 'professional' },
                  { label: 'Casual', value: 'casual' },
                  { label: 'Formal', value: 'formal' }
                ]}
                value={contentSettings.styleVoice}
                onChange={(value) => handleContentSettingsChange('styleVoice', value)}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                Depth & Length
              </label>
              <Select
                options={[
                  { label: 'Standard', value: 'standard' },
                  { label: 'Detailed', value: 'detailed' },
                  { label: 'Comprehensive', value: 'comprehensive' },
                  { label: 'Brief', value: 'brief' }
                ]}
                value={contentSettings.depthLength}
                onChange={(value) => handleContentSettingsChange('depthLength', value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                Goal & CTA
              </label>
              <Select
                options={[
                  { label: 'Engagement', value: 'engagement' },
                  { label: 'Sales', value: 'sales' },
                  { label: 'Education', value: 'education' },
                  { label: 'Brand Awareness', value: 'brand-awareness' }
                ]}
                value={contentSettings.goalCta}
                onChange={(value) => handleContentSettingsChange('goalCta', value)}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                Reader Perspective
              </label>
              <Select
                options={[
                  { label: 'Second Person (You)', value: 'second-person-you' },
                  { label: 'Third Person', value: 'third-person' },
                  { label: 'First Person (We)', value: 'first-person-we' }
                ]}
                value={contentSettings.readerPerspective}
                onChange={(value) => handleContentSettingsChange('readerPerspective', value)}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Keywords Input */}
      <Card>
        <div style={{ padding: '20px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600' }}>
            Keywords & Topics
          </h3>
          
          <TextField
            label="Keywords (comma-separated)"
            value={keywords}
            onChange={handleKeywordsChange}
            placeholder="e.g., summer fashion, t-shirts, 2025 trends"
            multiline={3}
            helpText="Enter relevant keywords and topics for your blog post"
          />
          
          {keywordsTags.length > 0 && (
            <div style={{ marginTop: '12px' }}>
              <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Keywords:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {keywordsTags.map((tag, index) => (
                  <Tag key={index}>{tag}</Tag>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Generate Button */}
      <div style={{ textAlign: 'center', margin: '24px 0' }}>
        <Button 
          variant="primary" 
          size="large"
          onClick={handleGenerateTitles}
          disabled={!keywords.trim() || isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Generate Blog Titles'}
        </Button>
      </div>

      {/* Generated Titles Modal */}
      {showGeneratedTitles && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>
                Generated Blog Titles
              </h2>
              <button
                onClick={() => setShowGeneratedTitles(false)}
                style={{
                  border: 'none',
                  backgroundColor: 'transparent',
                  fontSize: '20px',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <p style={{ margin: '0 0 16px 0', color: '#6d7175' }}>
                Choose a title for your blog post:
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {generatedTitles.map((title, index) => (
                  <label key={index} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '12px',
                    border: '1px solid #e1e3e5',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    backgroundColor: selectedTitle === title ? '#f0f9ff' : 'white'
                  }}>
                    <input
                      type="radio"
                      name="title"
                      value={title}
                      checked={selectedTitle === title}
                      onChange={() => handleTitleSelect(title)}
                    />
                    <div>
                      <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                        {title}
                        {index === 0 && (
                          <Badge tone="success" size="small" style={{ marginLeft: '8px' }}>
                            Recommended
                          </Badge>
                        )}
                      </div>
                    </div>
                  </label>
                ))}
                
                <label style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '12px',
                  border: '1px solid #e1e3e5',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor: selectedTitle === 'custom' ? '#f0f9ff' : 'white'
                }}>
                  <input
                    type="radio"
                    name="title"
                    value="custom"
                    checked={selectedTitle === 'custom'}
                    onChange={() => setSelectedTitle('custom')}
                  />
                  <div>
                    <div style={{ fontWeight: '500' }}>Write your own</div>
                  </div>
                </label>
              </div>
            </div>

            {selectedTitle === 'custom' && (
              <div style={{ marginBottom: '20px' }}>
                <TextField
                  label="Custom Title"
                  value={contentDetails.postTitle}
                  onChange={(value) => setContentDetails(prev => ({ ...prev, postTitle: value }))}
                  placeholder="Enter your custom title"
                />
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <Button variant="secondary" onClick={() => setShowGeneratedTitles(false)}>
                Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={() => {
                  setShowGeneratedTitles(false);
                  setShowBlogEditor(true);
                }}
                disabled={!selectedTitle || (selectedTitle === 'custom' && !contentDetails.postTitle.trim())}
              >
                Continue to Editor
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Blog Editor Modal */}
      {showBlogEditor && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            width: '95%',
            height: '90vh',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Title Bar */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '20px',
              borderBottom: '1px solid #e1e3e5'
            }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>
                Blog Editor
              </h2>
              <div style={{ display: 'flex', gap: '12px' }}>
                <Button 
                  variant="primary"
                  onClick={handlePublishBlog}
                >
                  🚀 Publish Blog
                </Button>
                <Button 
                  variant="secondary"
                  onClick={() => setShowBlogEditor(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
            
            {/* Editor Content */}
            <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
              {/* Blog Title */}
              <div style={{ marginBottom: '24px' }}>
                <TextField
                  label="Blog Title"
                  value={contentDetails.postTitle}
                  onChange={(value) => setContentDetails(prev => ({ ...prev, postTitle: value }))}
                  placeholder="Enter your blog title"
                />
              </div>

              {/* Blog URL */}
              <div style={{ marginBottom: '24px' }}>
                <TextField
                  label="Blog URL (handle)"
                  value={contentDetails.blogUrl}
                  onChange={(value) => setContentDetails(prev => ({ ...prev, blogUrl: value }))}
                  placeholder="blog-url-handle"
                  helpText="This will be the URL slug for your blog post"
                />
              </div>

              {/* Rich Text Editor */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '12px', fontSize: '14px', fontWeight: '500' }}>
                  Blog Content
                </label>
                <RichTextEditor
                  value={contentDetails.blogContent}
                  onChange={(content) => setContentDetails(prev => ({ ...prev, blogContent: content }))}
                  placeholder="Start writing your blog content..."
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



