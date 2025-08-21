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
// import PageHeader from '../components/layout/PageHeader';
import './BlogGenerationPage.css';
import shopifyBlogService, { BlogData } from '../services/shopifyBlogService';
import shopConfigService from '../services/shopConfigService';
import shopifySessionService from '../services/shopifySessionService';

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
    keywords: '',
    postTitle: '',
    selectedProduct: '',
    blogUrl: '',
    blogContent: `<h2>The Evolution of Summer T-Shirts: From Basic to Trendsetting</h2>
<p>As we approach Summer 2025, the fashion landscape is evolving with exciting new trends that promise to redefine casual elegance. T-shirts, once considered basic wardrobe staples, are now at the forefront of innovative design and sustainable fashion movements.</p>

<p>The humble t-shirt has undergone a remarkable transformation, evolving from simple undergarments to sophisticated fashion statements. Summer 2025 sees this evolution reaching new heights, with designers reimagining the classic silhouette through innovative cuts, sustainable materials, and bold artistic expressions.</p>

<p>This season's t-shirt trends reflect a broader cultural shift toward conscious consumption and artistic self-expression, making them more than just clothing items—they're canvases for personal storytelling and environmental responsibility.</p>

<h2>Historical Context of T-Shirts in Summer Fashion</h2>
<p>The t-shirt's journey through fashion history reveals its remarkable adaptability and cultural significance. From its origins as military undergarments to its adoption by various subcultures, the t-shirt has consistently functioned as a barometer for cultural shifts and aesthetic preferences.</p>

<p>Each decade has brought new interpretations, from the rebellious graphics of the 1960s to the minimalist aesthetics of the 1990s, culminating in today's sophisticated blend of heritage and innovation.</p>

<blockquote style="border-left: 4px solid #008060; padding-left: 20px; margin: 32px 0; font-style: italic; font-size: 18px; color: #6d7175;">
"The t-shirt has consistently functioned as a barometer for cultural shifts and aesthetic preferences, with its evolution reflecting broader societal transformations in attitudes toward leisure, self-expression, and the democratization of fashion."
<div style="margin-top: 12px; font-size: 14px; color: #8c9196;">- Dr. Eliza Montgomery, Fashion Historian at the Institute of Contemporary Style</div>
</blockquote>

<p>Summer 2025's t-shirt trends represent a culmination of this rich historical lineage, combining the best elements of past decades with cutting-edge innovations in sustainability, technology, and design philosophy.</p>

<h3>Key Trends for Summer 2025:</h3>
<ul>
<li><strong>Eco-friendly Materials:</strong> Organic cotton, bamboo, and recycled fabrics</li>
<li><strong>Bold Graphics:</strong> Artistic prints and cultural motifs</li>
<li><strong>Innovative Cuts:</strong> Asymmetric hems and modern silhouettes</li>
<li><strong>Sustainable Production:</strong> Ethical manufacturing processes</li>
</ul>

<h3>Styling Tips:</h3>
<ol>
<li>Pair with high-waisted shorts for a retro vibe</li>
<li>Layer under blazers for smart-casual looks</li>
<li>Accessorize with statement jewelry</li>
<li>Choose breathable fabrics for hot weather</li>
</ol>`
  });

  const [showProductModal, setShowProductModal] = useState(false);
  const [showBlogEditor, setShowBlogEditor] = useState(false);
  const [showTitleDropdown, setShowTitleDropdown] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showImageLibraryModal, setShowImageLibraryModal] = useState(false);
  
  // Track changes for save functionality
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [originalContentDetails, setOriginalContentDetails] = useState({
    keywords: '',
    postTitle: '',
    selectedProduct: '',
    blogUrl: '',
    blogContent: ''
  });

  // Keywords tag management functions
  const handleKeywordsChange = (value: string) => {
    setKeywords(value);
  };

  const handleKeywordsKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addKeyword();
    }
  };

  const addKeyword = () => {
    const trimmedKeyword = keywords.trim();
    if (trimmedKeyword && !keywordsTags.includes(trimmedKeyword)) {
      setKeywordsTags(prev => [...prev, trimmedKeyword]);
      setKeywords('');
      // Update contentDetails for form submission
      setContentDetails(prev => ({
        ...prev,
        keywords: [...keywordsTags, trimmedKeyword].join(', ')
      }));
    }
  };

  const removeKeyword = (tagToRemove: string) => {
    const newTags = keywordsTags.filter(tag => tag !== tagToRemove);
    setKeywordsTags(newTags);
    // Update contentDetails for form submission
    setContentDetails(prev => ({
      ...prev,
      keywords: newTags.join(', ')
    }));
    setHasUnsavedChanges(true);
  };

  // Handle content changes and track unsaved changes
  const handleContentDetailsChange = (field: string, value: string) => {
    setContentDetails(prev => ({
      ...prev,
      [field]: value
    }));
    setHasUnsavedChanges(true);
  };

  // Save changes
  const handleSaveChanges = () => {
    setOriginalContentDetails({ ...contentDetails });
    setHasUnsavedChanges(false);
    console.log('Changes saved successfully');
  };

  // Cancel changes
  const handleCancelChanges = () => {
    setContentDetails({ ...originalContentDetails });
    setHasUnsavedChanges(false);
    console.log('Changes cancelled');
  };

  // Shop configuration state
  const [shopConfig, setShopConfig] = useState({
    isConfigured: false,
    isConnecting: false,
    connectionError: '',
    shopName: '',
    currentShop: '',
  });

  // Initialize original content when modal opens
  useEffect(() => {
    if (showBlogEditor) {
      setOriginalContentDetails({ ...contentDetails });
      setHasUnsavedChanges(false);
    }
  }, [showBlogEditor]);

  // Initialize shop configuration
  useEffect(() => {
    const initializeShopConfig = async () => {
      try {
        // Lấy shop hiện tại từ URL hoặc session
        const currentShop = shopifySessionService.getCurrentShop();
        
        if (currentShop) {
          // Kiểm tra session có hợp lệ không
          const session = shopifySessionService.getSession(currentShop);
          
          if (session) {
            // Initialize Shopify API client với session
            shopifyBlogService.initialize(
              currentShop,
              session.accessToken,
              '2025-01'
            );
            
            setShopConfig(prev => ({
              ...prev,
              isConfigured: true,
              shopName: session.shopName || currentShop.replace('.myshopify.com', ''),
              currentShop,
            }));
            
            // Test connection
            setShopConfig(prev => ({ ...prev, isConnecting: true }));
            try {
              // Test với shop info
              const shopInfo = await shopifyBlogService.getClientInfo();
              setShopConfig(prev => ({
                ...prev,
                isConnecting: false,
                connectionError: '',
              }));
            } catch (error) {
              setShopConfig(prev => ({
                ...prev,
                isConnecting: false,
                connectionError: 'Failed to connect to store',
              }));
            }
          } else {
            // Không có session hợp lệ
            setShopConfig(prev => ({
              ...prev,
              isConfigured: false,
              currentShop,
              connectionError: 'Please install the app first',
            }));
          }
        } else {
          // Fallback: dùng config cũ nếu có
          const config = shopConfigService.getConfig();
          if (config && shopConfigService.isConfigValid()) {
            shopifyBlogService.initialize(
              config.storeDomain,
              config.accessToken,
              config.apiVersion
            );
            setShopConfig(prev => ({
              ...prev,
              isConfigured: false,
              connectionError: 'No shop configured. Please install the app.',
            }));
          } else {
            setShopConfig(prev => ({
              ...prev,
              isConfigured: false,
              connectionError: 'No shop configured. Please install the app.',
            }));
          }
        }
      } catch (error) {
        console.error('Error initializing shop configuration:', error);
        setShopConfig(prev => ({
          ...prev,
          isConfigured: false,
          connectionError: error instanceof Error ? error.message : 'Unknown error',
        }));
      }
    };

    initializeShopConfig();
  }, []);

  // Publish blog post to Shopify store
  const handlePublishBlog = async () => {
    try {
      console.log('Publishing blog post...');
      
      // Check if shop is configured
      if (!shopConfig.isConfigured) {
        alert('Shop not configured. Please configure your Shopify store first.');
        return;
      }

      if (shopConfig.connectionError) {
        alert(`Shop connection error: ${shopConfig.connectionError}. Please check your configuration.`);
        return;
      }
      
      // Get visibility setting from form
      const visibilityInput = document.querySelector('input[name="visibility"]:checked') as HTMLInputElement;
      const isPublished = visibilityInput?.value === 'visible';
      
      // Prepare blog data for Shopify API
      const blogData: BlogData = {
        blog: {
          title: contentDetails.postTitle,
          body_html: contentDetails.blogContent,
          published: isPublished,
          handle: contentDetails.blogUrl || generateHandle(contentDetails.postTitle),
          tags: keywordsTags.join(', '),
          meta_title: contentDetails.postTitle,
          meta_description: contentDetails.blogContent.substring(0, 160), // First 160 chars
          // TODO: Add featured image when implemented
        }
      };

      console.log('Blog data to publish:', blogData);

      // Show loading state
      setShopConfig(prev => ({ ...prev, isConnecting: true }));

      // Call Shopify Admin API using the service
      const response = await shopifyBlogService.createBlog(blogData);
      
      console.log('Blog published successfully:', response);

      // Hide loading state
      setShopConfig(prev => ({ ...prev, isConnecting: false }));

      // Show success message
      alert(`Blog post "${response.blog.title}" ${isPublished ? 'published' : 'saved as draft'} successfully!`);
      setShowBlogEditor(false);
      
    } catch (error) {
      console.error('Error publishing blog:', error);
      
      // Hide loading state
      setShopConfig(prev => ({ ...prev, isConnecting: false }));
      
      // Show error message
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to publish blog post: ${errorMessage}`);
    }
  };

  // Generate URL handle from title
  const generateHandle = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const [generatedTitles, setGeneratedTitles] = useState<string[]>([]);
  const [recommendedTitle, setRecommendedTitle] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Helper functions for text formatting
  const applyHeading = (tag: string) => {
    console.log('applyHeading called - SIMPLE VERSION:', tag);
    
    const editor = document.querySelector('[contenteditable]') as HTMLElement;
    if (!editor) return;
    
    editor.focus();
    
    const newElement = document.createElement(tag);
    newElement.textContent = `# ${tag.toUpperCase()} HEADING`;
    editor.appendChild(newElement);
    
    console.log(`${tag} heading appended successfully`);
    setShowTitleDropdown(false);
  };

  const applyTextColor = (color: string) => {
    console.log('applyTextColor called - SIMPLE VERSION:', color);
    
    const editor = document.querySelector('[contenteditable]') as HTMLElement;
    if (!editor) return;
    
    editor.focus();
    
    const span = document.createElement('span');
    span.style.color = color;
    span.textContent = ` [COLORED TEXT] `;
    editor.appendChild(span);
    
    console.log('Colored text appended successfully');
    setShowColorPicker(false);
  };

  const createLink = (url: string) => {
    console.log('createLink called - SIMPLE VERSION:', url);
    
    const editor = document.querySelector('[contenteditable]') as HTMLElement;
    if (!editor) return;
    
    editor.focus();
    
    const link = document.createElement('a');
    link.href = url;
    link.textContent = ' [LINK TEXT] ';
    editor.appendChild(link);
    
    console.log('Link appended successfully');
    setShowLinkInput(false);
    setLinkUrl('');
  };

  const insertImage = (url: string) => {
    console.log('insertImage called - SIMPLE VERSION:', url);
    
    const editor = document.querySelector('[contenteditable]') as HTMLElement;
    if (!editor) return;
    
    editor.focus();
    
    const img = document.createElement('img');
    img.src = url;
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    img.alt = 'Inserted Image';
    editor.appendChild(img);
    
    console.log('Image appended successfully');
    setShowImageModal(false);
  };

  // Basic formatting functions
  const applyBold = () => {
    console.log('applyBold called - SIMPLE VERSION');
    
    // Find editor
    const editor = document.querySelector('[contenteditable]') as HTMLElement;
    if (!editor) {
      console.log('Editor not found');
      return;
    }
    
    // Focus editor
    editor.focus();
    
    // Simply append new content to editor
    const strong = document.createElement('strong');
    strong.textContent = ' **BOLD TEXT** ';
    editor.appendChild(strong);
    
    console.log('Bold text appended successfully');
  };

  const applyItalic = () => {
    console.log('applyItalic called - SIMPLE VERSION');
    
    const editor = document.querySelector('[contenteditable]') as HTMLElement;
    if (!editor) return;
    
    editor.focus();
    
    const em = document.createElement('em');
    em.textContent = ' *ITALIC TEXT* ';
    editor.appendChild(em);
    
    console.log('Italic text appended successfully');
  };

  const applyUnderline = () => {
    console.log('applyUnderline called - SIMPLE VERSION');
    
    const editor = document.querySelector('[contenteditable]') as HTMLElement;
    if (!editor) return;
    
    editor.focus();
    
    const u = document.createElement('u');
    u.textContent = ' _UNDERLINED TEXT_ ';
    editor.appendChild(u);
    
    console.log('Underlined text appended successfully');
  };

  const applyList = () => {
    console.log('applyList called - SIMPLE VERSION');
    
    const editor = document.querySelector('[contenteditable]') as HTMLElement;
    if (!editor) return;
    
    editor.focus();
    
    const ul = document.createElement('ul');
    const li = document.createElement('li');
    li.textContent = '• LIST ITEM';
    ul.appendChild(li);
    editor.appendChild(ul);
    
    console.log('List appended successfully');
  };

  const handleContentSettingsChange = (field: string, value: string) => {
    setContentSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };



  const handleEditField = (field: string) => {
    console.log('Editing field:', field);
    // TODO: Implement field editing
  };

  const handleGenerateTitles = async () => {
    if (!contentDetails.keywords) {
      alert('Please enter keywords for your blog');
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
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="page-title">AI Blog Generation</h1>
          </div>
        </div>
      </div>

      {/* Shop Configuration Status */}
      <div className="shop-config-status" style={{ marginBottom: '24px' }}>
        <Card>
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '500' }}>
                  Shopify Store Connection
                </h3>
                <div style={{ fontSize: '14px', color: '#6d7175' }}>
                  {shopConfig.isConfigured ? (
                    <>
                      Connected to: <strong>{shopConfig.shopName}</strong>
                      {shopConfig.connectionError && (
                        <span style={{ color: '#d82c0d', marginLeft: '8px' }}>
                          ⚠️ {shopConfig.connectionError}
                        </span>
                      )}
                    </>
                  ) : (
                    'Not configured - Please configure your Shopify store to publish blogs'
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {shopConfig.isConnecting && (
                  <div style={{ fontSize: '14px', color: '#6d7175' }}>Connecting...</div>
                )}
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: shopConfig.isConfigured && !shopConfig.connectionError 
                    ? '#50b83c' 
                    : shopConfig.isConfigured 
                    ? '#f49342' 
                    : '#d82c0d'
                }} />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* All Fields Container */}
        <Card>
          <div style={{ padding: '24px' }}>
            
            {/* Content Generation Settings */}
            <div style={{ marginTop: '24px' }}>
              <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '500' }}>Content Settings</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                <div>
                  <div style={{ 
                    fontSize: '14px', 
                    fontWeight: '500', 
                    color: '#202223', 
                    marginBottom: '4px',
                    lineHeight: '1.4'
                  }}>
                    Style & Voice
                  </div>
                  <Select
                    label=""
                    labelInline
                    options={[
                      { label: 'Conversational', value: 'conversational' },
                      { label: 'Storytelling', value: 'storytelling' },
                      { label: 'Educational / Analytical', value: 'educational-analytical' },
                      { label: 'Persuasive / Motivational', value: 'persuasive-motivational' },
                      { label: 'Entertaining / Opinionated', value: 'entertaining-opinionated' }
                    ]}
                    value={contentSettings.styleVoice}
                    onChange={(value) => handleContentSettingsChange('styleVoice', value)}
                  />
                </div>
                
                <div>
                  <div style={{ 
                    fontSize: '14px', 
                    fontWeight: '500', 
                    color: '#202223', 
                    marginBottom: '4px',
                    lineHeight: '1.4'
                  }}>
                    Depth & Length
                  </div>
                  <Select
                    label=""
                    labelInline
                    options={[
                      { label: 'Quick Read (500–800 words)', value: 'quick-read' },
                      { label: 'Standard (1,000–1,500 words)', value: 'standard' },
                      { label: 'In-depth (2,000+ words)', value: 'in-depth' }
                    ]}
                    value={contentSettings.depthLength}
                    onChange={(value) => handleContentSettingsChange('depthLength', value)}
                  />
                </div>
                
                <div>
                  <div style={{ 
                    fontSize: '14px', 
                    fontWeight: '500', 
                    color: '#202223', 
                    marginBottom: '4px',
                    lineHeight: '1.4'
                  }}>
                    Goal / CTA
                  </div>
                  <Select
                    label=""
                    labelInline
                    options={[
                      { label: 'Engagement (comments & shares)', value: 'engagement' },
                      { label: 'Awareness (informative / thought leadership)', value: 'awareness' },
                      { label: 'Conversion (product / service / lead gen)', value: 'conversion' },
                      { label: 'Community (loyalty & long-term trust)', value: 'community' }
                    ]}
                    value={contentSettings.goalCta}
                    onChange={(value) => handleContentSettingsChange('goalCta', value)}
                  />
                </div>
                
                <div>
                  <div style={{ 
                    fontSize: '14px', 
                    fontWeight: '500', 
                    color: '#202223', 
                    marginBottom: '4px',
                    lineHeight: '1.4'
                  }}>
                    Reader Perspective
                  </div>
                  <Select
                    label=""
                    labelInline
                    options={[
                      { label: 'First-person (I)', value: 'first-person-i' },
                      { label: 'First-person (We)', value: 'first-person-we' },
                      { label: 'Second-person (You)', value: 'second-person-you' },
                      { label: 'Third-person (They/It)', value: 'third-person-they-it' }
                    ]}
                    value={contentSettings.readerPerspective}
                    onChange={(value) => handleContentSettingsChange('readerPerspective', value)}
                  />
                </div>
              </div>
            </div>

            {/* Keywords Section */}
            <div style={{ marginTop: '32px' }}>
              <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: '500' }}>Content Details</h3>
              
              {/* Keywords Input with Tags */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  marginBottom: '8px',
                  color: '#202223'
                }}>
                  Keywords
                </div>
                <div onKeyDown={handleKeywordsKeyDown}>
                  <TextField
                    label=""
                    value={keywords}
                    onChange={handleKeywordsChange}
                    placeholder="Type keywords and press Enter or comma to add tags"
                    autoComplete="off"
                  />
                </div>
              </div>

              {/* Keywords Tags Display */}
              {keywordsTags.length > 0 && (
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '8px',
                  marginTop: '12px'
                }}>
                  {keywordsTags.map((tag, index) => (
                    <Tag
                      key={index}
                      onRemove={() => removeKeyword(tag)}
                    >
                      {tag}
                    </Tag>
                  ))}
                </div>
              )}
            </div>



            {/* Blog Title Section */}
            <div style={{ marginTop: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: '#202223'
                }}>
                  Blog title
                </div>
                <button 
                  className="polaris-button polaris-button--plain"
                  disabled={!contentDetails.keywords || contentDetails.keywords.trim() === ''}
                  onClick={handleGenerateTitles}
                >
                  Generate title
                </button>
              </div>
              <TextField
                label=""
                value={contentDetails.postTitle}
                onChange={(value) => handleContentDetailsChange('postTitle', value)}
                placeholder="Enter your blog title"
                autoComplete="off"
              />
            </div>

            {/* Blog URL Input */}
            <div style={{ marginTop: '24px' }}>
              <TextField
                label="Blog URL"
                value={contentDetails.blogUrl}
                onChange={(value) => handleContentDetailsChange('blogUrl', value)}
                placeholder="Enter URL for your blog post"
                autoComplete="off"
              />
            </div>

            {/* Action Buttons */}
            <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e1e3e5' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button
                  variant="primary"
                  onClick={() => {
                    console.log('Generate button clicked!');
                    const modal = document.getElementById('blog-editor-modal');
                    if (modal) {
                      (modal as any).show();
                    }
                  }}
                >
                  ⭐ Generate
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Generated Titles Modal */}
        {generatedTitles.length > 0 && (
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
              borderRadius: '8px',
              padding: '24px',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}>
              {/* Modal Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                paddingBottom: '16px',
                borderBottom: '1px solid #e1e3e5'
              }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>Generated Blog Titles</h2>
                  <p style={{ margin: '8px 0 0 0', color: '#6d7175', fontSize: '14px' }}>AI-generated titles based on your brand voice and content</p>
                </div>
                <button className="polaris-button polaris-button--plain" onClick={() => setGeneratedTitles([])}>✕</button>
              </div>
              
              {/* Titles List */}
              <div style={{ marginBottom: '20px' }}>
                {generatedTitles.map((title, index) => (
                  <div key={index} style={{
                    padding: '16px',
                    border: '1px solid #e1e3e5',
                    borderRadius: '6px',
                    marginBottom: '12px',
                    backgroundColor: index === 0 ? '#f6f6f7' : 'white',
                    position: 'relative'
                  }}>
                    {/* Recommended Badge */}
                    {index === 0 && (
                      <div style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '16px',
                        backgroundColor: '#008060',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        Recommended
                      </div>
                    )}
                    
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: index === 0 ? '#008060' : '#6d7175',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: '600',
                        flexShrink: 0
                      }}>
                        {index + 1}
                      </div>
                      
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '16px',
                          fontWeight: '500',
                          marginBottom: '8px',
                          color: '#202223'
                        }}>
                          {title}
                        </div>
                        <div style={{
                          fontSize: '13px',
                          color: '#6d7175',
                          padding: '4px 8px',
                          backgroundColor: '#f6f6f7',
                          borderRadius: '4px',
                          display: 'inline-block'
                        }}>
                          {index === 0 && 'Educational / How-to'}
                          {index === 1 && 'Industry Insights / Trends'}
                          {index === 2 && 'Product-focused'}
                          {index === 3 && 'Customer Stories / Testimonials'}
                          {index === 4 && 'Opinion / Thought Leadership'}
                          {index === 5 && 'Behind-the-scenes / Company Culture'}
                          {index === 6 && 'Fun / Engaging / Light-hearted'}
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      marginTop: '16px',
                      justifyContent: 'flex-end'
                    }}>
                      <Button 
                        variant="secondary" 
                        size="slim"
                        onClick={() => {
                          handleContentDetailsChange('postTitle', title);
                          setGeneratedTitles([]);
                        }}
                      >
                        Use This Title
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Modal Footer */}
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
                paddingTop: '16px',
                borderTop: '1px solid #e1e3e5'
              }}>
                <button 
                  className="polaris-button polaris-button--secondary"
                  onClick={() => setGeneratedTitles([])}
                >
                  Close
                </button>
                <button 
                  className="polaris-button polaris-button--primary"
                  onClick={() => {
                    handleContentDetailsChange('postTitle', recommendedTitle);
                    setGeneratedTitles([]);
                  }}
                >
                  Use Recommended Title
                </button>
              </div>
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

        {/* Blog Editor Modal - Using Shopify ui-modal with max variant */}
        <ui-modal id="blog-editor-modal" variant="max" {...({} as any)}>
          {/* Title Bar */}
          <ui-title-bar title="Blog Editor">
            <Button variant="primary" onClick={handlePublishBlog}>
              Publish Blog
            </Button>
            <Button variant="secondary" onClick={() => setShowBlogEditor(false)}>
              Cancel
            </Button>
          </ui-title-bar>
          
          <div className="blog-editor-content">
            {/* Main Content */}
            <div className="blog-editor-main">
              {/* Left Sidebar - Post Settings */}
              <div className="blog-editor-sidebar">
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#202223' }}>Post</div>
                  
                  {/* Visibility */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>Visibility</div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <input type="radio" name="visibility" value="visible" />
                        <span style={{ fontSize: '13px' }}>Visible</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <input type="radio" name="visibility" value="hidden" defaultChecked />
                        <span style={{ fontSize: '13px' }}>Hidden</span>
                      </label>
                    </div>
                  </div>

                  {/* Featured Image */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>Featured Image</div>
                    <Button variant="secondary" size="slim">Generate with AI</Button>
                    <div style={{
                      width: '100%',
                      height: '200px',
                      border: '2px dashed #c9cccf',
                      borderRadius: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#f6f6f7',
                      marginBottom: '8px',
                      gap: '8px'
                    }}>
                      <Button 
                        variant="secondary" 
                        size="slim"
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/*';
                          input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (file) {
                              console.log('File selected:', file.name);
                              // TODO: Handle file upload
                            }
                          };
                          input.click();
                        }}
                      >
                        ↑ Upload file
                      </Button>
                      <Button 
                        variant="secondary" 
                        size="slim"
                        onClick={() => setShowImageLibraryModal(true)}
                      >
                        Select from library
                      </Button>
                    </div>
                    <TextField
                      label="or Insert image URL"
                      placeholder="Enter image URL"
                      autoComplete="off"
                    />
                  </div>

                  {/* Excerpt */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>Excerpt</div>
                    <Button variant="secondary" size="slim">Generate with AI</Button>
                    <textarea
                      placeholder="Enter excerpt..."
                      style={{
                        width: '100%',
                        height: '80px',
                        padding: '8px',
                        border: '1px solid #c9cccf',
                        borderRadius: '4px',
                        fontSize: '13px',
                        resize: 'none'
                      }}
                    />
                  </div>

                  {/* Organization */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>Organization</div>
                    <Select
                      label="Author"
                      labelInline
                      options={[{ label: 'Default', value: 'default' }]}
                      value="default"
                      onChange={() => {}}
                    />
                    <Select
                      label="Blog *"
                      labelInline
                      options={[{ label: 'News', value: 'news' }]}
                      value="news"
                      onChange={() => {}}
                    />
                  </div>

                  {/* Tags */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>Tags</div>
                    <Button variant="secondary" size="slim">Generate with AI</Button>
                    <TextField
                      label=""
                      placeholder="Enter tags..."
                      value="fashion trends, summer 2025, stylish t-shirts, sumi"
                      autoComplete="off"
                    />
                  </div>

                  {/* SEO Title */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>SEO title</div>
                    <Button variant="secondary" size="slim">Auto fill</Button>
                    <TextField
                      label=""
                      placeholder="Enter SEO title..."
                      value="Stay Cool in Style: Essential T-Shirt Trends for Surr"
                      autoComplete="off"
                    />
                    <div style={{ fontSize: '12px', color: '#008060', marginTop: '4px' }}>60 characters</div>
                  </div>

                  {/* SEO Description */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>SEO description</div>
                    <Button variant="secondary" size="slim">Generate with AI</Button>
                    <textarea
                      placeholder="Enter SEO description..."
                      value="Discover the essential T-shirt trends for Summer 2025 and learn how to stay cool in style with our fresh fashion insights."
                      style={{
                        width: '100%',
                        height: '80px',
                        padding: '8px',
                        border: '1px solid #c9cccf',
                        borderRadius: '4px',
                        fontSize: '13px',
                        resize: 'none'
                      }}
                    />
                    <div style={{ fontSize: '12px', color: '#008060', marginTop: '4px' }}>122 characters</div>
                  </div>

                  {/* URL and Handle */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>URL and handle</div>
                    <TextField
                      label=""
                      placeholder="Enter URL..."
                      value="/news/stay-cool-in-style-essential-t-shirt-trends"
                      autoComplete="off"
                      size="slim"
                    />
                  </div>
                </div>
              </div>

              {/* Right Section - Blog Post Preview */}
              <div className="blog-editor-main-content">
                {/* Rich Text Editor - Full Width & Floating */}
                <div style={{ 
                  width: '100%',
                  backgroundColor: 'white',
                  position: 'sticky',
                  top: '0',
                  zIndex: 10,
                  marginBottom: '24px'
                }}>
                  {/* Toolbar */}
                  <div style={{ 
                    padding: '0 40px',
                    backgroundColor: '#f6f6f7',
                    borderBottom: '1px solid #e1e3e5',
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    top: '0',
                    zIndex: 10
                  }}>
                    {/* Text Style Dropdown - H2, H3, H4, H5, Paragraph */}
                    <button 
                      onClick={() => setShowTitleDropdown(!showTitleDropdown)}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        gap: '4px',
                        padding: '8px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        cursor: 'pointer'
                      }}
                    >
                      <img src="/TextTitleIcon.svg" alt="Title" style={{ width: '16px', height: '16px' }} />
                      <span style={{ fontSize: '12px' }}>⌄</span>
                    </button>
                    
                    {/* Title Dropdown */}
                    {showTitleDropdown && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: '0',
                        backgroundColor: 'white',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        zIndex: 1000,
                        minWidth: '150px',
                        marginTop: '4px'
                      }}>
                        <div style={{ padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid #eee' }} onClick={() => applyHeading('h1')}>Heading 1</div>
                        <div style={{ padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid #eee' }} onClick={() => applyHeading('h2')}>Heading 2</div>
                        <div style={{ padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid #eee' }} onClick={() => applyHeading('h5')}>Heading 5</div>
                        <div style={{ padding: '8px 12px', cursor: 'pointer' }} onClick={() => applyHeading('p')}>Paragraph</div>
                      </div>
                    )}

                    {/* Bold */}
                    <button 
                      onClick={applyBold}
                      style={{
                        padding: '8px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        cursor: 'pointer',
                        fontSize: '16px',
                        color: 'black'
                      }}
                    >
                      <img src="/TextBoldIcon.svg" alt="Bold" style={{ width: '16px', height: '16px' }} />
                    </button>

                    {/* Italic */}
                    <button 
                      onClick={applyItalic}
                      style={{
                        padding: '8px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        cursor: 'pointer',
                        fontSize: '16px',
                        color: 'black'
                      }}
                    >
                      <img src="/TextItalicIcon.svg" alt="Italic" style={{ width: '16px', height: '16px' }} />
                    </button>

                    {/* Underline */}
                    <button 
                      onClick={applyUnderline}
                      style={{
                        padding: '8px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        cursor: 'pointer',
                        fontSize: '16px',
                        color: 'black'
                      }}
                    >
                      <img src="/TextUnderlineIcon.svg" alt="Underline" style={{ width: '16px', height: '16px' }} />
                    </button>

                    {/* Bullet List */}
                    <button 
                      onClick={applyList}
                      style={{
                        padding: '8px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        cursor: 'pointer',
                        fontSize: '16px',
                        color: 'black'
                      }}
                    >
                      <img src="/ListBulletedIcon.svg" alt="List" style={{ width: '16px', height: '16px' }} />
                    </button>

                    {/* Text Color */}
                    <button 
                      onClick={() => setShowColorPicker(!showColorPicker)}
                      style={{
                        padding: '8px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        cursor: 'pointer',
                        fontSize: '16px',
                        color: 'black'
                      }}
                    >
                      <img src="/TextColorIcon.svg" alt="Color" style={{ width: '16px', height: '16px' }} />
                    </button>

                    {/* Link */}
                    <button 
                      onClick={() => {
                        const selection = window.getSelection();
                        if (selection && selection.rangeCount > 0) {
                          const range = selection.getRangeAt(0);
                          if (!range.collapsed) {
                            // Text được select - hiện input
                            setShowLinkInput(true);
                            setLinkUrl('');
                          }
                        }
                      }}
                      style={{
                        padding: '8px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        cursor: 'pointer',
                        fontSize: '16px',
                        color: 'black'
                      }}
                    >
                      <img src="/LinkIcon.svg" alt="Link" style={{ width: '16px', height: '16px' }} />
                    </button>

                    {/* Image */}
                    <button 
                      onClick={() => setShowImageModal(!showImageModal)}
                      style={{
                        padding: '8px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        cursor: 'pointer',
                        fontSize: '16px',
                        color: 'black'
                      }}
                    >
                      <img src="/ImageIcon.svg" alt="Image" style={{ width: '16px', height: '16px' }} />
                    </button>
                  </div>
                  
                  {/* Content Area - Centered with Max Width and Left Aligned Text */}
                  <div style={{ 
                    padding: '40px',
                    maxWidth: '980px',
                    margin: '0 auto',
                    textAlign: 'left'
                  }}>
                    {/* Title */}
                    <h1 style={{
                      fontSize: '32px',
                      fontWeight: '700',
                      marginBottom: '24px',
                      lineHeight: '1.2',
                      color: '#202223'
                    }}>
                      Stay Cool in Style: Must-Have T-Shirt Trends for Summer 2025
                    </h1>

                    {/* Media Section */}
                    <div style={{
                      width: '980px',
                      height: '200px',
                      border: '2px dashed #c9cccf',
                      borderRadius: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#f6f6f7',
                      marginBottom: '24px'
                    }}>
                      <div style={{ marginBottom: '8px' }}>
                        <Button variant="secondary" size="slim">↑ Upload file</Button>
                      </div>
                      <div style={{ marginBottom: '8px' }}>
                        <Button variant="secondary" size="slim">Select from library</Button>
                      </div>
                      <Button variant="secondary" size="slim">Generate with AI</Button>
                    </div>

                    {/* Blog Content Editor */}
                    <div 
                      contentEditable
                      style={{ 
                        fontSize: '16px', 
                        lineHeight: '1.6', 
                        color: '#202223',
                        minHeight: '200px',
                        border: '1px solid #e1e3e5',
                        borderRadius: '8px',
                        padding: '16px',
                        outline: 'none',
                        position: 'relative'
                      }}
                      onInput={(e) => {
                        // Handle content changes
                      }}
                    >
                      <p style={{ marginBottom: '20px' }}>
                        The sweltering heat of summer 2025 is on the horizon, and fashion enthusiasts are already contemplating their seasonal wardrobe refreshes. As temperatures rise, the humble t-shirt emerges as the quintessential sartorial staple—versatile, comfortable, and increasingly fashion-forward. This season's t-shirt trends reflect a fascinating amalgamation of nostalgic elements, technological advancements, and sustainable practices that cater to the discerning modern consumer. Whether you're lounging poolside, attending outdoor social gatherings, or navigating urban landscapes, these trending styles will ensure you remain simultaneously cool and stylish throughout the estival months.
                      </p>

                      <h2 style={{
                        fontSize: '24px',
                        fontWeight: '600',
                        marginBottom: '16px',
                        marginTop: '32px'
                      }}>
                        The Evolution of Summer T-Shirts: From Basic to Trendsetting
                      </h2>

                      <p style={{ marginBottom: '20px' }}>
                        The t-shirt's trajectory from utilitarian undergarment to fashion statement piece represents one of the most remarkable metamorphoses in sartorial history. Initially conceptualized as a practical solution for military personnel in the early 20th century, the t-shirt has transcended its humble origins to become a canvas for self-expression and an indicator of contemporary aesthetic sensibilities.
                      </p>

                      <p style={{ marginBottom: '20px' }}>
                        For Summer 2025, designers have reimagined this wardrobe fundamental through innovative silhouettes, avant-garde textile technologies, and a renewed emphasis on sustainability. The resultant iterations represent a harmonious synthesis of comfort and high fashion, challenging the previously entrenched dichotomy between the two concepts.
                      </p>

                      <h3 style={{
                        fontSize: '20px',
                        fontWeight: '600',
                        marginBottom: '12px',
                        marginTop: '24px',
                        marginLeft: '20px'
                      }}>
                        Historical Context of T-Shirts in Summer Fashion
                      </h3>

                      <p style={{ marginBottom: '20px', marginLeft: '20px' }}>
                        The t-shirt's association with summer dates back to mid-20th century America, when celebrities like Marlon Brando and James Dean popularized the garment as outerwear, challenging societal norms and establishing it as a symbol of youthful rebellion. The subsequent decades witnessed the t-shirt's increasing ubiquity across demographic and socioeconomic boundaries, with each era introducing distinctive stylistic variations.
                      </p>

                      <p style={{ marginBottom: '20px', marginLeft: '20px' }}>
                        The 1960s and 1970s saw the emergence of tie-dye and graphic prints as vehicles for countercultural messaging, while the 1980s embraced oversized silhouettes and bold logo placements. The minimalist aesthetic of the 1990s temporarily relegated the t-shirt to basic status, before the early 2000s reintroduced embellishments and slogan designs.
                      </p>

                      <blockquote style={{
                        borderLeft: '4px solid #008060',
                        paddingLeft: '20px',
                        margin: '32px 0',
                        fontStyle: 'italic',
                        fontSize: '18px',
                        color: '#6d7175',
                        marginLeft: '20px'
                      }}>
                        "The t-shirt has consistently functioned as a barometer for cultural shifts and aesthetic preferences, with its evolution reflecting broader societal transformations in attitudes toward leisure, self-expression, and the democratization of fashion."
                        <div style={{ marginTop: '12px', fontSize: '14px', color: '#8c9196' }}>
                          — Dr. Eliza Montgomery, Fashion Historian at the Institute of Contemporary Style
                        </div>
                      </blockquote>

                      <p style={{ marginBottom: '20px', marginLeft: '20px' }}>
                        Summer 2025's t-shirt trends represent the culmination of this rich historical lineage, synthesizing elements from various decades while introducing cutting-edge innovations in sustainability, technology, and design philosophy.
                      </p>
                      
                      {/* Link Input Overlay */}
                      {showLinkInput && (
                        <div style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          backgroundColor: 'white',
                          border: '1px solid #ccc',
                          borderRadius: '8px',
                          padding: '16px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          zIndex: 1000,
                          minWidth: '300px'
                        }}>
                          <div style={{ marginBottom: '12px', fontWeight: '500' }}>Insert Link</div>
                          <input
                            type="text"
                            placeholder="Enter URL..."
                            value={linkUrl}
                            onChange={(e) => setLinkUrl(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              border: '1px solid #ccc',
                              borderRadius: '4px',
                              marginBottom: '12px'
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                // Tạo link
                                createLink(linkUrl);
                              }
                            }}
                          />
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button 
                              onClick={() => setShowLinkInput(false)}
                              style={{
                                padding: '6px 12px',
                                border: '1px solid #ccc',
                                backgroundColor: 'white',
                                borderRadius: '4px',
                                cursor: 'pointer'
                              }}
                            >
                              Cancel
                            </button>
                            <button 
                              onClick={() => createLink(linkUrl)}
                              style={{
                                padding: '6px 12px',
                                border: 'none',
                                backgroundColor: '#008060',
                                color: 'white',
                                borderRadius: '4px',
                                cursor: 'pointer'
                              }}
                            >
                              Insert
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {/* Color Picker Overlay */}
                      {showColorPicker && (
                        <div style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          backgroundColor: 'white',
                          border: '1px solid #ccc',
                          borderRadius: '8px',
                          padding: '16px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          zIndex: 1000,
                          minWidth: '250px'
                        }}>
                          <div style={{ marginBottom: '12px', fontWeight: '500' }}>Text Color</div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px', marginBottom: '16px' }}>
                            {['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#008000', '#FFC0CB', '#A52A2A'].map((color) => (
                              <button
                                key={color}
                                onClick={() => applyTextColor(color)}
                                style={{
                                  width: '32px',
                                  height: '32px',
                                  backgroundColor: color,
                                  border: '1px solid #ccc',
                                  borderRadius: '4px',
                                  cursor: 'pointer'
                                }}
                                title={color}
                              />
                            ))}
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button 
                              onClick={() => setShowColorPicker(false)}
                              style={{
                                padding: '6px 12px',
                                border: '1px solid #ccc',
                                backgroundColor: 'white',
                                borderRadius: '4px',
                                cursor: 'pointer'
                              }}
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {/* Image Modal Overlay */}
                      {showImageModal && (
                        <div style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          backgroundColor: 'white',
                          border: '1px solid #ccc',
                          borderRadius: '8px',
                          padding: '16px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          zIndex: 1000,
                          minWidth: '350px'
                        }}>
                          <div style={{ marginBottom: '16px', fontWeight: '500' }}>Insert Image</div>
                          
                          {/* Image URL Input */}
                          <div style={{ marginBottom: '16px' }}>
                            <div style={{ marginBottom: '8px', fontSize: '14px' }}>Image URL:</div>
                            <input
                              type="text"
                              placeholder="https://example.com/image.jpg"
                              style={{
                                width: '100%',
                                padding: '8px 12px',
                                border: '1px solid #ccc',
                                borderRadius: '4px'
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && (e.target as HTMLInputElement).value) {
                                  insertImage((e.target as HTMLInputElement).value);
                                }
                              }}
                            />
                          </div>
                          
                          {/* Upload Buttons */}
                          <div style={{ marginBottom: '16px' }}>
                            <div style={{ marginBottom: '8px', fontSize: '14px' }}>Or upload:</div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button style={{
                                padding: '8px 12px',
                                border: '1px solid #ccc',
                                backgroundColor: 'white',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '14px'
                              }}>
                                📁 Choose File
                              </button>
                              <button style={{
                                padding: '8px 12px',
                                border: '1px solid #ccc',
                                backgroundColor: 'white',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '14px'
                              }}>
                                🖼️ From Library
                              </button>
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button 
                              onClick={() => setShowImageModal(false)}
                              style={{
                                padding: '6px 12px',
                                border: '1px solid #ccc',
                                backgroundColor: 'white',
                                borderRadius: '4px',
                                cursor: 'pointer'
                              }}
                            >
                              Cancel
                            </button>
                            <button 
                              onClick={() => {
                                const urlInput = document.querySelector('input[placeholder="https://example.com/image.jpg"]') as HTMLInputElement;
                                if (urlInput && urlInput.value) {
                                  insertImage(urlInput.value);
                                }
                              }}
                              style={{
                                padding: '6px 12px',
                                border: 'none',
                                backgroundColor: '#008060',
                                color: 'white',
                                borderRadius: '4px',
                                cursor: 'pointer'
                              }}
                            >
                              Insert
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>


              </div>
            </div>
          </div>
          
          {/* Save Bar - Show when there are unsaved changes */}
          {hasUnsavedChanges && (
            <ui-save-bar id="blog-editor-save-bar">
              <button onClick={handleSaveChanges}>Save changes</button>
              <button onClick={handleCancelChanges}>Cancel</button>
            </ui-save-bar>
          )}
          
          {/* Modal Title Bar - Removed duplicate, using main title bar instead */}
        </ui-modal>

        {/* Image Library Modal */}
        {showImageLibraryModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 2000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '24px',
              maxWidth: '800px',
              width: '90%',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}>
              {/* Modal Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                paddingBottom: '16px',
                borderBottom: '1px solid #e1e3e5'
              }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>Select Image from Library</h2>
                  <p style={{ margin: '8px 0 0 0', color: '#6d7175', fontSize: '14px' }}>Choose an image from your store's media library</p>
                </div>
                <button 
                  onClick={() => setShowImageLibraryModal(false)}
                  style={{
                    padding: '8px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    fontSize: '18px'
                  }}
                >
                  ✕
                </button>
              </div>
              
              {/* Image Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: '16px',
                marginBottom: '20px'
              }}>
                {/* Mock Images - Replace with actual store images */}
                {[1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12].map((num) => (
                  <div
                    key={num}
                    onClick={() => {
                      console.log('Image selected:', num);
                      setShowImageLibraryModal(false);
                      // TODO: Set selected image
                    }}
                    style={{
                      width: '150px',
                      height: '150px',
                      backgroundColor: '#f6f6f7',
                      border: '2px solid #e1e3e5',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      fontSize: '24px',
                      color: '#6d7175',
                      transition: 'border-color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#008060';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e1e3e5';
                    }}
                  >
                    🖼️ {num}
                  </div>
                ))}
              </div>
              
              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <Button variant="secondary" onClick={() => setShowImageLibraryModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={() => setShowImageLibraryModal(false)}>
                  Select Image
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


