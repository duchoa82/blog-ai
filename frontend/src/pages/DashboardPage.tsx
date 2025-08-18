import React from 'react';
import { Page, Layout, Card, Button, TextContainer, Heading } from '@shopify/polaris';

export function DashboardPage() {
  return (
    <Page title="Blog AI Dashboard">
      <Layout>
        <Layout.Section>
          <Card>
            <TextContainer>
              <Heading>Welcome to Blog AI!</Heading>
              <p>Your AI-powered blog writing assistant for Shopify.</p>
            </TextContainer>
          </Card>
        </Layout.Section>
        
        <Layout.Section secondary>
          <Card>
            <TextContainer>
              <Heading>Quick Actions</Heading>
              <Button primary fullWidth>Create New Post</Button>
              <Button fullWidth style={{ marginTop: '1rem' }}>View Analytics</Button>
            </TextContainer>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
