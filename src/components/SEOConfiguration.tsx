import { useState, useEffect, useRef } from "react";
import {
  Card,
  Button,
  TextField,
  Select,
  BlockStack,
  Text,
  Icon,
  Modal,
  ChoiceList,
  InlineStack,
  Tag,
  Badge,
  LegacyStack,
  RadioButton
} from "@shopify/polaris";
import {
  PlusIcon,
  ChartHistogramFlatIcon,
  QuestionCircleIcon,
  StarIcon,
  SearchIcon,
  MagicIcon,
  StarFilledIcon
} from "@shopify/polaris-icons";
import ApiService from "../services/api";

interface SEOConfigurationProps {
  businessDescription?: string;
  targetCustomer?: string;
  onBusinessDescriptionChange?: (value: string) => void;
  onTargetCustomerChange?: (value: string) => void;
  onGenerate?: (generatedContent?: string, title?: string) => void;
  isGenerating?: boolean;
}

export const SEOConfiguration = ({
  businessDescription = "",
  targetCustomer = "",
  onBusinessDescriptionChange,
  onTargetCustomerChange,
  onGenerate,
  isGenerating = false
}: SEOConfigurationProps) => {
  const [writingStyle, setWritingStyle] = useState("academic");
  const [voiceTone, setVoiceTone] = useState("first_person");
  const [complexity, setComplexity] = useState("default");
  const [length, setLength] = useState("medium");
  const [keywords, setKeywords] = useState("");
  const [keywordTags, setKeywordTags] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [showTitleModal, setShowTitleModal] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [isKeywordInputFocused, setIsKeywordInputFocused] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [tempSelectedProduct, setTempSelectedProduct] = useState("");
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
  const [generatedTitles, setGeneratedTitles] = useState<string[]>([]);
  const [recommendedTitle, setRecommendedTitle] = useState<string | null>(null);
  const [tempSelectedTitle, setTempSelectedTitle] = useState<string | null>(null);
  const [isGeneratingBlog, setIsGeneratingBlog] = useState(false);
  const businessDescriptionRef = useRef<HTMLDivElement>(null);
  const targetCustomerRef = useRef<HTMLDivElement>(null);

  // Product data
  const products = [
    {
      id: "watch1",
      name: "Aesop Ultra Thin Men's Automatic Mechanical Watch - Stylish Leather Band",
      image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=60&h=60&fit=crop",
      status: null
    },
    {
      id: "watch2", 
      name: "BOBO BIRD Luxury Men's Digital Bamboo Watch - Unique LED Time Display",
      image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=60&h=60&fit=crop",
      status: null
    },
    {
      id: "watch3",
      name: "Casio MQ-24 Quartz Watch for Men - 30m Waterproof Military Style",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=60&h=60&fit=crop",
      status: null
    },
    {
      id: "watch4",
      name: "Casio MQ-24 Quartz Watch for Men - 30m Waterproof Military Style (Copy)",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=60&h=60&fit=crop",
      status: "Draft"
    }
  ];

  // Helper functions to get product information
  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : "Unknown Product";
  };

  const getProductImage = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product ? product.image : "";
  };

  // Style the textarea elements after component mounts to prevent auto-resize
  useEffect(() => {
    const styleTextareas = () => {
      // Target textareas within the specific refs
      const businessTextarea = businessDescriptionRef.current?.querySelector('textarea');
      const targetTextarea = targetCustomerRef.current?.querySelector('textarea');
      
      if (businessTextarea instanceof HTMLTextAreaElement) {
        businessTextarea.style.resize = 'none';
        businessTextarea.style.overflowY = 'auto';
        businessTextarea.style.minHeight = '80px';
        businessTextarea.style.maxHeight = '80px';
      }
      
      if (targetTextarea instanceof HTMLTextAreaElement) {
        targetTextarea.style.resize = 'none';
        targetTextarea.style.overflowY = 'auto';
        targetTextarea.style.minHeight = '80px';
        targetTextarea.style.maxHeight = '80px';
      }
    };

    // Apply styles after a short delay to ensure TextField is rendered
    const timeoutId = setTimeout(styleTextareas, 100);
    return () => clearTimeout(timeoutId);
  }, []); // Remove dependencies to prevent re-styling on every keystroke

  // Handle keyword input and tag creation
  const handleKeywordInput = (value: string) => {
    setKeywordInput(value);
  };

  const handleKeywordKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      const newKeyword = keywordInput.trim();
      if (newKeyword && !keywordTags.includes(newKeyword)) {
        setKeywordTags([...keywordTags, newKeyword]);
        setKeywordInput("");
      }
    }
  };

  const removeKeywordTag = (tagToRemove: string) => {
    setKeywordTags(keywordTags.filter(tag => tag !== tagToRemove));
  };

  const handleGenerateTitle = async () => {
    setIsGeneratingTitle(true);
    
    // Build the prompt using your exact structure
    const prompt = `You are a **Blog Title Generator AI** that creates **7 distinct and highly clickable blog title options** based on the brand's voice, audience, and strategic content pillars.

## Context:
**Brand Voice:**
- Tone: ${getBrandVoiceTone(writingStyle)}
- Formality Level: ${getFormalityLevel(complexity)}
- Brand Personality: ${getBrandPersonality(voiceTone)}
- Business description: ${businessDescription}
- Target customer: ${targetCustomer}

**Blog Main Content:**
- Keywords: ${keywordTags.join(', ')}

---

## Workflow:
1. Identify the core topic and intent from the provided keywords and context.  
2. Apply the brand voice, tone, and personality to ensure alignment.  
3. Use **content pillars** in this exact order:  
   1. Educational / How-to  
   2. Industry Insights / Trends  
   3. Product-focused  
   4. Customer Stories / Testimonials  
   5. Opinion / Thought Leadership  
   6. Behind-the-scenes / Company Culture  
   7. Fun / Engaging / Light-hearted  
4. Generate exactly **7 blog title variations**, each mapped to one content pillar above.  
5. Ensure all titles are **clear, concise (max 12 words)**, keyword-inclusive, and have a natural hook to encourage clicks.  
6. **Select 1 Recommended Title** from the 7, based on the highest combined score for:  
   - Keyword relevance & SEO strength  
   - Alignment with brand voice & target audience appeal  
   - Clickability / emotional engagement  

---

## Output Format (no extra text, only titles in list form):
1. [TITLE for Educational / How-to]  
2. [TITLE for Industry Insights / Trends]  
3. [TITLE for Product-focused]  
4. [TITLE for Customer Stories / Testimonials]  
5. [TITLE for Opinion / Thought Leadership]  
6. [TITLE for Behind-the-scenes / Company Culture]  
7. [TITLE for Fun / Engaging / Light-hearted]  
**Recommended Title:** [SELECTED TITLE]`;

    try {
      // Call Gemini API
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': 'AIzaSyAL9mRUDHqyhmrugEpkoS9zkL-jK3MqJy8'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      // Extract the generated text from Gemini response
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!generatedText) {
        throw new Error('No content generated from API');
      }

      // Parse the response to extract the 7 titles and recommended title
      const parsedResult = parseGeneratedTitles(generatedText);
      
      if (parsedResult.titles.length === 0) {
        throw new Error('Failed to parse titles from API response');
      }

      setGeneratedTitles(parsedResult.titles);
      
      // Store the recommended title for highlighting in UI
      if (parsedResult.recommendedTitle) {
        setRecommendedTitle(parsedResult.recommendedTitle);
        console.log('AI Recommended Title:', parsedResult.recommendedTitle);
      }
      
      setShowTitleModal(true);
    } catch (error) {
      console.error('Error generating titles:', error);
      
      // Show user-friendly error message
      alert(`Failed to generate titles: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Set fallback titles for better UX
      const fallbackTitles = [
        "How to Choose the Perfect Watch for Every Occasion",
        "2025 Watch Trends: What's Hot in Luxury Timepieces",
        "Discover Our Premium Collection of Automatic Watches",
        "Customer Spotlight: John's Journey to Finding His Dream Watch",
        "Why Quality Watches Are More Than Just Timekeepers",
        "Behind the Scenes: Crafting Excellence in Watchmaking",
        "Fun Facts About Watches That Will Surprise You"
      ];
      setGeneratedTitles(fallbackTitles);
      setShowTitleModal(true);
    } finally {
      setIsGeneratingTitle(false);
    }
  };

  const handleShowProductModal = () => {
    setShowProductModal(true);
    setTempSelectedProduct(selectedProduct); // Initialize with current selection
  };

  const handleProductSelection = (product: string) => {
    setTempSelectedProduct(product);
  };

  const handleConfirmProductSelection = () => {
    setSelectedProduct(tempSelectedProduct);
    setShowProductModal(false);
  };

  const handleGenerateBlog = async () => {
    console.log('handleGenerateBlog called!');
    console.log('postTitle:', postTitle);
    console.log('keywordTags:', keywordTags);
    
    if (!postTitle.trim() || keywordTags.length === 0) {
      console.log('Validation failed - missing title or keywords');
      alert('Validation failed - missing title or keywords');
      return;
    }
    
    // Set loading state
    setIsGeneratingBlog(true);
    
    try {
      // Build the prompt using your exact structure
      const prompt = `You are an **Expert Blog Content Generator** specialized in creating SEO-friendly, well-structured blog posts for Shopify stores, following the brand voice and tone provided by the user.  
You have deep knowledge of Shopify Polaris design principles and can reference them where UI/UX or store design tips are relevant.  
Do **not** use any emoji in the output.

## Context:
**Brand Voice:**
- Tone: ${getBrandVoiceTone(writingStyle)}
- Formality Level: ${getFormalityLevel(complexity)}
- Brand Personality: ${getBrandPersonality(voiceTone)}
- Business description: ${businessDescription}
- Target customer: ${targetCustomer}
	
**Blog Main Content:**
- Blog Title: ${postTitle}
- Keywords: ${keywordTags.join(', ')}

**Blog Style:**
 - Writing Style: ${writingStyleOptions.find(w => w.value === writingStyle)?.label || writingStyle}
- Perspective / Point of View: ${voiceToneOptions.find(v => v.value === voiceTone)?.label || voiceTone}
- Complexity: ${complexityOptions.find(c => c.value === complexity)?.label || complexity}
- Target Length: ${lengthOptions.find(l => l.value === length)?.label || length}
- Additional Style/Brand Voice: ${businessDescription}
- Product URL (optional): ${selectedProduct || "none"}

## Workflow:
1. Based on the given **Blog Main Content** **Complexity**, **Target Length**, first generate a **logical blog outline** that covers all important points to fully address the topic.
   - The outline must be structured with **H2** and **H3** headings.
2. Using the **Generated outline** (no user interaction required), write the **full blog article** follows the **Blog Style**, and reflect the **Brand Voice** element.

## Other rules:
1. The blog should be SEO-optimized, with headings (**H2, H3**) used appropriately. Integrate keywords naturally and avoid keyword stuffing.
2. The final result should be in the **Markdown** 
3. If a Product URL is provided, mention it once or twice in the content, linked as a call-to-action or relevant reference. The content present on this URL should be **Strong in call-to-action**
4. Maintain the blog content with **Blog Style**, and reflect the **Brand Voice**.
5. Ensure there are **no emojis** in the final content.

## Output Format:
Return only in the following Markdown structure:

\`\`\`markdown
## Introduction
[Intro paragraph that hooks the reader, introduces the topic, and includes at least one keyword.]

## [H2 Section 1]
### [H3 Subsection if needed]
[Content paragraphs.]

## [H2 Section 2]
[Content paragraphs.]

...

## Conclusion
[Summarize main points, include a soft CTA. If Product URL provided, mention it naturally here.]
\`\`\``;

      console.log('Prompt built successfully');
      console.log('Prompt:', prompt);

      // Call our backend API using ApiService
      const data = await ApiService.generateBlog(
        prompt, 
        import.meta.env.VITE_GEMINI_API_KEY || 'your-api-key-here'
      );
      
      const generatedContent = data.content;
      
      // Store the generated content in state for the parent component
      console.log('Generated blog content:', generatedContent);
      
      // Call the original onGenerate function with the generated content and title
      if (onGenerate) {
        // Pass the generated content and blog title to the parent component
        onGenerate(generatedContent, postTitle);
      }
      
    } catch (error) {
      console.error('Error generating blog:', error);
      alert('Failed to generate blog content. Please try again.');
    } finally {
      // Reset loading state
      setIsGeneratingBlog(false);
    }
  };

  const handleTitleSelection = (selected: string[]) => {
    if (selected.length > 0) {
      const title = selected[0];
      if (title === "Write your own title") {
        setPostTitle("");
        setShowTitleModal(false);
      } else {
        setPostTitle(title);
        setShowTitleModal(false);
      }
    }
  };

  const writingStyleOptions = [
    { label: "Academic", value: "academic" },
    { label: "Conversational", value: "conversational" },
    { label: "Storytelling", value: "storytelling" },
    { label: "Persuasive", value: "persuasive" },
    { label: "Instructional (How-to)", value: "instructional" },
    { label: "Journalistic(News-style)", value: "journalistic" }
  ];

  const voiceToneOptions = [
    { label: "First person (\"I\" / \"We\")", value: "first_person" },
    { label: "Second person (\"You\")", value: "second_person" },
    { label: "Third person (\"They\")", value: "third_person" }
  ];

  const complexityOptions = [
    { label: "Default", value: "default" },
    { label: "Simple", value: "simple" },
    { label: "Intermediate", value: "intermediate" },
    { label: "Advanced", value: "advanced" }
  ];

  const lengthOptions = [
    { label: "Short (under 800 words)", value: "short" },
    { label: "Medium (800–1500 words)", value: "medium" },
    { label: "Long-form (1500+ words, in-depth)", value: "long_form" }
  ];

  // Helper functions for brand voice mapping
  const getBrandVoiceTone = (style: string) => {
    const toneMap: { [key: string]: string } = {
      academic: "Professional and authoritative",
      conversational: "Friendly and approachable",
      storytelling: "Engaging and narrative-driven",
      persuasive: "Convincing and compelling",
      instructional: "Clear and educational",
      journalistic: "Informative and objective"
    };
    return toneMap[style] || "Professional";
  };

  const getFormalityLevel = (level: string) => {
    const formalityMap: { [key: string]: string } = {
      simple: "Casual and easy-to-understand",
      intermediate: "Balanced and accessible",
      advanced: "Professional and sophisticated",
      default: "Standard business level"
    };
    return formalityMap[level] || "Standard business level";
  };

  const getBrandPersonality = (pov: string) => {
    const personalityMap: { [key: string]: string } = {
      first_person: "Personal and authoritative",
      second_person: "Engaging and inclusive",
      third_person: "Professional and objective"
    };
    return personalityMap[pov] || "Professional and objective";
  };

  const getContentPillarLabel = (index: number) => {
    const pillars = [
      "Educational / How-to",
      "Industry Insights / Trends", 
      "Product-focused",
      "Customer Stories / Testimonials",
      "Opinion / Thought Leadership",
      "Behind-the-scenes / Company Culture",
      "Fun / Engaging / Light-hearted"
    ];
    return pillars[index] || "General";
  };

  const parseGeneratedTitles = (text: string): { titles: string[], recommendedTitle: string | null } => {
    try {
      // Split by lines and look for numbered titles
      const lines = text.split('\n').filter(line => line.trim());
      
      const titles: string[] = [];
      let recommendedTitle: string | null = null;
      
      for (const line of lines) {
        // Look for patterns like "1. [TITLE]" or "1) [TITLE]" or just numbered lines
        const match = line.match(/^\d+[\.\)]\s*(.+)$/);
        if (match) {
          const title = match[1].trim();
          if (title && title.length > 0) {
            titles.push(title);
          }
        }
        
        // Look for recommended title
        const recommendedMatch = line.match(/^\*\*Recommended Title:\*\*\s*(.+)$/);
        if (recommendedMatch) {
          recommendedTitle = recommendedMatch[1].trim();
        }
      }
      
      // If we found exactly 7 titles, return them
      if (titles.length === 7) {
        return { titles, recommendedTitle };
      }
      
      // Fallback: try to extract any text that looks like a title
      const fallbackTitles = lines
        .filter(line => line.trim().length > 10 && line.trim().length < 100)
        .slice(0, 7)
        .map(line => line.trim());
      
      return { titles: fallbackTitles, recommendedTitle: null };
    } catch (error) {
      console.error('Error parsing titles:', error);
      return { titles: [], recommendedTitle: null };
    }
  };

  return (
    <>
      <Card>
        <div style={{ padding: "16px" }}>
          <Text variant="headingMd" as="h3">Content Style Settings</Text>
        </div>
        <div style={{ padding: "0 16px 16px" }}>
          <BlockStack gap="400">
            {/* Content Style Settings */}
            <BlockStack gap="200">
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <div style={{ flex: "1", minWidth: "200px" }}>
                  <Select
                    label="Writing style"
                    options={writingStyleOptions}
                    value={writingStyle}
                    onChange={setWritingStyle}
                  />
                </div>
                <div style={{ flex: "1", minWidth: "200px" }}>
                  <Select
                    label="Perspective / Point of View"
                    options={voiceToneOptions}
                    value={voiceTone}
                    onChange={setVoiceTone}
                  />
                </div>
                <div style={{ flex: "1", minWidth: "200px" }}>
                  <Select
                    label="Complexity"
                    options={complexityOptions}
                    value={complexity}
                    onChange={setComplexity}
                  />
                </div>
                <div style={{ flex: "1", minWidth: "200px" }}>
                  <Select
                    label="Length / Depth"
                    options={lengthOptions}
                    value={length}
                    onChange={setLength}
                  />
                </div>
              </div>
            </BlockStack>

            {/* Blog Purpose */}
            <BlockStack gap="200">
              <Text variant="headingSm" as="h4">Blog Purpose</Text>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <div style={{ flex: "1", minWidth: "300px" }}>
                  <div ref={businessDescriptionRef}>
                    <TextField
                      label="Business description"
                      value={businessDescription}
                      onChange={onBusinessDescriptionChange || (() => {})}
                      placeholder="Example: Premium cotton t-shirts and sustainable fashion for eco-conscious consumers"
                      multiline={4}
                      maxLength={500}
                      showCharacterCount
                      autoComplete="off"
                    />
                  </div>
                  <div style={{ marginTop: "16px" }}>
                    <Card>
                      {selectedProduct ? (
                        <div style={{
                          borderRadius: "8px",
                          overflow: "hidden",
                          border: "1px solid #c9cccf",
                          marginBottom: "16px"
                        }}>
                          <div style={{ padding: "16px", backgroundColor: "#f6f6f7" }}>
                            <InlineStack gap="200" align="start">
                              <img 
                                src={getProductImage(selectedProduct)}
                                alt={getProductName(selectedProduct)}
                                style={{ 
                                  width: "60px", 
                                  height: "60px", 
                                  borderRadius: "4px",
                                  objectFit: "cover"
                                }}
                              />
                              <BlockStack gap="100">
                                <Text variant="bodyMd" as="p" fontWeight="bold">
                                  {getProductName(selectedProduct)}
                                </Text>
                                <Text variant="bodySm" as="p" tone="subdued">
                                  This product will be featured in your blog post
                                </Text>
                              </BlockStack>
                            </InlineStack>
                          </div>
                          <div style={{ padding: "12px", borderTop: "1px solid #c9cccf" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <Button variant="secondary" size="slim" onClick={handleShowProductModal}>
                                Change product
                              </Button>
                              <Button variant="plain" onClick={() => setSelectedProduct("")}>
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div style={{
                          border: "2px dashed #c9cccf",
                          borderRadius: "8px",
                          padding: "28px 20px",
                          textAlign: "center",
                          backgroundColor: "#f6f6f7"
                        }}>
                          <Button 
                            variant="secondary" 
                            icon={PlusIcon}
                            onClick={handleShowProductModal}
                          >
                            Insert a product into the post
                          </Button>
                        </div>
                      )}
                    </Card>
                  </div>
                </div>
                
                <div style={{ flex: "1", minWidth: "300px" }}>
                  <div ref={targetCustomerRef}>
                    <TextField
                      label="Target customer"
                      value={targetCustomer}
                      onChange={onTargetCustomerChange || (() => {})}
                      placeholder="Example: Young professionals aged 25-40 who value sustainability and style"
                      multiline={4}
                      maxLength={500}
                      showCharacterCount
                      autoComplete="off"
                    />
                  </div>

                </div>
              </div>
            </BlockStack>

            {/* Keywords and Title */}
            <BlockStack gap="200">
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                  <Text variant="bodyMd" as="span">Keywords</Text>
                </div>
                <div style={{ 
                  border: isKeywordInputFocused ? '2px solid #5c6ac4' : '2px solid #e1e3e5', 
                  borderRadius: '8px', 
                  padding: '8px 12px',
                  minHeight: '40px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  alignItems: 'center'
                }}>
                  {keywordTags.map((tag, index) => (
                    <Tag key={index} onRemove={() => removeKeywordTag(tag)}>
                      {tag}
                    </Tag>
                  ))}
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => handleKeywordInput(e.target.value)}
                    onKeyDown={handleKeywordKeyDown}
                    onFocus={() => setIsKeywordInputFocused(true)}
                    onBlur={() => setIsKeywordInputFocused(false)}
                    placeholder="Example: sustainable fashion, eco-friendly, organic cotton"
                    style={{
                      border: 'none',
                      outline: 'none',
                      flex: '1',
                      minWidth: '120px',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                      color: 'inherit',
                      backgroundColor: 'transparent'
                    }}
                  />
                </div>
              </div>
              
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                  <Text variant="bodyMd" as="span">Blog title</Text>
                  <Button
                    variant="plain"
                    onClick={handleGenerateTitle}
                    disabled={keywordTags.length === 0}
                  >
                    Generate title
                  </Button>
                </div>
                <div style={{ 
                  border: '2px solid #e1e3e5', 
                  borderRadius: '8px', 
                  padding: '8px 12px',
                  minHeight: '40px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <input
                    type="text"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    placeholder="Example: The Ultimate Guide to Sustainable Fashion"
                    autoComplete="off"
                    style={{
                      border: 'none',
                      outline: 'none',
                      flex: '1',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                      color: 'inherit',
                      backgroundColor: 'transparent'
                    }}
                  />
                </div>
              </div>
            </BlockStack>

                        {/* Action Buttons */}
            <BlockStack gap="200">
              {/* <Button 
                variant="secondary"
                onClick={() => alert("Add outline")}
              >
                Add outline
              </Button> */}
              
              {/* Loading Message */}
              {isGeneratingBlog && (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '16px',
                  backgroundColor: '#f6f6f7',
                  borderRadius: '8px',
                  border: '1px solid #c9cccf'
                }}>
                  <div style={{ margin: '0 0 8px 0' }}>
                    <Text variant="bodyMd" as="p">
                      🚀 Generating your blog post...
                    </Text>
                  </div>
                  <div style={{ margin: 0, color: '#6d7175' }}>
                    <Text variant="bodySm" as="p">
                      This may take a few moments. Please wait while AI creates your content.
                    </Text>
                  </div>
                </div>
              )}
              
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                  <Button 
                    variant="primary" 
                    icon={MagicIcon}
                    onClick={handleGenerateBlog}
                    loading={isGeneratingBlog}
                    size="large"
                    disabled={keywordTags.length === 0 || !postTitle.trim() || isGeneratingBlog}
                  >
                    {isGeneratingBlog ? 'Generating...' : 'Generate'}
                  </Button>
                </div>
            </BlockStack>
          </BlockStack>
        </div>
      </Card>

      {/* Title Selection Modal */}
      <Modal
        open={showTitleModal}
        onClose={() => setShowTitleModal(false)}
        title="Which title works best for your post?"
        primaryAction={{
          content: 'Select Title',
          onAction: () => {
            if (tempSelectedTitle) {
              setPostTitle(tempSelectedTitle);
              setShowTitleModal(false);
              setTempSelectedTitle(null);
            }
          },
          disabled: !tempSelectedTitle
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: () => setShowTitleModal(false)
          }
        ]}
      >
                <Modal.Section>
          {generatedTitles.length > 0 ? (() => {
            // Reorder titles to put recommended first
            const reorderedTitles = [...generatedTitles];
            if (recommendedTitle) {
              const recommendedIndex = reorderedTitles.indexOf(recommendedTitle);
              if (recommendedIndex > 0) {
                reorderedTitles.splice(recommendedIndex, 1);
                reorderedTitles.unshift(recommendedTitle);
              }
            }
            
            return (
              <LegacyStack vertical>
                {reorderedTitles.map((title, index) => (
                  <div key={index}>
                    <RadioButton
                      label={
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span>{title}</span>
                          {title === recommendedTitle && (
                            <div className="badge-success" style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              padding: '0px 12px',
                              height: '24px',
                              fontSize: '10px',
                              fontWeight: 'bold',
                              color: '#248000',
                              borderRadius: '999px',
                              background: 'linear-gradient(90deg, #C7FFB1 0%, #EAFFEA 100%)',
                              border: '2px solid #B5EFA5',
                              whiteSpace: 'nowrap',
                              textTransform: 'uppercase'
                            }}>
                              RECOMMENDED
                            </div>
                          )}
                        </div>
                      }
                      checked={tempSelectedTitle === title}
                      id={`title-${index}`}
                      name="blog-titles"
                      onChange={() => setTempSelectedTitle(title)}
                    />
                  </div>
                ))}
              </LegacyStack>
            );
          })() : (
            <Text variant="bodyMd" as="p">
              No titles generated yet. Please click 'Generate title' to create options.
            </Text>
          )}
        </Modal.Section>
      </Modal>

      {/* Product Selection Modal */}
      <Modal
        open={showProductModal}
        onClose={() => setShowProductModal(false)}
        title="Select product"
        primaryAction={{
          content: 'Select',
          onAction: handleConfirmProductSelection,
          disabled: !tempSelectedProduct
        }}
        secondaryActions={[
          {
            content: 'Cancel',
            onAction: () => setShowProductModal(false)
          }
        ]}
      >
        <Modal.Section>
          <BlockStack gap="400">
            {/* Search and Filter Section */}
            <InlineStack gap="200" align="space-between">
              <div style={{ flex: "1" }}>
                <div style={{
                  border: "1px solid #c9cccf",
                  borderRadius: "8px",
                  padding: "6px 12px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#ffffff"
                }}>
                  <div style={{ marginRight: "8px" }}>
                    <Icon source={SearchIcon} tone="base" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search products"
                    autoComplete="off"
                    style={{
                      border: "none",
                      outline: "none",
                      flex: "1",
                      fontSize: "14px",
                      fontFamily: "inherit",
                      color: "inherit",
                      backgroundColor: "transparent"
                    }}
                  />
                </div>
              </div>
              <Select
                label=""
                labelHidden
                options={[
                  { label: "Search by All", value: "all" },
                  { label: "Search by Title", value: "title" },
                  { label: "Search by Description", value: "description" }
                ]}
                value="all"
                onChange={() => {}}
              />
            </InlineStack>
            
            <Button variant="secondary" size="slim">
              Add filter +
            </Button>

            {/* Product List */}
            <div style={{ maxHeight: "400px", overflowY: "auto" }}>
              <BlockStack gap="200">
                {products.map((product) => (
                  <div key={product.id} style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "12px",
                    padding: "8px",
                    borderRadius: "4px",
                                         backgroundColor: tempSelectedProduct === product.id ? "#f6f6f7" : "transparent"
                  }}>
                                         <input
                       type="checkbox"
                       checked={tempSelectedProduct === product.id}
                       onChange={() => handleProductSelection(product.id)}
                       style={{ margin: 0 }}
                     />
                    <img 
                      src={product.image} 
                      alt={product.name}
                      style={{ 
                        width: "40px", 
                        height: "40px", 
                        borderRadius: "4px",
                        objectFit: "cover"
                      }}
                    />
                    <div style={{ flex: "1" }}>
                      <Text variant="bodyMd" as="p">
                        {product.name}
                      </Text>
                    </div>
                    {product.status && (
                      <Badge tone="info">{product.status}</Badge>
                    )}
                  </div>
                ))}
              </BlockStack>
            </div>

            {/* Footer Status */}
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              paddingTop: "16px",
              borderTop: "1px solid #e1e3e5"
            }}>
              <Text variant="bodySm" as="span" tone="subdued">
                {tempSelectedProduct ? "1/1" : "0/1"} products selected
              </Text>
            </div>
          </BlockStack>
        </Modal.Section>
      </Modal>
    </>
  );
}; 