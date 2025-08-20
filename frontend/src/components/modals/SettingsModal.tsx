import React, { useState } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: any) => void;
}

interface Settings {
  aiProvider: string;
  apiKey: string;
  language: string;
  tone: string;
  maxLength: number;
  autoSave: boolean;
  notifications: boolean;
}

const defaultSettings: Settings = {
  aiProvider: 'openai',
  apiKey: '',
  language: 'en',
  tone: 'professional',
  maxLength: 1000,
  autoSave: true,
  notifications: true
};

const aiProviders = [
  { value: 'openai', label: 'OpenAI GPT-4' },
  { value: 'claude', label: 'Anthropic Claude' },
  { value: 'gemini', label: 'Google Gemini' },
  { value: 'custom', label: 'Custom API' }
];

const languages = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'zh', label: 'Chinese' }
];

const tones = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'formal', label: 'Formal' },
  { value: 'creative', label: 'Creative' },
  { value: 'technical', label: 'Technical' }
];

export default function SettingsModal({ isOpen, onClose, onSave }: SettingsModalProps) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'ai' | 'advanced'>('general');

  const handleInputChange = (field: keyof Settings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(settings);
      onClose();
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setSettings(defaultSettings);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
      }}>
        {/* Header */}
        <div style={{
          padding: '1rem 1.5rem',
          borderBottom: '1px solid #e1e3e5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <ui-text variant="heading" as="h2">App Settings</ui-text>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#6d7175'
            }}
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e1e3e5'
        }}>
          {[
            { id: 'general', label: 'General' },
            { id: 'ai', label: 'AI Configuration' },
            { id: 'advanced', label: 'Advanced' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '1rem 1.5rem',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid #008060' : 'none',
                color: activeTab === tab.id ? '#008060' : '#6d7175',
                cursor: 'pointer',
                fontWeight: activeTab === tab.id ? 'bold' : 'normal'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem', maxHeight: '60vh', overflowY: 'auto' }}>
          {activeTab === 'general' && (
            <div>
              <ui-text variant="heading" as="h3" style={{ marginBottom: '1rem' }}>
                General Settings
              </ui-text>
              
              <ui-form-layout>
                <ui-select
                  label="Default Language"
                  value={settings.language}
                  onChange={(value) => handleInputChange('language', value)}
                  options={languages}
                />
                
                <ui-select
                  label="Default Tone"
                  value={settings.tone}
                  onChange={(value) => handleInputChange('tone', value)}
                  options={tones}
                />
                
                <ui-text-field
                  label="Maximum Content Length"
                  type="number"
                  value={settings.maxLength.toString()}
                  onChange={(value) => handleInputChange('maxLength', parseInt(value))}
                  help-text="Maximum number of words for generated content"
                />
              </ui-form-layout>
            </div>
          )}

          {activeTab === 'ai' && (
            <div>
              <ui-text variant="heading" as="h3" style={{ marginBottom: '1rem' }}>
                AI Configuration
              </ui-text>
              
              <ui-form-layout>
                <ui-select
                  label="AI Provider"
                  value={settings.aiProvider}
                  onChange={(value) => handleInputChange('aiProvider', value)}
                  options={aiProviders}
                />
                
                <ui-text-field
                  label="API Key"
                  type="password"
                  value={settings.apiKey}
                  onChange={(value) => handleInputChange('apiKey', value)}
                  placeholder="Enter your API key"
                  help-text="Your API key is encrypted and stored securely"
                />
                
                <div style={{
                  padding: '1rem',
                  backgroundColor: '#f6f6f7',
                  borderRadius: '8px',
                  marginTop: '1rem'
                }}>
                  <ui-text variant="heading" as="h4" style={{ marginBottom: '0.5rem' }}>
                    AI Provider Information
                  </ui-text>
                  <p style={{ fontSize: '14px', color: '#6d7175' }}>
                    {settings.aiProvider === 'openai' && 'OpenAI GPT-4 provides high-quality content generation with excellent language understanding.'}
                    {settings.aiProvider === 'claude' && 'Anthropic Claude offers safe and helpful AI content generation with strong ethical guidelines.'}
                    {settings.aiProvider === 'gemini' && 'Google Gemini provides fast and efficient AI content generation with good multilingual support.'}
                    {settings.aiProvider === 'custom' && 'Use your own AI service by providing the API endpoint and authentication details.'}
                  </p>
                </div>
              </ui-form-layout>
            </div>
          )}

          {activeTab === 'advanced' && (
            <div>
              <ui-text variant="heading" as="h3" style={{ marginBottom: '1rem' }}>
                Advanced Settings
              </ui-text>
              
              <ui-form-layout>
                <ui-toggle
                  label="Auto-save drafts"
                  checked={settings.autoSave}
                  onChange={(checked) => handleInputChange('autoSave', checked)}
                  help-text="Automatically save blog post drafts as you type"
                />
                
                <ui-toggle
                  label="Enable notifications"
                  checked={settings.notifications}
                  onChange={(checked) => handleInputChange('notifications', checked)}
                  help-text="Receive notifications for completed AI generations"
                />
                
                <div style={{
                  padding: '1rem',
                  backgroundColor: '#fff4e5',
                  borderRadius: '8px',
                  marginTop: '1rem',
                  border: '1px solid #ffc453'
                }}>
                  <ui-text variant="heading" as="h4" style={{ marginBottom: '0.5rem', color: '#b95000' }}>
                    ⚠️ Advanced Features
                  </ui-text>
                  <p style={{ fontSize: '14px', color: '#b95000' }}>
                    These settings affect the core functionality of the app. 
                    Only modify if you understand the implications.
                  </p>
                </div>
              </ui-form-layout>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid #e1e3e5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#f6f6f7'
        }}>
          <ui-button variant="secondary" onClick={handleReset}>
            Reset to Default
          </ui-button>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <ui-button variant="secondary" onClick={onClose}>
              Cancel
            </ui-button>
            <ui-button 
              variant="primary" 
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Settings'}
            </ui-button>
          </div>
        </div>
      </div>
    </div>
  );
}
