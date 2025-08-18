import React from 'react';
import { Page, Layout, Card, TextContainer, Heading } from '@shopify/polaris';

export function PostsPage() {
  return (
    <Page title="Blog Posts">
      <Layout>
        <Layout.Section>
          <Card>
            <TextContainer>
              <Heading>Blog Posts</Heading>
              <p>Manage your blog posts and content.</p>
            </TextContainer>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
