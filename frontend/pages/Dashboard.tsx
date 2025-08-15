import {
  Page,
  Card,
  Button,
  Badge,
  Layout,
  Text,
  BlockStack,
  InlineStack,
  Grid,
  Icon,
  TextField,
  Tabs,
  Link,
  Select,
  ChoiceList
} from "@shopify/polaris";
import {
  ChartHistogramFlatIcon,
  ProductIcon,
  CalendarIcon,
  ViewIcon,
  PlusIcon,
  InfoIcon,
  QuestionCircleIcon,
  SettingsIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from "@shopify/polaris-icons";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getBusinessDescription, getTargetCustomer, setBusinessDescription as setSharedBusinessDescription, setTargetCustomer as setSharedTargetCustomer } from "../lib/sharedData";

const Dashboard = () => {
  const navigate = useNavigate();
  const [businessDescription, setBusinessDescription] = useState("");
  const [targetCustomer, setTargetCustomer] = useState("");
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedCreditTab, setSelectedCreditTab] = useState(0);
  const [isSetupExpanded, setIsSetupExpanded] = useState(true);
  
  // Brand Voice Setup states
  const [selectedTones, setSelectedTones] = useState<string[]>([]);
  const [formalityLevel, setFormalityLevel] = useState("");
  const [selectedPersonalities, setSelectedPersonalities] = useState<string[]>([]);

  // Load shared data on component mount
  useEffect(() => {
    setBusinessDescription(getBusinessDescription());
    setTargetCustomer(getTargetCustomer());
  }, []);

  // Handle business description change
  const handleBusinessDescriptionChange = (value: string) => {
    setBusinessDescription(value);
    setSharedBusinessDescription(value);
  };

  // Handle target customer change
  const handleTargetCustomerChange = (value: string) => {
    setTargetCustomer(value);
    setSharedTargetCustomer(value);
  };
  
  const stats = [
    { label: "Total posts created", value: "1", icon: ChartHistogramFlatIcon, trend: "+12%" },
    { label: "Visible posts", value: "1", icon: ViewIcon, trend: "+3%" },
    { label: "Hidden posts", value: "0", icon: ProductIcon, trend: "+25%" },
  ];

  const primaryAction = {
    content: 'Generate New Post',
    icon: PlusIcon,
    onAction: () => navigate('/generate'),
  };

  const tabs = [
    {
      id: 'published',
      content: 'Published',
      accessibilityLabel: 'Published posts',
      panelID: 'published-panel',
    },
    {
      id: 'draft',
      content: 'Draft',
      accessibilityLabel: 'Draft posts',
      panelID: 'draft-panel',
    },
  ];

  const creditTabs = [
    {
      id: 'monthly',
      content: 'Monthly',
      accessibilityLabel: 'Monthly credits',
      panelID: 'monthly-panel',
    },
    {
      id: 'lifetime',
      content: 'Lifetime',
      accessibilityLabel: 'Lifetime credits',
      panelID: 'lifetime-panel',
    },
  ];

  const brandVoiceOptions = {
    tones: [
      { label: 'Inspirational', value: 'inspirational' },
      { label: 'Professional', value: 'professional' },
      { label: 'Casual', value: 'casual' },
      { label: 'Friendly', value: 'friendly' },
      { label: 'Authoritative', value: 'authoritative' }
    ],
    formalityLevels: [
      { label: 'Formal', value: 'formal' },
      { label: 'Semi-formal', value: 'semi-formal' },
      { label: 'Casual', value: 'casual' }
    ],
    personalities: [
      { label: 'Energetic', value: 'energetic' },
      { label: 'Calm', value: 'calm' },
      { label: 'Creative', value: 'creative' },
      { label: 'Analytical', value: 'analytical' },
      { label: 'Empathetic', value: 'empathetic' }
    ]
  };

  return (
    <Page
      title="Dashboard"
      subtitle="Monitor your blog performance and manage content creation"
      primaryAction={primaryAction}
    >
      <div style={{ 
        maxWidth: "990px", 
        margin: "0 auto",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        <Layout>
          {/* Onboarding Section */}
          <Layout.Section>
            <Card>
              <div style={{ padding: "16px" }}>
                <InlineStack align="space-between">
                  <BlockStack gap="100">
                    <Text variant="headingMd" as="h3">Brand Voice Setup</Text>
                    <Text variant="bodyMd" tone="subdued" as="span">
                      Configure your brand's voice and personality for AI content generation.
                    </Text>
                  </BlockStack>
                  <div 
                    style={{ 
                      width: "32px", 
                      height: "32px", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      cursor: "pointer",
                      borderRadius: "4px",
                      backgroundColor: "var(--p-surface)",
                      border: "1px solid var(--p-border)",
                      transition: "background-color 0.2s ease"
                    }}
                    onClick={() => setIsSetupExpanded(!isSetupExpanded)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--p-surface-hovered)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--p-surface)";
                    }}
                  >
                    <Icon 
                      source={isSetupExpanded ? ChevronUpIcon : ChevronDownIcon} 
                      tone="base" 
                    />
                  </div>
                </InlineStack>
              </div>
              {isSetupExpanded && (
                <div style={{ padding: "0 16px 16px" }}>
                  <BlockStack gap="400">
                    {/* Brand Voice Setup */}
                    <BlockStack gap="200">
                      <InlineStack gap="400" align="start">
                        {/* Tone Selection */}
                        <div style={{ flex: "1" }}>
                          <Select
                            label="Tone"
                            options={brandVoiceOptions.tones}
                            value={selectedTones[0] || ""}
                            onChange={(value) => setSelectedTones(value ? [value] : [])}
                          />
                        </div>
                        
                        {/* Formality Level */}
                        <div style={{ flex: "1" }}>
                          <Select
                            label="Formality Level"
                            options={brandVoiceOptions.formalityLevels}
                            value={formalityLevel}
                            onChange={setFormalityLevel}
                          />
                        </div>
                        
                        {/* Brand Personality */}
                        <div style={{ flex: "1" }}>
                          <Select
                            label="Brand Personality"
                            options={brandVoiceOptions.personalities}
                            value={selectedPersonalities[0] || ""}
                            onChange={(value) => setSelectedPersonalities(value ? [value] : [])}
                          />
                        </div>
                      </InlineStack>
                    </BlockStack>
                    
                    <BlockStack gap="200">
                      <InlineStack gap="400" align="start">
                        <div style={{ flex: "1" }}>
                          <TextField
                            label="Business description"
                            value={businessDescription}
                            onChange={handleBusinessDescriptionChange}
                            placeholder="Example: Premium cotton t-shirts and sustainable fashion for eco-conscious consumers"
                            multiline={3}
                            maxLength={500}
                            showCharacterCount
                            autoComplete="off"
                          />
                        </div>
                        <div style={{ flex: "1" }}>
                          <TextField
                            label="Target customer"
                            value={targetCustomer}
                            onChange={handleTargetCustomerChange}
                            placeholder="Example: Young professionals aged 25-40 who value sustainability and style"
                            multiline={3}
                            maxLength={500}
                            showCharacterCount
                            autoComplete="off"
                          />
                        </div>
                      </InlineStack>
                    </BlockStack>
                  </BlockStack>
                </div>
              )}
            </Card>
          </Layout.Section>

          {/* Stats Cards - Centered */}
          <Layout.Section>
            <div style={{ display: "flex", gap: "16px" }}>
              {/* Total posts created card - 1/3 width */}
              <div style={{ flex: "1", minWidth: "0" }}>
                <Card>
                  <div style={{ padding: "16px", textAlign: "left" }}>
                    <div style={{ fontWeight: "bold", fontSize: "calc(1rem + 8px)" }}>
                      <Text variant="bodyMd" tone="subdued" as="span">
                        Total posts created
                      </Text>
                    </div>
                    <div style={{ marginTop: "24px" }}>
                      <div style={{ fontSize: "2em", fontWeight: "bold" }}>
                        <Text variant="headingXl" as="h2">
                          1
                        </Text>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Visible and Hidden posts card - 2/3 width */}
              <div style={{ flex: "2", minWidth: "0" }}>
                <Card>
                  <div style={{ padding: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      {/* Visible posts */}
                      <div style={{ flex: 1, textAlign: "left", borderRight: "1px solid #e1e3e5", paddingRight: "16px" }}>
                        <div style={{ fontWeight: "bold", fontSize: "calc(1rem + 8px)" }}>
                          <Text variant="bodyMd" tone="subdued" as="span">
                            Visible posts
                          </Text>
                        </div>
                        <div style={{ marginTop: "24px" }}>
                          <div style={{ fontSize: "2em", fontWeight: "bold" }}>
                            <Text variant="headingXl" as="h2">
                              1
                            </Text>
                          </div>
                        </div>
                      </div>

                      {/* Hidden posts */}
                      <div style={{ flex: 1, textAlign: "left", paddingLeft: "16px" }}>
                        <div style={{ fontWeight: "bold", fontSize: "calc(1rem + 8px)" }}>
                          <Text variant="bodyMd" tone="subdued" as="span">
                            Hidden posts
                          </Text>
                        </div>
                        <div style={{ marginTop: "24px" }}>
                          <div style={{ fontSize: "2em", fontWeight: "bold" }}>
                            <Text variant="headingXl" as="h2">
                              0
                            </Text>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </Layout.Section>

          {/* Support Section */}
          <Layout.Section>
            <Grid>
              <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                <Card>
                  <div style={{ padding: "16px", textAlign: "left" }}>
                    <div style={{ marginBottom: "16px" }}>
                      <Text variant="headingMd" fontWeight="semibold" as="h4">
                        Help Center
                      </Text>
                    </div>
                    <div style={{ marginBottom: "8px" }}>
                      <Text variant="bodyMd" tone="subdued" as="span">
                        Find quick answers in detailed tutorials and frequently asked questions.
                      </Text>
                    </div>
                    <Link url="#" removeUnderline>
                      Help Center
                    </Link>
                  </div>
                </Card>
              </Grid.Cell>
              
              <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
                <Card>
                  <div style={{ padding: "16px", textAlign: "left" }}>
                    <div style={{ marginBottom: "16px" }}>
                      <Text variant="headingMd" fontWeight="semibold" as="h4">
                        Customer support
                      </Text>
                    </div>
                    <div style={{ marginBottom: "8px" }}>
                      <Text variant="bodyMd" tone="subdued" as="span">
                        Find quick answers in detailed tutorials and frequently asked questions.
                      </Text>
                    </div>
                    <Link url="#" removeUnderline>
                      Open chat
                    </Link>
                  </div>
                </Card>
              </Grid.Cell>
            </Grid>
          </Layout.Section>
        </Layout>
      </div>
    </Page>
  );
};

export default Dashboard;