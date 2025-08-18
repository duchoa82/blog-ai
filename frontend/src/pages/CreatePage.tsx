import React from 'react';
import { Page, Layout, Card, TextContainer, Heading } from '@shopify/polaris';

export function CreatePage() {
  return (
    <Page title="Create Blog Post">
      <Layout>
        <Layout.Section>
          <Card>
            <TextContainer>
              <Heading>Create New Blog Post</Heading>
              <p>Use AI to generate engaging blog content.</p>
            </TextContainer>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
