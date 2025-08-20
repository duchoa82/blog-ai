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

      const response = await aiService.generateBlogPost(request);
      
      if (response.success) {
        const blog: BlogPost = {
          title: response.content.split('\n')[0].replace('# ', ''),
          content: response.content,
          seoTitle: response.seoTitle,
          metaDescription: response.metaDescription,
          keywords: response.keywords
        };
        
        setGeneratedBlog(blog);
      } else {
        setError(response.error || 'Failed to generate blog post');
      }
    } catch (error) {
      console.error('Blog generation failed:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
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
    <div>
      <ui-title-bar title="AI Blog Generation">
        <button variant="primary" onClick={handleGenerateBlog} disabled={isGenerating}>
          {isGenerating ? 'Generating...' : 'Generate Blog'}
        </button>
      </ui-title-bar>
      
      <ui-layout>
        {/* Configuration Section */}
        <ui-layout-section>
          <ui-card>
            <ui-text variant="heading" as="h1">Blog Generation Settings</ui-text>
            <p>Configure your AI blog generation preferences</p>
            
            {error && (
              <div style={{
                padding: '1rem',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                marginBottom: '1rem',
                color: '#dc2626'
              }}>
                <strong>Error:</strong> {error}
              </div>
            )}
            
            <ui-form-layout>
              {/* Product Selection */}
              <ui-select
                label="Select Product"
                value={selectedProduct}
                onChange={(value) => setSelectedProduct(value)}
                options={mockProducts.map(product => ({
                  label: `${product.title} - ${product.price}`,
                  value: product.id
                }))}
                placeholder="Choose a product to write about"
              />
              
              {selectedProductData && (
                <div style={{
                  padding: '1rem',
                  backgroundColor: '#f6f6f7',
                  borderRadius: '8px',
                  marginBottom: '1rem'
                }}>
                  <ui-text variant="heading" as="h4" style={{ marginBottom: '0.5rem' }}>
                    Selected Product: {selectedProductData.title}
                  </ui-text>
                  <p style={{ fontSize: '14px', color: '#6d7175' }}>
                    {selectedProductData.description}
                  </p>
                </div>
              )}
              
              {/* Blog Type */}
              <ui-select
                label="Blog Type"
                value={blogType}
                onChange={(value) => setBlogType(value)}
                options={blogTypes}
              />
              
              {/* Tone */}
              <ui-select
                label="Writing Tone"
                value={tone}
                onChange={(value) => setTone(value)}
                options={tones}
              />
              
              {/* Target Audience */}
              <ui-select
                label="Target Audience"
                value={targetAudience}
                onChange={(value) => setTargetAudience(value)}
                options={audiences}
              />
              
              {/* Language */}
              <ui-select
                label="Language"
                value={language}
                onChange={(value) => setLanguage(value)}
                options={languages}
              />
              
              {/* Max Length */}
              <ui-text-field
                label="Maximum Content Length"
                type="number"
                value={maxLength.toString()}
                onChange={(value) => setMaxLength(parseInt(value) || 1000)}
                help-text="Maximum number of words for generated content"
              />
            </ui-form-layout>
          </ui-card>
        </ui-layout-section>
        
        {/* Generated Content */}
        {generatedBlog && (
          <ui-layout-section>
            <ui-card>
              <ui-text variant="heading" as="h2">Generated Blog Post</ui-text>
              
              <div style={{ marginBottom: '2rem' }}>
                <ui-button variant="primary" onClick={handleSaveBlog}>
                  Save to Shopify
                </ui-button>
                <ui-button onClick={handleEditContent} style={{ marginLeft: '1rem' }}>
                  Edit Content
                </ui-button>
              </div>
              
              {/* SEO Section */}
              <div style={{ 
                background: '#f6f6f7', 
                padding: '1rem', 
                borderRadius: '8px',
                marginBottom: '2rem'
              }}>
                <ui-text variant="heading" as="h3">SEO Settings</ui-text>
                
                <ui-text-field
                  label="SEO Title"
                  value={generatedBlog.seoTitle}
                  onChange={() => {}}
                />
                
                <ui-text-field
                  label="Meta Description"
                  value={generatedBlog.metaDescription}
                  onChange={() => {}}
                />
                
                <ui-text-field
                  label="Keywords"
                  value={generatedBlog.keywords.join(', ')}
                  onChange={() => {}}
                />
              </div>
              
              {/* Blog Content */}
              <div>
                <ui-text variant="heading" as="h3">Blog Content</ui-text>
                
                <div style={{ 
                  background: 'white', 
                  border: '1px solid #e1e3e5',
                  borderRadius: '8px',
                  padding: '1rem',
                  marginTop: '1rem',
                  maxHeight: '400px',
                  overflowY: 'auto'
                }}>
                  <div style={{ whiteSpace: 'pre-line' }}>
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
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <ui-text variant="heading">Generating Your Blog Post...</ui-text>
                <p>AI is working on creating engaging content for you</p>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  border: '4px solid #f3f3f3',
                  borderTop: '4px solid #008060',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '1rem auto'
                }}></div>
                <p style={{ fontSize: '14px', color: '#6d7175' }}>
                  This may take a few moments...
                </p>
              </div>
            </ui-card>
          </ui-layout-section>
        )}
      </ui-layout>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
