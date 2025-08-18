import React from 'react';
import { Page, Layout, Card, TextContainer, Heading } from '@shopify/polaris';

export function AnalyticsPage() {
  return (
    <Page title="Analytics">
      <Layout>
        <Layout.Section>
          <Card>
            <TextContainer>
              <Heading>Analytics</Heading>
              <p>View your blog performance metrics.</p>
            </TextContainer>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
