import React from 'react';
import { Page, Layout, Card, TextContainer, Heading } from '@shopify/polaris';

export function SettingsPage() {
  return (
    <Page title="Settings">
      <Layout>
        <Layout.Section>
          <Card>
            <TextContainer>
              <Heading>Settings</Heading>
              <p>Configure your Blog AI app settings.</p>
            </TextContainer>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
