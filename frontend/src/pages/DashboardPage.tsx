import React from 'react';
import { Page, Layout, Card, TextContainer, Heading, Button } from '@shopify/polaris';

interface DashboardPageProps {
  shopInfo?: {
    shop: string;
    host: string;
  };
}

export default function DashboardPage({ shopInfo }: DashboardPageProps) {
  return (
    <Page title="Blog AI - Home">
      <Layout>
        <Layout.Section>
          <Card>
            <TextContainer>
              <Heading>Welcome to Blog AI!</Heading>
              <p>Your AI-powered blog writing assistant for Shopify.</p>
              <p>Create engaging content, manage templates, and boost your SEO with AI-generated blog posts.</p>
              
              {shopInfo && (
                <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f6f6f7', borderRadius: '4px' }}>
                  <p><strong>Shop:</strong> {shopInfo.shop}</p>
                  <p><strong>Host:</strong> {shopInfo.host}</p>
                </div>
              )}
            </TextContainer>
          </Card>
        </Layout.Section>
        
        <Layout.Section secondary>
          <Card>
            <TextContainer>
              <Heading>Quick Actions</Heading>
              <Button primary fullWidth>Create Template</Button>
              <Button fullWidth style={{ marginTop: '1rem' }}>View Templates</Button>
              <Button fullWidth style={{ marginTop: '1rem' }}>App Settings</Button>
            </TextContainer>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
