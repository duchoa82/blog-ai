interface AIGenerationRequest {
  productId: string;
  productTitle: string;
  productDescription: string;
  blogType: string;
  tone: string;
  targetAudience: string;
  maxLength: number;
  language: string;
}

interface AIGenerationResponse {
  success: boolean;
  content: string;
  seoTitle: string;
  metaDescription: string;
  keywords: string[];
  error?: string;
}

class AIService {
  private apiKey: string = '';
  private provider: string = 'openai';
  private baseUrl: string = '';

  constructor() {
    this.loadConfiguration();
  }

  private loadConfiguration() {
    // Load from localStorage or environment
    this.apiKey = localStorage.getItem('ai_api_key') || '';
    this.provider = localStorage.getItem('ai_provider') || 'openai';
    this.baseUrl = localStorage.getItem('ai_base_url') || '';
  }

  private saveConfiguration() {
    localStorage.setItem('ai_api_key', this.apiKey);
    localStorage.setItem('ai_provider', this.provider);
    localStorage.setItem('ai_base_url', this.baseUrl);
  }

  setConfiguration(config: { apiKey: string; provider: string; baseUrl?: string }) {
    this.apiKey = config.apiKey;
    this.provider = config.provider;
    this.baseUrl = config.baseUrl || '';
    this.saveConfiguration();
  }

  async generateBlogPost(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    try {
      if (!this.apiKey) {
        throw new Error('API key not configured');
      }

      // Simulate AI generation for now
      // In production, this would call the actual AI service
      const response = await this.simulateAIGeneration(request);
      
      return response;
    } catch (error) {
      console.error('AI generation failed:', error);
      return {
        success: false,
        content: '',
        seoTitle: '',
        metaDescription: '',
        keywords: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async simulateAIGeneration(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));

    // Generate mock content based on request
    const blogTypes = {
      'product-review': {
        template: `# Amazing ${request.productTitle} - Complete Review

Are you looking for the perfect ${request.productTitle.toLowerCase()}? Look no further! This comprehensive review covers everything you need to know about this incredible product.

## What is ${request.productTitle}?

${request.productDescription}

## Key Features

- **High Quality**: Made with premium materials
- **Durable**: Built to last for years
- **Versatile**: Perfect for multiple use cases
- **Affordable**: Great value for money

## Why Choose ${request.productTitle}?

This product stands out from the competition for several reasons:

1. **Superior Quality**: Every detail has been carefully considered
2. **Customer Satisfaction**: Thousands of happy customers
3. **Warranty**: Full warranty coverage included
4. **Support**: Excellent customer service

## Final Verdict

The ${request.productTitle} is an excellent choice for anyone looking for quality and reliability. Highly recommended!`
      },
      'how-to-guide': {
        template: `# How to Use ${request.productTitle} - Complete Guide

Learn everything you need to know about using your new ${request.productTitle} effectively.

## Getting Started

${request.productDescription}

## Step-by-Step Instructions

### Step 1: Unboxing
Carefully remove your ${request.productTitle} from its packaging.

### Step 2: Initial Setup
Follow the included instructions for initial setup.

### Step 3: First Use
Begin using your ${request.productTitle} according to the guidelines.

## Tips and Tricks

- **Maintenance**: Regular cleaning ensures longevity
- **Storage**: Store in a cool, dry place
- **Usage**: Follow recommended usage patterns

## Troubleshooting

Common issues and solutions for ${request.productTitle} users.`
      },
      'lifestyle-post': {
        template: `# ${request.productTitle} - Lifestyle Enhancement

Discover how ${request.productTitle} can transform your daily routine and improve your lifestyle.

## Lifestyle Benefits

${request.productDescription}

## Daily Integration

Learn how to seamlessly integrate ${request.productTitle} into your lifestyle:

- **Morning Routine**: Start your day right
- **Work Life**: Enhance productivity
- **Evening Relaxation**: Unwind with style
- **Weekend Activities**: Make the most of free time

## Real Stories

Hear from real users about how ${request.productTitle} changed their lives.

## Making It Your Own

Personalize your ${request.productTitle} experience for maximum benefit.`
      }
    };

    const template = blogTypes[request.blogType as keyof typeof blogTypes] || blogTypes['product-review'];
    const content = template.template;

    // Generate SEO elements
    const seoTitle = `Best ${request.productTitle} ${request.blogType === 'product-review' ? 'Review' : 'Guide'} 2024 - Complete ${request.blogType === 'product-review' ? 'Review' : 'Guide'}`;
    const metaDescription = `Discover everything about the ${request.productTitle}. Read our comprehensive ${request.blogType}, pros and cons, and find the best deals.`;
    const keywords = ['review', 'guide', 'best', '2024', 'comparison', request.productTitle.toLowerCase()];

    return {
      success: true,
      content,
      seoTitle,
      metaDescription,
      keywords
    };
  }

  async validateAPIKey(apiKey: string, provider: string): Promise<boolean> {
    try {
      // Simulate API key validation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation - in production, this would make a real API call
      return apiKey.length > 10 && provider in ['openai', 'claude', 'gemini', 'custom'];
    } catch (error) {
      console.error('API key validation failed:', error);
      return false;
    }
  }

  getSupportedProviders() {
    return [
      { value: 'openai', label: 'OpenAI GPT-4', description: 'High-quality content generation' },
      { value: 'claude', label: 'Anthropic Claude', description: 'Safe and helpful AI' },
      { value: 'gemini', label: 'Google Gemini', description: 'Fast and efficient' },
      { value: 'custom', label: 'Custom API', description: 'Your own AI service' }
    ];
  }

  getUsageStats() {
    // Mock usage statistics
    return {
      totalGenerations: 156,
      thisMonth: 24,
      apiCallsRemaining: 876,
      plan: 'Pro'
    };
  }
}

// Export singleton instance
export const aiService = new AIService();
export type { AIGenerationRequest, AIGenerationResponse };
