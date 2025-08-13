import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Page,
  Layout,
} from "@shopify/polaris";
import { SEOConfiguration } from "../components/SEOConfiguration";
import BlogContentCreation from "./BlogContentCreation";
import { getBusinessDescription, getTargetCustomer, setBusinessDescription as setSharedBusinessDescription, setTargetCustomer as setSharedTargetCustomer } from "../lib/sharedData";

const BlogGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showBlogContentCreation, setShowBlogContentCreation] = useState(false);
  const [businessDescription, setBusinessDescription] = useState("");
  const [targetCustomer, setTargetCustomer] = useState("");
  const [generatedBlogContent, setGeneratedBlogContent] = useState<string>("");
  const [blogTitle, setBlogTitle] = useState<string>("");
  const navigate = useNavigate();

  // Load shared data on component mount
  useEffect(() => {
    setBusinessDescription(getBusinessDescription());
    setTargetCustomer(getTargetCustomer());
  }, []);

  const handleGenerate = (generatedContent?: string, title?: string) => {
    if (generatedContent) {
      // Store the generated content
      setGeneratedBlogContent(generatedContent);
      // Store the blog title
      if (title) {
        setBlogTitle(title);
      }
      // Show the blog content creation modal
      setShowBlogContentCreation(true);
    } else {
      // Fallback for when no content is generated
      setIsGenerating(true);
      setTimeout(() => {
        setIsGenerating(false);
        setShowBlogContentCreation(true);
      }, 3000);
    }
  };

  const handleBusinessDescriptionChange = (value: string) => {
    setBusinessDescription(value);
    setSharedBusinessDescription(value);
  };

  const handleTargetCustomerChange = (value: string) => {
    setTargetCustomer(value);
    setSharedTargetCustomer(value);
  };

  const backAction = {
    content: 'Dashboard',
    onAction: () => navigate('/'),
  };

  return (
    <>
      <Page
        title="Generate Blog Post"
        subtitle="Configure SEO settings and generate AI-powered content"
        backAction={backAction}
      >
        <Layout>
          <Layout.Section>
            <SEOConfiguration
              businessDescription={businessDescription}
              targetCustomer={targetCustomer}
              onBusinessDescriptionChange={handleBusinessDescriptionChange}
              onTargetCustomerChange={handleTargetCustomerChange}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
            />
          </Layout.Section>
        </Layout>
      </Page>
      
      <BlogContentCreation
        isOpen={showBlogContentCreation}
        onClose={() => setShowBlogContentCreation(false)}
        generatedContent={generatedBlogContent}
        blogTitle={blogTitle}
      />
    </>
  );
};

export default BlogGeneration;