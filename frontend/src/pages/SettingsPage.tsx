import React from 'react';
import { Page, Layout, Card, TextContainer, Heading, Button, Stack, FormLayout, TextField, Select } from '@shopify/polaris';

export default function SettingsPage() {
  return (
    <Page title="Settings">
      <Layout>
        <Layout.Section>
          <Card>
            <TextContainer>
              <Heading>App Settings</Heading>
              <p>Configure your Blog AI app settings and preferences.</p>
              
              <FormLayout>
                <TextField
                  label="API Key"
                  value="98d5cae75b3fdce1011668a7b6bdc8e2"
                  readOnly
                  helpText="Your Shopify app API key"
                />
                
                <Select
                  label="Default Language"
                  options={[
                    {label: 'English', value: 'en'},
                    {label: 'Spanish', value: 'es'},
                    {label: 'French', value: 'fr'},
                    {label: 'German', value: 'de'}
                  ]}
                  value="en"
                />
                
                <Select
                  label="Content Tone"
                  options={[
                    {label: 'Professional', value: 'professional'},
                    {label: 'Casual', value: 'casual'},
                    {label: 'Friendly', value: 'friendly'},
                    {label: 'Formal', value: 'formal'}
                  ]}
                  value="professional"
                />
              </FormLayout>
              
              <Stack distribution="equalSpacing" alignment="center" style={{ marginTop: '2rem' }}>
                <Button primary>Save Settings</Button>
                <Button>Reset to Default</Button>
              </Stack>
            </TextContainer>
          </Card>
        </Layout.Section>
        
        <Layout.Section secondary>
          <Card>
            <TextContainer>
              <Heading>Account Info</Heading>
              <p>Your app account information and status.</p>
              <Button fullWidth>View Account Details</Button>
              <Button fullWidth style={{ marginTop: '1rem' }}>Billing Information</Button>
            </TextContainer>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
