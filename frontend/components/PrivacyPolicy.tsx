import React from 'react';
import {
  Page,
  Card,
  Text,
  BlockStack,
  InlineStack,
  Button,
  Badge,
  Divider,
  List
} from '@shopify/polaris';

interface PrivacyPolicyProps {
  onAccept: () => void;
  onDecline: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onAccept, onDecline }) => {
  return (
    <Page title="Privacy & Data Protection Policy">
      <BlockStack gap="400">
        <Card>
          <BlockStack gap="400">
            <Text variant="headingMd" as="h2">
              How We Handle Your Store's Data
            </Text>
            
            <Text variant="bodyMd" as="p">
              This privacy policy explains how BlogBot Buddy collects, uses, and protects data from your Shopify store 
              to provide AI-powered blog generation services.
            </Text>

            <Divider />

            <Text variant="headingMd" as="h3">
              Data We Collect
            </Text>

            <List type="bullet">
              <List.Item>
                <Text variant="bodyMd">
                  <strong>Product Information:</strong> Product names, descriptions, images, and categories to generate relevant blog content
                </Text>
              </List.Item>
              <List.Item>
                <Text variant="bodyMd">
                  <strong>Store Analytics:</strong> Basic store performance metrics to improve blog recommendations
                </Text>
              </List.Item>
              <List.Item>
                <Text variant="bodyMd">
                  <strong>Customer Data:</strong> Only when explicitly needed for blog personalization (with your consent)
                </Text>
              </List.Item>
            </List>

            <Divider />

            <Text variant="headingMd" as="h3">
              How We Use Your Data
            </Text>

            <List type="bullet">
              <List.Item>
                <Text variant="bodyMd">
                  Generate AI-powered blog posts relevant to your products and audience
                </Text>
              </List.Item>
              <List.Item>
                <Text variant="bodyMd">
                  Improve blog content quality and relevance over time
                </Text>
              </List.Item>
              <List.Item>
                <Text variant="bodyMd">
                  Provide personalized content recommendations
                </Text>
              </List.Item>
            </List>

            <Divider />

            <Text variant="headingMd" as="h3">
              Data Protection Measures
            </Text>

            <BlockStack gap="200">
              <InlineStack gap="200" align="start">
                <Badge tone="success">Encryption</Badge>
                <Text variant="bodyMd">All data is encrypted in transit and at rest</Text>
              </InlineStack>
              
              <InlineStack gap="200" align="start">
                <Badge tone="success">Access Control</Badge>
                <Text variant="bodyMd">Limited staff access to customer data</Text>
              </InlineStack>
              
              <InlineStack gap="200" align="start">
                <Badge tone="success">Audit Logging</Badge>
                <Text variant="bodyMd">All data access is logged and monitored</Text>
              </InlineStack>
              
              <InlineStack gap="200" align="start">
                <Badge tone="success">Data Retention</Badge>
                <Text variant="bodyMd">Customer data is automatically deleted after 30 days</Text>
              </InlineStack>
            </BlockStack>

            <Divider />

            <Text variant="headingMd" as="h3">
              Your Rights & Controls
            </Text>

            <List type="bullet">
              <List.Item>
                <Text variant="bodyMd">
                  <strong>Consent Management:</strong> You control what customer data we can access
                </Text>
              </List.Item>
              <List.Item>
                <Text variant="bodyMd">
                  <strong>Data Deletion:</strong> Request deletion of your store's data at any time
                </Text>
              </List.Item>
              <List.Item>
                <Text variant="bodyMd">
                  <strong>Access Logs:</strong> View logs of how your data has been used
                </Text>
              </List.Item>
              <List.Item>
                <Text variant="bodyMd">
                  <strong>Opt-out:</strong> Customers can opt-out of data processing for personalization
                </Text>
              </List.Item>
            </List>

            <Divider />

            <Text variant="headingMd" as="h3">
              Compliance & Certifications
            </Text>

            <BlockStack gap="200">
              <InlineStack gap="200" align="start">
                <Badge tone="info">Shopify Protected Data</Badge>
                <Text variant="bodyMd">Compliant with Shopify's protected customer data requirements</Text>
              </InlineStack>
              
              <InlineStack gap="200" align="start">
                <Badge tone="info">GDPR Ready</Badge>
                <Text variant="bodyMd">Supports EU data protection regulations</Text>
              </InlineStack>
              
              <InlineStack gap="200" align="start">
                <Badge tone="info">CCPA Compliant</Badge>
                <Text variant="bodyMd">Meets California consumer privacy requirements</Text>
              </InlineStack>
            </BlockStack>

            <Divider />

            <Text variant="bodyMd" as="p" tone="subdued">
              By accepting this policy, you agree to our data processing practices and grant us permission 
              to access the minimum data required to provide blog generation services for your store.
            </Text>

            <InlineStack gap="200" justify="end">
              <Button variant="secondary" onClick={onDecline}>
                Decline
              </Button>
              <Button variant="primary" onClick={onAccept}>
                Accept & Continue
              </Button>
            </InlineStack>
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  );
};
