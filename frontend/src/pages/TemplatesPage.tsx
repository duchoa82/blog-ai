import React from 'react';
import { Page, Layout, Card, TextContainer, Heading, Button, Stack } from '@shopify/polaris';

export default function TemplatesPage() {
  return (
    <Page title="Templates">
      <Layout>
        <Layout.Section>
          <Card>
            <TextContainer>
              <Heading>Templates Management</Heading>
              <p>Manage your blog post templates here. Create, edit, and organize templates for different types of content.</p>
              
              <Stack distribution="equalSpacing" alignment="center">
                <Button primary>Create New Template</Button>
                <Button>Import Templates</Button>
              </Stack>
            </TextContainer>
          </Card>
        </Layout.Section>
        
        <Layout.Section secondary>
          <Card>
            <TextContainer>
              <Heading>Quick Actions</Heading>
              <p>Quick access to common template operations.</p>
              <Button fullWidth>View All Templates</Button>
              <Button fullWidth style={{ marginTop: '1rem' }}>Template Categories</Button>
            </TextContainer>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
