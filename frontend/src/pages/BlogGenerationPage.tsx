import React, { useState } from 'react';
import { aiService, AIGenerationRequest } from '../services/aiService';

interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
  price: string;
}

interface BlogPost {
  title: string;
  content: string;
  seoTitle: string;
  metaDescription: string;
  keywords: string[];
}

const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Organic Cotton T-Shirt',
    description: 'Comfortable and sustainable cotton t-shirt made from 100% organic materials. Perfect for everyday wear with a soft, breathable fabric that feels great against your skin.',
    image: 'https://via.placeholder.com/150',
    price: '$29.99'
  },
  {
    id: '2',
    title: 'Handmade Ceramic Mug',
    description: 'Beautiful handcrafted ceramic coffee mug with unique designs. Each piece is individually made by skilled artisans, ensuring no two mugs are exactly alike.',
    image: 'https://via.placeholder.com/150',
    price: '$19.99'
  },
  {
    id: '3',
    title: 'Bamboo Cutting Board',
    description: 'Eco-friendly bamboo cutting board perfect for all your kitchen needs. Sustainable, durable, and naturally antibacterial - a must-have for any home chef.',
    image: 'https://via.placeholder.com/150',
    price: '$34.99'
  }
];

export default function BlogGenerationPage() {
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [blogType, setBlogType] = useState<string>('product-review');
  const [tone, setTone] = useState<string>('professional');
  const [targetAudience, setTargetAudience] = useState<string>('general');
  const [maxLength, setMaxLength] = useState<number>(1000);
  const [language, setLanguage] = useState<string>('en');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBlog, setGeneratedBlog] = useState<BlogPost | null>(null);
  const [error, setError] = useState<string>('');

  const blogTypes = [
    { value: 'product-review', label: 'Product Review' },
    { value: 'how-to-guide', label: 'How-to Guide' },
    { value: 'lifestyle-post', label: 'Lifestyle Post' }
  ];

  const tones = [
    { value: 'professional', label: 'Professional' },
    { value: 'casual', label: 'Casual' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'formal', label: 'Formal' },
    { value: 'creative', label: 'Creative' },
    { value: 'technical', label: 'Technical' }
  ];

  const audiences = [
    { value: 'general', label: 'General Audience' },
    { value: 'professionals', label: 'Professionals' },
    { value: 'beginners', label: 'Beginners' },
    { value: 'experts', label: 'Experts' }
  ];

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' }
  ];

  const handleGenerateBlog = async () => {
    if (!selectedProduct) {
      setError('Please select a product first');
      return;
    }

    setError('');
    setIsGenerating(true);
    
    try {
      const product = mockProducts.find(p => p.id === selectedProduct);
      if (!product) {
        throw new Error('Product not found');
      }

      const request: AIGenerationRequest = {
        productId: selectedProduct,
        productTitle: product.title,
        productDescription: product.description,
        blogType,
        tone,
        targetAudience,
        maxLength,
        language
      };

      const result = await aiService.generateBlogPost(request);
      // Transform the response to match BlogPost interface
      const blogPost: BlogPost = {
        title: result.content.split('\n')[0].replace('# ', '') || 'Generated Blog Post',
        content: result.content || '',
        seoTitle: result.seoTitle || '',
        metaDescription: result.metaDescription || '',
        keywords: result.keywords || []
      };
      setGeneratedBlog(blogPost);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate blog post');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveBlog = () => {
    if (generatedBlog) {
      console.log('Saving blog post:', generatedBlog);
      // TODO: Implement save to Shopify
      alert('Blog post saved successfully!');
    }
  };

  const handleEditContent = () => {
    // TODO: Implement content editor
    alert('Content editor coming soon!');
  };

  const selectedProductData = mockProducts.find(p => p.id === selectedProduct);

  return (
    <div className="blog-generation-container">
      {/* Header */}
      <div className="page-header">
        <ui-title-bar title="AI Blog Generation">
        </ui-title-bar>
        <div className="header-actions">
          <ui-button variant="primary" onClick={handleGenerateBlog} disabled={isGenerating}>
            {isGenerating ? 'Generating...' : 'Generate Blog'}
          </ui-button>
        </div>
      </div>

      <ui-layout>
        {/* Configuration Section */}
        <ui-layout-section>
          <ui-card>
            <ui-text variant="headingLg" as="h2">Blog Generation Settings</ui-text>
            <ui-text variant="bodyMd" as="p">Configure your AI blog generation preferences</ui-text>
            
            {error && (
              <div className="error-message">
                <ui-text variant="bodyMd" as="p" className="error-text">
                  <strong>Error:</strong> {error}
                </ui-text>
              </div>
            )}
            
            <div className="configuration-form">
              {/* Product Selection */}
              <div className="form-field">
                <ui-text variant="bodyMd" as="label">Select Product</ui-text>
                <ui-select
                  value={selectedProduct}
                  onChange={(e: any) => setSelectedProduct(e.target.value)}
                  options={mockProducts.map(product => ({
                    label: `${product.title} - ${product.price}`,
                    value: product.id
                  }))}
                />
              </div>
              
              {selectedProductData && (
                <div className="selected-product">
                  <ui-text variant="headingMd" as="h4">Selected Product: {selectedProductData.title}</ui-text>
                  <ui-text variant="bodyMd" as="p">{selectedProductData.description}</ui-text>
                </div>
              )}
              
              {/* Blog Type */}
              <div className="form-field">
                <ui-text variant="bodyMd" as="label">Blog Type</ui-text>
                <ui-select
                  value={blogType}
                  onChange={(e: any) => setBlogType(e.target.value)}
                  options={blogTypes}
                />
              </div>
              
              {/* Tone */}
              <div className="form-field">
                <ui-text variant="bodyMd" as="label">Writing Tone</ui-text>
                <ui-select
                  value={tone}
                  onChange={(e: any) => setTone(e.target.value)}
                  options={tones}
                />
              </div>
              
              {/* Target Audience */}
              <div className="form-field">
                <ui-text variant="bodyMd" as="label">Target Audience</ui-text>
                <ui-select
                  value={targetAudience}
                  onChange={(e: any) => setTargetAudience(e.target.value)}
                  options={audiences}
                />
              </div>
              
              {/* Language */}
              <div className="form-field">
                <ui-text variant="bodyMd" as="label">Language</ui-text>
                <ui-select
                  value={language}
                  onChange={(e: any) => setLanguage(e.target.value)}
                  options={languages}
                />
              </div>
              
              {/* Max Length */}
              <div className="form-field">
                <ui-text variant="bodyMd" as="label">Maximum Content Length</ui-text>
                <ui-text-field
                  value={maxLength.toString()}
                  onChange={(e: any) => setMaxLength(parseInt(e.target.value) || 1000)}
                  placeholder="Maximum number of words for generated content"
                  type="number"
                />
                <ui-text variant="bodySm" as="p" className="help-text">
                  Maximum number of words for generated content
                </ui-text>
              </div>
            </div>
          </ui-card>
        </ui-layout-section>
        
        {/* Generated Content */}
        {generatedBlog && (
          <ui-layout-section>
            <ui-card>
              <ui-text variant="headingLg" as="h2">Generated Blog Post</ui-text>
              
              <div className="action-buttons">
                <ui-button variant="primary" onClick={handleSaveBlog}>
                  Save to Shopify
                </ui-button>
                <ui-button variant="secondary" onClick={handleEditContent}>
                  Edit Content
                </ui-button>
              </div>
              
              {/* SEO Section */}
              <div className="seo-section">
                <ui-text variant="headingMd" as="h3">SEO Settings</ui-text>
                
                <div className="form-field">
                  <ui-text variant="bodyMd" as="label">SEO Title</ui-text>
                  <ui-text-field
                    value={generatedBlog.seoTitle}
                    onChange={() => {}}
                    placeholder="SEO optimized title"
                  />
                </div>
                
                <div className="form-field">
                  <ui-text variant="bodyMd" as="label">Meta Description</ui-text>
                  <ui-text-field
                    value={generatedBlog.metaDescription}
                    onChange={() => {}}
                    placeholder="Meta description for search engines"
                  />
                </div>
                
                <div className="form-field">
                  <ui-text variant="bodyMd" as="label">Keywords</ui-text>
                  <ui-text-field
                    value={generatedBlog.keywords.join(', ')}
                    onChange={() => {}}
                    placeholder="Comma-separated keywords"
                  />
                </div>
              </div>
              
              {/* Blog Content */}
              <div className="content-section">
                <ui-text variant="headingMd" as="h3">Blog Content</ui-text>
                
                <div className="blog-content">
                  <div className="content-text">
                    {generatedBlog.content}
                  </div>
                </div>
              </div>
            </ui-card>
          </ui-layout-section>
        )}
        
        {/* Loading State */}
        {isGenerating && (
          <ui-layout-section>
            <ui-card>
              <div className="loading-state">
                <ui-text variant="headingLg" as="h2">Generating Your Blog Post...</ui-text>
                <ui-text variant="bodyMd" as="p">AI is working on creating engaging content for you</ui-text>
                <div className="spinner"></div>
                <ui-text variant="bodySm" as="p" className="loading-note">
                  This may take a few moments...
                </ui-text>
              </div>
            </ui-card>
          </ui-layout-section>
        )}
      </ui-layout>

      <style>{`
        .blog-generation-container {
          padding: 0;
          background-color: #f6f6f7;
          min-height: 100vh;
        }

        .page-header {
          background: white;
          border-bottom: 1px solid #e1e3e5;
          margin-bottom: 24px;
        }

        .header-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 16px;
        }

        .configuration-form {
          margin-top: 24px;
        }

        .form-field {
          margin-bottom: 24px;
        }

        .form-field label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #202223;
        }

        .help-text {
          margin-top: 4px;
          color: #6d7175;
        }

        .selected-product {
          background-color: #f6f6f7;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 24px;
          border: 1px solid #e1e3e5;
        }

        .selected-product h4 {
          margin: 0 0 8px 0;
          color: #202223;
        }

        .selected-product p {
          margin: 0;
          color: #6d7175;
          font-size: 14px;
        }

        .error-message {
          margin: 16px 0;
          padding: 12px 16px;
          background-color: #fef7f7;
          border: 1px solid #f4b5b5;
          border-radius: 6px;
        }

        .error-text {
          color: #d82c0d;
          margin: 0;
        }

        .action-buttons {
          margin: 24px 0;
          display: flex;
          gap: 16px;
        }

        .seo-section {
          background-color: #f6f6f7;
          padding: 24px;
          border-radius: 8px;
          margin: 24px 0;
          border: 1px solid #e1e3e5;
        }

        .seo-section h3 {
          margin: 0 0 16px 0;
          color: #202223;
        }

        .content-section {
          margin-top: 24px;
        }

        .content-section h3 {
          margin-bottom: 16px;
          color: #202223;
        }

        .blog-content {
          background-color: white;
          border: 1px solid #e1e3e5;
          border-radius: 8px;
          padding: 24px;
          max-height: 400px;
          overflow-y: auto;
        }

        .content-text {
          white-space: pre-line;
          line-height: 1.6;
          color: #202223;
        }

        .loading-state {
          text-align: center;
          padding: 48px 24px;
        }

        .loading-state h2 {
          margin-bottom: 16px;
          color: #202223;
        }

        .loading-state p {
          margin-bottom: 24px;
          color: #6d7175;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #008060;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 24px auto;
        }

        .loading-note {
          color: #6d7175;
          font-size: 14px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .action-buttons {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
    </div>
  );
}
