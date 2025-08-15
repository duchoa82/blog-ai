import {
  Page,
  Card,
  Button,
  TextField,
  Select,
  Layout,
  BlockStack,
  Text,
  ChoiceList,
  Checkbox,
  Icon
} from "@shopify/polaris";
import {
  KeyIcon,
  SaveIcon,
  ChartHistogramFlatIcon,
  ContentIcon,
  GlobeIcon
} from "@shopify/polaris-icons";
import { useState } from "react";

const Settings = () => {
  const [isSaving, setIsSaving] = useState(false);

  const writingStyleOptions = [
    { label: "Casual", value: "casual" },
    { label: "Professional", value: "professional" },
    { label: "Conversational", value: "conversational" },
    { label: "Technical", value: "technical" }
  ];

  const voiceToneOptions = [
    { label: "Friendly", value: "friendly" },
    { label: "Authoritative", value: "authoritative" },
    { label: "Enthusiastic", value: "enthusiastic" },
    { label: "Informative", value: "informative" }
  ];

  const handleSave = () => {
    setIsSaving(true);
    // Simulate save operation
    setTimeout(() => {
      setIsSaving(false);
      alert("Settings saved successfully!");
    }, 1000);
  };

  const primaryAction = {
    content: isSaving ? 'Saving...' : 'Save Changes',
    icon: SaveIcon,
    onAction: handleSave,
    loading: isSaving,
  };

  return (
    <Page
      title="Settings"
      subtitle="Configure your AI blog generation preferences and API integrations"
      primaryAction={primaryAction}
    >
      <Layout>
        <Layout.Section>
          <BlockStack gap="400">
            <Card>
              <div style={{ padding: "16px" }}>
                <Text variant="headingMd" as="h3">API Configuration</Text>
              </div>
              <div style={{ padding: "0 16px 16px" }}>
                <BlockStack gap="200">
                  <TextField
                    label="OpenAI API Key"
                    type="password"
                    placeholder="Example: sk-1234567890abcdef..."
                    helpText="Required for AI content generation"
                    autoComplete="off"
                  />
                  
                  <TextField
                    label="Keyword Research API"
                    type="password"
                    placeholder="Example: api_key_1234567890abcdef..."
                    autoComplete="off"
                  />
                  
                  <TextField
                    label="Shopify Admin API Token"
                    type="password"
                    placeholder="shpat_..."
                    autoComplete="off"
                  />
                </BlockStack>
              </div>
            </Card>

            <Card>
              <div style={{ padding: "16px" }}>
                <Text variant="headingMd" as="h3">Default Generation Settings</Text>
              </div>
              <div style={{ padding: "0 16px 16px" }}>
                <BlockStack gap="200">
                  <Select
                    label="Default Writing Style"
                    options={writingStyleOptions}
                    value="casual"
                  />
                  
                  <Select
                    label="Default Voice Tone"
                    options={voiceToneOptions}
                    value="friendly"
                  />
                  
                  <Checkbox
                    label="Auto-generate SEO meta data"
                    helpText="Automatically create titles and descriptions"
                    checked
                  />
                  
                  <Checkbox
                    label="Include internal linking suggestions"
                    helpText="AI will suggest links to other products"
                    checked
                  />
                </BlockStack>
              </div>
            </Card>
          </BlockStack>
        </Layout.Section>

        <Layout.Section>
          <BlockStack gap="400">
            <Card>
              <div style={{ padding: "16px" }}>
                <Text variant="headingMd" as="h3">Blog Post Templates</Text>
              </div>
              <div style={{ padding: "0 16px 16px" }}>
                <BlockStack gap="200">
                  <TextField
                    label="Default Article Structure"
                    multiline={6}
                    placeholder="1. Introduction&#10;2. Product Overview&#10;3. Key Features&#10;4. Benefits&#10;5. Use Cases&#10;6. Conclusion with CTA"
                    autoComplete="off"
                  />
                  
                  <TextField
                    label="Call-to-Action Template"
                    multiline={3}
                    placeholder="Ready to experience the difference? Shop our [PRODUCT_NAME] collection today and enjoy free shipping on orders over $50!"
                    autoComplete="off"
                  />
                </BlockStack>
              </div>
            </Card>

            <Card>
              <div style={{ padding: "16px" }}>
                <Text variant="headingMd" as="h3">SEO Defaults</Text>
              </div>
              <div style={{ padding: "0 16px 16px" }}>
                <BlockStack gap="200">
                  <TextField
                    label="Business Name"
                    placeholder="Your Store Name"
                    autoComplete="off"
                  />
                  
                  <TextField
                    label="Brand Description"
                    multiline={3}
                    placeholder="A brief description of your brand and what makes it unique..."
                    autoComplete="off"
                  />
                  
                  <TextField
                    label="Default Target Audience"
                    placeholder="e.g., Fashion-conscious millennials, Tech enthusiasts, etc."
                    autoComplete="off"
                  />
                  
                  <Checkbox
                    label="Include schema markup"
                    helpText="Add structured data for better SEO"
                    checked
                  />
                </BlockStack>
              </div>
            </Card>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default Settings;