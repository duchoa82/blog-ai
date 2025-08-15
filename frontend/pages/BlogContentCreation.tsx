import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchShopifyImages, ShopifyAsset } from "../services/shopify-media";
import { fetchShopifyBlogs, ShopifyBlog, createShopifyArticle } from "../services/shopify-blog";
import {
  Modal,
  Card,
  Button,
  TextField,
  Select,
  BlockStack,
  Text,
  InlineStack,
  Grid,
  Icon,
  Tag,
  RadioButton,
  ChoiceList,
  ProgressBar,
  Divider,
  Badge
} from "@shopify/polaris";
import {
  PlusIcon,
  StarIcon,
  ViewIcon,
  SettingsIcon,
  MaximizeIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  TagIcon,
  GlobeIcon,
  SearchIcon,
  UploadIcon,
  CursorOptionIcon,
  ChevronDownIcon,
  TextBoldIcon,
  TextItalicIcon,
  TextUnderlineIcon,
  ListNumberedIcon,
  ListBulletedIcon,
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon,
  LinkIcon,
  CodeIcon,
  UndoIcon,
  RedoIcon
} from "@shopify/polaris-icons";

interface BlogContentCreationProps {
  isOpen: boolean;
  onClose: () => void;
  generatedContent?: string;
  blogTitle?: string;
}

