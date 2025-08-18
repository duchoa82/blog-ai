import React from 'react';
import { Page, Layout, Card, TextContainer, Heading } from '@shopify/polaris';

export function ProductsPage() {
  return (
    <Page title="Products">
      <Layout>
        <Layout.Section>
          <Card>
            <TextContainer>
              <Heading>Products</Heading>
              <p>Manage your Shopify products.</p>
            </TextContainer>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