const BlogContentCreation = ({ isOpen, onClose, generatedContent, blogTitle }: BlogContentCreationProps) => {
  const navigate = useNavigate();

  // Add CSS for better HTML rendering
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .rich-text-editor h1 {
        font-size: 28px;
        font-weight: bold;
        margin: 24px 0 16px 0;
        color: #202223;
        line-height: 1.3;
      }
      .rich-text-editor h2 {
        font-size: 24px;
        font-weight: 600;
        margin: 20px 0 12px 0;
        color: #202223;
        line-height: 1.4;
      }
      .rich-text-editor h3 {
        font-size: 20px;
        font-weight: 600;
        margin: 16px 0 8px 0;
        color: #202223;
        line-height: 1.4;
      }
      .rich-text-editor p {
        margin: 12px 0;
        line-height: 1.6;
      }
      .rich-text-editor strong {
        font-weight: 600;
      }
      .rich-text-editor em {
        font-style: italic;
      }
      .rich-text-editor a {
        color: #5c6ac4;
        text-decoration: underline;
      }
      .rich-text-editor a:hover {
        color: #4c5aa8;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Function to convert Markdown to HTML
  const convertMarkdownToHtml = (markdown: string): string => {
    let html = markdown;
    
    // Remove markdown code block markers
    html = html.replace(/```markdown\n?/g, '').replace(/```\n?/g, '');
    
    // Convert headers (handle both single and multi-line headers)
    html = html.replace(/^### (.*?)(?:\n|$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*?)(?:\n|$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*?)(?:\n|$)/gim, '<h1>$1</h1>');
    
    // Convert bold text
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convert italic text
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Convert links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Split content into sections based on headers
    const sections = html.split(/(?=^## |^### |^# )/gm);
    
    // Process each section
    const processedSections = sections.map(section => {
      if (section.trim() === '') return '';
      
      // If section starts with a header, don't wrap in p tags
      if (section.match(/^<h[1-3]>/)) {
        return section;
      }
      
      // For content sections, convert line breaks to paragraphs
      let processedSection = section.trim();
      if (processedSection) {
        // Split by double line breaks and wrap in p tags
        const paragraphs = processedSection.split(/\n\n+/);
        return paragraphs.map(p => p.trim() ? `<p>${p.trim()}</p>` : '').join('');
      }
      return '';
    });
    
    // Join sections and clean up
    html = processedSections.join('').trim();
    
    // Clean up empty paragraphs and extra whitespace
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/\n+/g, ' ');
    html = html.replace(/\s+/g, ' ');
    
    return html;
  };
  const [visibility, setVisibility] = useState("hidden");
  const [visibilityDate, setVisibilityDate] = useState("2025-08-09");
  const [visibilityTime, setVisibilityTime] = useState("15:00");
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [showImageLibrary, setShowImageLibrary] = useState(false);
  const [shopifyImages, setShopifyImages] = useState<ShopifyAsset[]>([]);
  const [tempSelectedImage, setTempSelectedImage] = useState<ShopifyAsset | null>(null);
  const [shopifyBlogs, setShopifyBlogs] = useState<ShopifyBlog[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [isLoadingBlogs, setIsLoadingBlogs] = useState(false);
  const [showReplaceDropdown, setShowReplaceDropdown] = useState(false);
  const [excerpt, setExcerpt] = useState("Discover the essential T-shirt trends for Summer 2025 and learn how to stay cool in style with our fresh fashion insights.");
  const [author, setAuthor] = useState("Default");
  const [blog, setBlog] = useState("News");
  const [tags, setTags] = useState(["fashion trends", "summer 2025", "stylish t-shirts", "sumi"]);
  const [seoTitle, setSeoTitle] = useState("Stay Cool in Style: Essential T-Shirt Trends for Surr");
  const [seoDescription, setSeoDescription] = useState("Discover the essential T-shirt trends for Summer 2025 and learn how to stay cool in style with our fresh fashion insights.");
  const [urlHandle, setUrlHandle] = useState("/news/stay-cool-in-style-essential-t-shirt-trends");
  const [showParagraphDropdown, setShowParagraphDropdown] = useState(false);
  const [currentParagraphStyle, setCurrentParagraphStyle] = useState('paragraph');
  const [activeSection, setActiveSection] = useState<'title' | 'content' | null>(null);
  const contentEditableRef = useRef<HTMLDivElement>(null);
  const [blogContent, setBlogContent] = useState(`
    <p>As we approach Summer 2025, the fashion world is buzzing with anticipation for the latest t-shirt trends that will dominate the season. This year promises to be a revolutionary period for this timeless garment, blending nostalgic elements with cutting-edge technological advancements and sustainable practices.</p>
    
    <h2>The Evolution of Summer T-Shirts: From Basic to Trendsetting</h2>
    
    <p>The t-shirt has undergone a remarkable transformation from its humble beginnings as a utilitarian undergarment to becoming one of the most versatile and expressive pieces in modern fashion. Summer 2025 marks a pivotal moment in this evolution, where designers are pushing boundaries and reimagining what a t-shirt can be.</p>
    
    <p>This season's collections showcase an unprecedented fusion of comfort and style, with innovative fabrics that offer both breathability and durability. The traditional cotton t-shirt is being elevated through advanced textile engineering, incorporating moisture-wicking properties, UV protection, and eco-friendly materials that align with the growing demand for sustainable fashion.</p>
    
    <h2>Historical Context of T-Shirts in Summer Fashion</h2>
    
    <p>The t-shirt's association with summer fashion dates back to the mid-20th century, when it emerged from military and athletic contexts to become a symbol of casual, comfortable style. Throughout the decades, it has served as a canvas for cultural expression, from the tie-dye revolution of the 1960s to the oversized silhouettes of the 1980s, the minimalist approach of the 1990s, and the embellished designs of the 2000s.</p>
    
    <blockquote>"The t-shirt has consistently functioned as a barometer for cultural shifts and aesthetic preferences, with its evolution reflecting broader societal transformations in attitudes toward leisure, self-expression, and the democratization of fashion." - Dr. Eliza Montgomery, Fashion Historian at the Institute of Contemporary Style.</blockquote>
    
    <p>Summer 2025's t-shirt trends represent a culmination of this rich historical lineage while embracing new innovations that reflect our current moment. The designs we're seeing this season honor the garment's democratic spirit while pushing the boundaries of what's possible in terms of sustainability, technology, and artistic expression.</p>
  `);

  // Handle generated content from AI
  useEffect(() => {
    if (generatedContent && generatedContent.trim()) {
      console.log('Setting generated content:', generatedContent);
      
      // Convert Markdown to HTML
      const htmlContent = convertMarkdownToHtml(generatedContent);
      console.log('Converted HTML content:', htmlContent);
      
      setBlogContent(htmlContent);
      
      // Set the converted HTML content in the contentEditable div
      if (contentEditableRef.current) {
        contentEditableRef.current.innerHTML = htmlContent;
      }
      
      // Note: We don't extract H1 from generated content since the H1 is the Blog Title
      // The generated content should start with content, not with an H1 tag
    }
  }, [generatedContent]);

  // Initialize H1 content when component mounts
  useEffect(() => {
    if (contentEditableRef.current && !generatedContent) {
      // Set initial content if no generated content
      contentEditableRef.current.innerHTML = blogContent;
    }
  }, []);

  // Update H1 title when blogTitle prop changes
  useEffect(() => {
    if (blogTitle && blogTitle.trim()) {
      setSeoTitle(blogTitle);
      
      // Update the H1 element content
      const h1Element = document.querySelector('h1[contenteditable]');
      if (h1Element) {
        h1Element.textContent = blogTitle;
      }
    }
  }, [blogTitle]);

  const authorOptions = [
    { label: "Default", value: "Default" },
    { label: "Admin", value: "Admin" },
    { label: "Editor", value: "Editor" }
  ];

  const blogOptions = [
    { label: "News", value: "News" },
    { label: "Fashion", value: "Fashion" },
    { label: "Lifestyle", value: "Lifestyle" }
  ];

  const handleAddTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handlePublish = async () => {
    try {
      // Get the selected blog (default to first blog if none selected)
      const selectedBlog = shopifyBlogs.find(blog => blog.title === blog) || shopifyBlogs[0];
      
      if (!selectedBlog) {
        alert("No blog selected. Please create a blog first.");
        return;
      }

      // Prepare article data
      const articleData = {
        title: seoTitle,
        body_html: `<h1>${seoTitle}</h1><p>${excerpt}</p>`, // Basic HTML structure
        author: author,
        tags: tags.join(', '),
        published_at: visibility === "visible" ? new Date().toISOString() : undefined,
        image: selectedImageUrl ? {
          src: selectedImageUrl,
          alt: imageAlt
        } : undefined,
        seo: {
          title: seoTitle,
          description: seoDescription
        }
      };

      // Create the article in Shopify
      const newArticle = await createShopifyArticle(selectedBlog.id, articleData);
      
      alert(`Blog post "${newArticle.title}" published successfully!`);
      onClose();
    } catch (error) {
      console.error('Failed to publish article:', error);
      alert("Failed to publish blog post. Please try again.");
    }
  };

  const handlePreview = () => {
    // Handle preview logic
    alert("Preview mode activated!");
  };

  const handleUploadFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setSelectedImage(file);
        const url = URL.createObjectURL(file);
        setSelectedImageUrl(url);
        setImageUrl(url);
        // Auto-fill image alt with filename
        const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove file extension
        setImageAlt(fileName);
      }
    };
    input.click();
  };

  const handleSelectFromLibrary = async () => {
    setShowImageLibrary(true);
    setTempSelectedImage(null);
    setIsLoadingImages(true);
    
    try {
      const images = await fetchShopifyImages();
      setShopifyImages(images);
    } catch (error) {
      console.error('Failed to fetch Shopify images:', error);
      // Fallback to sample images if API fails
      setShopifyImages([
        { id: 1, key: 'snowy-mountains.jpg', public_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=60&h=60&fit=crop', content_type: 'image/jpeg', size: 0, created_at: '', updated_at: '' },
        { id: 2, key: 'mens-watch-and-ring.jpg', public_url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=60&h=60&fit=crop', content_type: 'image/jpeg', size: 0, created_at: '', updated_at: '' },
        { id: 3, key: 'blue-wristwatch.jpg', public_url: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=60&h=60&fit=crop', content_type: 'image/jpeg', size: 0, created_at: '', updated_at: '' },
        { id: 4, key: 'rose-gold-watch.jpg', public_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=60&h=60&fit=crop', content_type: 'image/jpeg', size: 0, created_at: '', updated_at: '' },
        { id: 5, key: 'fashion-model.jpg', public_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=60&h=60&fit=crop', content_type: 'image/jpeg', size: 0, created_at: '', updated_at: '' },
        { id: 6, key: 'sustainable-fashion.jpg', public_url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=60&h=60&fit=crop', content_type: 'image/jpeg', size: 0, created_at: '', updated_at: '' },
        { id: 7, key: 'cotton-fabric.jpg', public_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=60&h=60&fit=crop', content_type: 'image/jpeg', size: 0, created_at: '', updated_at: '' },
        { id: 8, key: 'summer-collection.jpg', public_url: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=60&h=60&fit=crop', content_type: 'image/jpeg', size: 0, created_at: '', updated_at: '' }
      ]);
    } finally {
      setIsLoadingImages(false);
    }
  };

  const handleSelectLibraryImage = (asset: ShopifyAsset) => {
    setTempSelectedImage(asset);
  };

  const handleConfirmImageSelection = () => {
    if (tempSelectedImage) {
      setSelectedImageUrl(tempSelectedImage.public_url);
      setImageUrl(tempSelectedImage.public_url);
      setShowImageLibrary(false);
      // Auto-fill image alt with asset key or alt text
      setImageAlt(tempSelectedImage.alt || tempSelectedImage.key.replace(/[_-]/g, ' '));
      setTempSelectedImage(null);
    }
  };

  const handleDeleteImage = () => {
    setSelectedImage(null);
    setSelectedImageUrl("");
    setImageUrl("");
    setImageAlt("");
  };

  const handleReplaceImage = () => {
    setShowReplaceDropdown(!showReplaceDropdown);
  };

  const handleReplaceWithUpload = () => {
    setShowReplaceDropdown(false);
    handleUploadFile();
  };

  const handleReplaceWithLibrary = () => {
    setShowReplaceDropdown(false);
    handleSelectFromLibrary();
  };

  // Rich text editor functions
  const formatText = (command: string, value?: string) => {
    if (activeSection === 'content' && contentEditableRef.current) {
      // Ensure the contentEditable element is focused
      contentEditableRef.current.focus();
      
      // If no selection exists, create one at the end
      if (!window.getSelection()?.rangeCount) {
        const range = document.createRange();
        const selection = window.getSelection();
        if (contentEditableRef.current && selection) {
          range.selectNodeContents(contentEditableRef.current);
          range.collapse(false); // collapse to end
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
      
      document.execCommand(command, false, value);
    }
  };

  const handleBold = () => formatText('bold');
  const handleItalic = () => formatText('italic');
  const handleUnderline = () => formatText('underline');
  const handleAlignLeft = () => formatText('justifyLeft');
  const handleAlignCenter = () => formatText('justifyCenter');
  const handleAlignRight = () => formatText('justifyRight');
  const handleInsertList = () => formatText('insertUnorderedList');
  const handleInsertNumberedList = () => formatText('insertOrderedList');
  const handleInsertLink = () => {
    const url = prompt('Enter URL:');
    if (url) formatText('createLink', url);
  };
  const handleUndo = () => formatText('undo');
  const handleRedo = () => formatText('redo');

  // Function to ensure content area is focused and ready for editing
  const ensureContentFocus = () => {
    console.log('ensureContentFocus called');
    if (contentEditableRef.current) {
      contentEditableRef.current.focus();
      setActiveSection('content');
      console.log('Setting activeSection to content');
      
      // If no selection exists, create one at the end
      if (!window.getSelection()?.rangeCount) {
        const range = document.createRange();
        const selection = window.getSelection();
        if (contentEditableRef.current && selection) {
          range.selectNodeContents(contentEditableRef.current);
          range.collapse(false); // collapse to end
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
    }
  };

  // Paragraph style functions
  const handleParagraphStyle = (style: string) => {
    if (activeSection === 'content') {
      switch (style) {
        case 'paragraph':
          formatText('formatBlock', '<p>');
          break;
        case 'h1':
          formatText('formatBlock', '<h1>');
          break;
        case 'h2':
          formatText('formatBlock', '<h2>');
          break;
        case 'h3':
          formatText('formatBlock', '<h3>');
          break;
        case 'h4':
          formatText('formatBlock', '<h4>');
          break;
        case 'h5':
          formatText('formatBlock', '<h5>');
          break;
        case 'h6':
          formatText('formatBlock', '<h6>');
          break;
        case 'blockquote':
          formatText('formatBlock', '<blockquote>');
          break;
        default:
          formatText('formatBlock', '<p>');
      }
    }
  };

  const seoTitleLength = seoTitle.length;
  const seoDescriptionLength = seoDescription.length;

  // Close paragraph dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[data-paragraph-dropdown]')) {
        setShowParagraphDropdown(false);
      }
    };

    if (showParagraphDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showParagraphDropdown]);

  // Monitor activeSection changes
  useEffect(() => {
    console.log('activeSection changed to:', activeSection);
  }, [activeSection]);

  // Load Shopify blogs on component mount
  useEffect(() => {
    const loadShopifyBlogs = async () => {
      setIsLoadingBlogs(true);
      try {
        const blogs = await fetchShopifyBlogs();
        setShopifyBlogs(blogs);
        
        // Update blog options with real Shopify blogs
        if (blogs.length > 0) {
          setBlog(blogs[0].title); // Set first blog as default
        }
      } catch (error) {
        console.error('Failed to fetch Shopify blogs:', error);
        // Keep default blog options if API fails
      } finally {
        setIsLoadingBlogs(false);
      }
    };

    loadShopifyBlogs();
  }, []);

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title=""
      large
      fullScreen
    >
      <div style={{ 
        height: "100vh", 
        width: "100vw", 
        maxWidth: "100vw",
        display: "flex", 
        flexDirection: "column",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999
      }}>
        {/* Header */}
        <div style={{ 
          padding: "16px 24px", 
          borderBottom: "1px solid #e1e3e5",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#f6f6f7"
        }}>
          <div>
            <Text variant="headingLg" as="h1" fontWeight="bold">
              Enipa AI Generated Blog
            </Text>
            {blogTitle && (
              <Text variant="headingMd" as="h2" style={{ marginTop: "8px", color: "#5c6ac4" }}>
                {blogTitle}
              </Text>
            )}
          </div>
          <InlineStack gap="200">
            <Button variant="secondary" icon={ViewIcon} onClick={handlePreview}>
              Preview
            </Button>
            <Button variant="primary" icon={StarIcon} onClick={handlePublish}>
              Publish
            </Button>
            <Button variant="tertiary" icon={SettingsIcon} />
            <Button variant="tertiary" icon={MaximizeIcon} />
            <Button variant="tertiary" onClick={onClose}>×</Button>
          </InlineStack>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          {/* Left Sidebar */}
          <div style={{ 
            width: "400px", 
            borderRight: "1px solid #e1e3e5",
            overflowY: "auto",
            backgroundColor: "#fafafa"
          }} className="custom-card-padding">
            <div style={{ padding: "24px" }}>
              <BlockStack gap="400">
                {/* Post Section */}
                <Card>
                  <div style={{ padding: "0px", marginBottom: "8px" }}>
                    <Text variant="headingMd" as="h3">Post Visibility</Text>
                  </div>
                  <div>
                    <BlockStack gap="200">
                      <ChoiceList
                        title=""
                        choices={[
                          { label: "Visible", value: "visible" },
                          { label: "Hidden", value: "hidden" }
                        ]}
                        selected={[visibility]}
                        onChange={([selected]) => setVisibility(selected)}
                      />
                      {visibility === "visible" && (
                        <div>
                          <Text variant="bodyMd" as="span" fontWeight="medium">Set visibility date</Text>
                          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                            <TextField
                              label=""
                              labelHidden
                              type="date"
                              value={visibilityDate}
                              onChange={setVisibilityDate}
                            />
                            <TextField
                              label=""
                              labelHidden
                              type="time"
                              value={visibilityTime}
                              onChange={setVisibilityTime}
                            />
                          </div>
                        </div>
                      )}
                    </BlockStack>
                  </div>
                </Card>

                {/* Featured Image Section */}
                <Card>
                  <div style={{ padding: "0px", marginBottom: "8px" }}>
                    <Text variant="headingMd" as="h3">Featured Image</Text>
                  </div>
                  <div>
                    <BlockStack gap="200">
                      {selectedImageUrl ? (
                        <div style={{
                          borderRadius: "8px",
                          overflow: "hidden",
                          border: "1px solid #c9cccf",
                          marginBottom: "16px"
                        }}>
                          <img 
                            src={selectedImageUrl} 
                            alt={imageAlt || "Featured image"}
                            style={{
                              width: "100%",
                              height: "auto",
                              maxHeight: "200px",
                              objectFit: "cover"
                            }}
                          />
                          <div style={{ padding: "12px", borderTop: "1px solid #c9cccf" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                              <BlockStack gap="200">
                                <Button variant="secondary" size="slim" icon={UploadIcon} onClick={handleUploadFile}>
                                  Upload image
                                </Button>
                                <Button variant="secondary" size="slim" icon={CursorOptionIcon} onClick={handleSelectFromLibrary}>
                                  Select from library
                                </Button>
                              </BlockStack>
                              <Button variant="plain" onClick={handleDeleteImage}>
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div style={{
                          border: "2px dashed #c9cccf",
                          borderRadius: "8px",
                          padding: "40px 20px",
                          textAlign: "center",
                          backgroundColor: "#f6f6f7"
                        }}>
                          <InlineStack gap="200">
                            <Button variant="secondary" size="slim" icon={UploadIcon} style={{ width: "fit-content" }} onClick={handleUploadFile}>
                              Upload file
                            </Button>
                            <Button variant="secondary" size="slim" icon={CursorOptionIcon} style={{ width: "fit-content" }} onClick={handleSelectFromLibrary}>
                              Select from library
                            </Button>
                          </InlineStack>
                        </div>
                      )}
                      <div>
                        <div style={{ marginBottom: "8px" }}>
                          <Text variant="bodyMd" as="span">or Insert image URL</Text>
                        </div>
                        <div style={{
                          border: "1px solid #c9cccf",
                          borderRadius: "8px",
                          padding: "6px 12px",
                          height: "32px",
                          display: "flex",
                          alignItems: "center",
                          backgroundColor: "#ffffff"
                        }}>
                          <input
                            type="text"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="https://example.com/image.jpg"
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
                      <div>
                        <div style={{ marginBottom: "8px" }}>
                          <Text variant="bodyMd" as="span">Image alt</Text>
                        </div>
                        <div style={{
                          border: "1px solid #c9cccf",
                          borderRadius: "8px",
                          padding: "6px 12px",
                          height: "32px",
                          display: "flex",
                          alignItems: "center",
                          backgroundColor: "#ffffff"
                        }}>
                          <input
                            type="text"
                            value={imageAlt}
                            onChange={(e) => setImageAlt(e.target.value)}
                            placeholder="Describe the image for accessibility"
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
                    </BlockStack>
                  </div>
                </Card>

                {/* Organization Section */}
                <Card>
                  <div style={{ padding: "0px", marginBottom: "8px" }}>
                    <Text variant="headingMd" as="h3">Organization</Text>
                  </div>
                  <div>
                    <BlockStack gap="200">
                      <Select
                        label="Author"
                        options={authorOptions}
                        value={author}
                        onChange={setAuthor}
                      />
                      <Select
                        label="Blog"
                        options={blogOptions}
                        value={blog}
                        onChange={setBlog}
                      />
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                          <Text variant="bodyMd" as="span">Tags</Text>
                          <Text variant="bodyMd" as="span" style={{ color: "#0066cc", cursor: "pointer", textDecoration: "underline" }}>
                            Generate with AI
                          </Text>
                        </div>
                        <div style={{
                          border: "1px solid #c9cccf",
                          borderRadius: "8px",
                          padding: "8px 12px",
                          minHeight: "40px",
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "8px",
                          alignItems: "center"
                        }}>
                          {tags.map((tag, index) => (
                            <Tag key={index} onRemove={() => handleRemoveTag(tag)}>
                              {tag}
                            </Tag>
                          ))}
                          <input
                            type="text"
                            placeholder="Example: sustainable, fashion, eco-friendly"
                            style={{
                              border: "none",
                              outline: "none",
                              flex: "1",
                              minWidth: "80px",
                              fontSize: "14px",
                              fontFamily: "inherit",
                              color: "inherit",
                              backgroundColor: "transparent"
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleAddTag(e.currentTarget.value);
                                e.currentTarget.value = '';
                              }
                            }}
                          />
                        </div>
                      </div>
                    </BlockStack>
                  </div>
                </Card>

                {/* Excerpt Section */}
                <Card>
                  <div style={{ padding: "0px", marginBottom: "8px" }}>
                    <InlineStack align="space-between">
                      <Text variant="headingMd" as="h3">Excerpt</Text>
                      <Button variant="plain">
                        Generate with AI
                      </Button>
                    </InlineStack>
                  </div>
                  <div>
                    <TextField
                      label=""
                      labelHidden
                      value={excerpt}
                      onChange={setExcerpt}
                      multiline={3}
                      placeholder="Enter excerpt..."
                    />
                  </div>
                </Card>

                {/* SEO Title Section */}
                <Card>
                  <div style={{ padding: "0px", marginBottom: "8px" }}>
                    <InlineStack align="space-between">
                      <Text variant="headingMd" as="h3">SEO title</Text>
                      <Button variant="plain">
                        Auto fill
                      </Button>
                    </InlineStack>
                  </div>
                  <div>
                    <BlockStack gap="200">
                      <TextField
                        label=""
                        labelHidden
                        value={seoTitle}
                        onChange={setSeoTitle}
                        placeholder="Enter SEO title..."
                        multiline={3}
                      />
                      <Text variant="bodySm" as="span">{seoTitleLength} characters</Text>
                    </BlockStack>
                  </div>
                </Card>

                {/* SEO Description Section */}
                <Card>
                  <div style={{ padding: "0px", marginBottom: "8px" }}>
                    <InlineStack align="space-between">
                      <Text variant="headingMd" as="h3">SEO description</Text>
                      <Button variant="plain">
                        Generate with AI
                      </Button>
                    </InlineStack>
                  </div>
                  <div>
                    <BlockStack gap="200">
                      <TextField
                        label=""
                        labelHidden
                        value={seoDescription}
                        onChange={setSeoDescription}
                        multiline={3}
                        placeholder="Enter SEO description..."
                      />
                      <Text variant="bodySm" as="span">{seoDescriptionLength} characters</Text>
                    </BlockStack>
                  </div>
                </Card>

                {/* URL and Handle Section */}
                <Card>
                  <div style={{ padding: "0px", marginBottom: "8px" }}>
                    <Text variant="headingMd" as="h3">URL and handle</Text>
                  </div>
                  <div>
                    <BlockStack gap="200">
                      <div style={{
                        border: "1px solid #c9cccf",
                        borderRadius: "8px",
                        padding: "6px 12px",
                        height: "32px",
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "#ffffff"
                      }}>
                        <input
                          type="text"
                          value={urlHandle}
                          onChange={(e) => setUrlHandle(e.target.value)}
                          placeholder="/blog/post-url"
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
                    </BlockStack>
                  </div>
                </Card>

                {/* Search Engine Listing Section */}
                <Card>
                  <div style={{ padding: "0px", marginBottom: "8px" }}>
                    <Text variant="headingMd" as="h3">Search engine listing</Text>
                  </div>
                  <div>
                    <BlockStack gap="200">
                      <div style={{
                        borderRadius: "8px",
                        padding: "12px",
                        backgroundColor: "#f6f6f7",
                        overflow: "hidden"
                      }}>
                        <BlockStack gap="200">
                          <div style={{ 
                            wordBreak: "break-word",
                            color: "#3739A1",
                            fontSize: "16px",
                            fontWeight: "600",
                            lineHeight: "1.4"
                          }}>
                            {seoTitle}
                          </div>
                          <div style={{ 
                            color: "#6d7175", 
                            fontSize: "12px",
                            wordBreak: "break-all",
                            overflowWrap: "break-word",
                            hyphens: "auto"
                          }}>
                            https://enipax.myshopify.com/blogs/news{urlHandle}
                          </div>
                          <div style={{ 
                            color: "#6d7175",
                            fontSize: "14px",
                            wordBreak: "break-word"
                          }}>
                            {seoDescription}
                          </div>
                        </BlockStack>
                      </div>
                    </BlockStack>
                  </div>
                </Card>
              </BlockStack>
            </div>
          </div>

          {/* Right Preview Section */}
          <div style={{ flex: 1, overflowY: "auto", backgroundColor: "#ffffff" }}>
            <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
              <BlockStack gap="400">
                {/* Rich Text Editor Toolbar */}
                <div style={{
                  border: "1px solid #c9cccf",
                  borderRadius: "8px",
                  padding: "12px",
                  backgroundColor: "#ffffff",
                  marginBottom: "16px",
                  position: "sticky",
                  top: "12px",
                  zIndex: "100",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
                }}>
                  <InlineStack gap="200" align="center">
                    {/* Paragraph Dropdown */}
                    <div style={{ position: "relative" }} data-paragraph-dropdown>
                      <div 
                        style={{ 
                          display: "flex", 
                          alignItems: "center", 
                          gap: "4px", 
                          cursor: activeSection === 'content' ? "pointer" : "not-allowed",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          backgroundColor: showParagraphDropdown ? "#f6f6f7" : "transparent",
                          opacity: activeSection === 'content' ? 1 : 0.5
                        }}
                        onClick={() => activeSection === 'content' && setShowParagraphDropdown(!showParagraphDropdown)}
                      >
                        <Text variant="bodySm" as="span">
                          {currentParagraphStyle === 'paragraph' ? 'Paragraph' :
                           currentParagraphStyle === 'h1' ? 'Heading 1' :
                           currentParagraphStyle === 'h2' ? 'Heading 2' :
                           currentParagraphStyle === 'h3' ? 'Heading 3' :
                           currentParagraphStyle === 'h4' ? 'Heading 4' :
                           currentParagraphStyle === 'h5' ? 'Heading 5' :
                           currentParagraphStyle === 'h6' ? 'Heading 6' :
                           currentParagraphStyle === 'blockquote' ? 'Quote' : 'Paragraph'}
                        </Text>
                        <Icon source={ChevronDownIcon} tone="base" />
                      </div>
                      
                      {showParagraphDropdown && (
                        <div style={{
                          position: "absolute",
                          top: "100%",
                          left: "0",
                          backgroundColor: "#ffffff",
                          border: "1px solid #e1e3e5",
                          borderRadius: "8px",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                          zIndex: "1000",
                          minWidth: "180px",
                          marginTop: "4px",
                          overflow: "hidden"
                        }}>
                          <div style={{ padding: "4px 0" }}>
                            {[
                              { value: 'paragraph', label: 'Paragraph', fontSize: '14px', fontWeight: '400' },
                              { value: 'h1', label: 'Heading 1', fontSize: '24px', fontWeight: '600' },
                              { value: 'h2', label: 'Heading 2', fontSize: '20px', fontWeight: '600' },
                              { value: 'h3', label: 'Heading 3', fontSize: '18px', fontWeight: '600' },
                              { value: 'h4', label: 'Heading 4', fontSize: '16px', fontWeight: '600' },
                              { value: 'h5', label: 'Heading 5', fontSize: '14px', fontWeight: '600' },
                              { value: 'h6', label: 'Heading 6', fontSize: '12px', fontWeight: '600' },
                              { value: 'blockquote', label: 'Quote', fontSize: '14px', fontWeight: '400', fontStyle: 'italic' }
                            ].map((style) => (
                              <div
                                key={style.value}
                                style={{
                                  padding: "8px 16px",
                                  cursor: "pointer",
                                  backgroundColor: currentParagraphStyle === style.value ? "#f6f6f7" : "transparent",
                                  fontSize: style.fontSize,
                                  fontWeight: style.fontWeight,
                                  fontStyle: style.fontStyle || 'normal',
                                  color: "#202223",
                                  borderBottom: "1px solid #f1f2f3",
                                  transition: "background-color 0.15s ease"
                                }}
                                onClick={() => {
                                  handleParagraphStyle(style.value);
                                  setCurrentParagraphStyle(style.value);
                                  setShowParagraphDropdown(false);
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f6f6f7"}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = currentParagraphStyle === style.value ? "#f6f6f7" : "transparent"}
                              >
                                {style.label}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Separator */}
                    <div style={{ width: "1px", height: "20px", backgroundColor: "#c9cccf" }} />

                    {/* Text Formatting */}
                    <Button 
                      variant="plain" 
                      size="slim" 
                      icon={TextBoldIcon} 
                      onClick={handleBold}
                      disabled={activeSection !== 'content'}
                      className={activeSection === 'content' ? 'toolbar-button-enabled' : 'toolbar-button-disabled'}
                    />
                    <Button 
                      variant="plain" 
                      size="slim" 
                      icon={TextItalicIcon} 
                      onClick={handleItalic}
                      disabled={activeSection !== 'content'}
                      className={activeSection === 'content' ? 'toolbar-button-enabled' : 'toolbar-button-disabled'}
                    />
                    <Button 
                      variant="plain" 
                      size="slim" 
                      icon={TextUnderlineIcon} 
                      onClick={handleUnderline}
                      disabled={activeSection !== 'content'}
                      className={activeSection === 'content' ? 'toolbar-button-enabled' : 'toolbar-button-disabled'}
                    />

                    {/* Separator */}
                    <div style={{ width: "1px", height: "20px", backgroundColor: "#c9cccf" }} />

                    {/* Lists and Alignment */}
                    <Button 
                      variant="plain" 
                      size="slim" 
                      icon={ListNumberedIcon} 
                      onClick={handleInsertNumberedList}
                      disabled={activeSection !== 'content'}
                      style={{
                        color: activeSection === 'content' ? '#000000' : '#8c9196'
                      }}
                    />
                    <Button 
                      variant="plain" 
                      size="slim" 
                      icon={ListBulletedIcon} 
                      onClick={handleInsertList}
                      disabled={activeSection !== 'content'}
                      style={{
                        color: activeSection === 'content' ? '#000000' : '#8c9196'
                      }}
                    />
                    <Button 
                      variant="plain" 
                      size="slim" 
                      icon={TextAlignLeftIcon} 
                      onClick={handleAlignLeft}
                      disabled={activeSection !== 'content'}
                      style={{
                        color: activeSection === 'content' ? '#000000' : '#8c9196'
                      }}
                    />
                    <Button 
                      variant="plain" 
                      size="slim" 
                      icon={TextAlignCenterIcon} 
                      onClick={handleAlignCenter}
                      disabled={activeSection !== 'content'}
                      style={{
                        color: activeSection === 'content' ? '#000000' : '#8c9196'
                      }}
                    />
                    <Button 
                      variant="plain" 
                      size="slim" 
                      icon={TextAlignRightIcon} 
                      onClick={handleAlignRight}
                      disabled={activeSection !== 'content'}
                      style={{
                        color: activeSection === 'content' ? '#000000' : '#8c9196'
                      }}
                    />

                    {/* Separator */}
                    <div style={{ width: "1px", height: "20px", backgroundColor: "#c9cccf" }} />

                    {/* Special Functions */}
                    <Button 
                      variant="plain" 
                      size="slim" 
                      icon={LinkIcon} 
                      onClick={handleInsertLink}
                      disabled={activeSection !== 'content'}
                      className={activeSection === 'content' ? 'toolbar-button-enabled' : 'toolbar-button-disabled'}
                    />
                    <Button 
                      variant="plain" 
                      size="slim" 
                      icon={CodeIcon}
                      disabled={activeSection !== 'content'}
                      className={activeSection === 'content' ? 'toolbar-button-enabled' : 'toolbar-button-disabled'}
                    />
                    <Button 
                      variant="plain" 
                      size="slim" 
                      icon={UndoIcon} 
                      onClick={handleUndo}
                      disabled={activeSection !== 'content'}
                      className={activeSection === 'content' ? 'toolbar-button-enabled' : 'toolbar-button-disabled'}
                    />
                    <Button 
                      variant="plain" 
                      size="slim" 
                      icon={RedoIcon} 
                      onClick={handleRedo}
                      disabled={activeSection !== 'content'}
                      className={activeSection === 'content' ? 'toolbar-button-enabled' : 'toolbar-button-disabled'}
                    />
                  </InlineStack>
                </div>

                {/* Main Title */}
                <h1 
                  contentEditable
                  onFocus={() => setActiveSection('title')}
                  onBlur={() => setActiveSection(null)}
                  onInput={(e) => setSeoTitle(e.currentTarget.textContent || '')}
                  style={{
                    fontSize: "32px",
                    fontWeight: "bold",
                    lineHeight: "1.2",
                    margin: "0 0 24px 0",
                    color: "#202223",
                    outline: "none",
                    border: activeSection === 'title' ? "2px solid #5c6ac4" : "2px solid transparent",
                    borderRadius: "4px",
                    padding: activeSection === 'title' ? "8px" : "8px",
                    backgroundColor: activeSection === 'title' ? "#f6f6f7" : "transparent"
                  }}
                  suppressContentEditableWarning={true}
                />

                {/* Featured Image */}
                {selectedImageUrl ? (
                  <div style={{
                    overflow: "hidden"
                  }}>
                    <img 
                      src={selectedImageUrl} 
                      alt={imageAlt || "Featured image"}
                      style={{
                        width: "100%",
                        height: "auto",
                        maxHeight: "400px",
                        objectFit: "cover"
                      }}
                    />
                  </div>
                ) : (
                  <div style={{
                    border: "2px dashed #c9cccf",
                    borderRadius: "8px",
                    padding: "60px 20px",
                    textAlign: "center",
                    backgroundColor: "#f6f6f7"
                  }}>
                    <InlineStack gap="200" align="center">
                      <Button variant="secondary" size="slim" icon={UploadIcon} style={{ width: "fit-content" }} onClick={handleUploadFile}>
                        Upload file
                      </Button>
                      <Button variant="secondary" size="slim" icon={CursorOptionIcon} style={{ width: "fit-content" }} onClick={handleSelectFromLibrary}>
                        Select from library
                      </Button>
                    </InlineStack>
                  </div>
                )}

                {/* Blog Content */}
                <div
                  ref={contentEditableRef}
                  contentEditable
                  onInput={(e) => setBlogContent(e.currentTarget.innerHTML)}
                  onFocus={() => {
                    console.log('onFocus triggered');
                    setActiveSection('content');
                  }}
                  onClick={ensureContentFocus}
                  style={{
                    minHeight: "400px",
                    padding: "16px",
                    border: activeSection === 'content' ? "2px solid #5c6ac4" : "1px solid #e1e3e5",
                    borderRadius: "8px",
                    backgroundColor: "#ffffff",
                    outline: "none",
                    fontSize: "16px",
                    lineHeight: "1.6",
                    fontFamily: "inherit",
                    color: "#202223",
                    cursor: "text"
                  }}
                  className="rich-text-editor"
                />
              </BlockStack>
            </div>
          </div>
        </div>
      </div>

      {/* Image Library Modal */}
      {showImageLibrary && (
        <Modal
          open={showImageLibrary}
          onClose={() => setShowImageLibrary(false)}
          title="Select image"
          primaryAction={{
            content: 'Select',
            onAction: handleConfirmImageSelection,
            disabled: !tempSelectedImage
          }}
          secondaryActions={[
            {
              content: 'Cancel',
              onAction: () => setShowImageLibrary(false),
            }
          ]}
        >
          <Modal.Section>
            <BlockStack gap="400">
              {/* Search Bar */}
              <div style={{ position: "relative" }}>
                <div style={{
                  border: "1px solid #c9cccf",
                  borderRadius: "8px",
                  padding: "6px 12px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#ffffff"
                }}>
                  <Icon source={SearchIcon} tone="base" style={{ marginRight: "8px" }} />
                  <input
                    type="text"
                    placeholder="Search"
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

              {/* Image Table */}
              {isLoadingImages ? (
                <div style={{ textAlign: "center", padding: "40px" }}>
                  <Text variant="bodyMd">Loading images from Shopify...</Text>
                </div>
              ) : (
                <div style={{ 
                  border: "1px solid #e1e3e5",
                  borderRadius: "8px",
                  overflow: "hidden"
                }}>
                  {/* Table Header */}
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "60px 1fr 2fr",
                    backgroundColor: "#f6f6f7",
                    borderBottom: "1px solid #e1e3e5",
                    padding: "12px 16px",
                    fontWeight: "bold"
                  }}>
                    <Text variant="bodySm" as="span">Action</Text>
                    <Text variant="bodySm" as="span">Thumbnail</Text>
                    <Text variant="bodySm" as="span">File name</Text>
                  </div>

                  {/* Table Rows */}
                  <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                    {shopifyImages.map((asset) => (
                      <div 
                        key={asset.id}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "60px 1fr 2fr",
                          borderBottom: "1px solid #e1e3e5",
                          padding: "12px 16px",
                          alignItems: "center",
                          cursor: "pointer",
                          transition: "background-color 0.2s"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f6f6f7"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                      >
                        {/* Action Column */}
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <input
                            type="checkbox"
                            checked={tempSelectedImage?.id === asset.id}
                            onChange={() => handleSelectLibraryImage(asset)}
                            style={{ margin: 0, cursor: "pointer" }}
                          />
                        </div>

                        {/* Thumbnail Column */}
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <img 
                            src={asset.public_url} 
                            alt={asset.alt || asset.key}
                            style={{
                              width: "60px",
                              height: "60px",
                              objectFit: "cover",
                              borderRadius: "4px"
                            }}
                          />
                        </div>

                        {/* File Name Column */}
                        <div>
                          <Text variant="bodyMd" as="span">
                            {asset.key || `image-${asset.id}.jpg`}
                          </Text>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </BlockStack>
          </Modal.Section>
        </Modal>
      )}
    </Modal>
  );
};

export default BlogContentCreation;
