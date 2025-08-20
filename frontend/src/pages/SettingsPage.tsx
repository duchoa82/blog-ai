import React, { useState } from 'react';
import SettingsModal from '../components/modals/SettingsModal';

export default function SettingsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSettings, setCurrentSettings] = useState({
    aiProvider: 'openai',
    language: 'en',
    tone: 'professional',
    maxLength: 1000,
    autoSave: true,
    notifications: true
  });

  const handleSaveSettings = async (settings: any) => {
    try {
      // TODO: Save settings to backend
      console.log('Saving settings:', settings);
      setCurrentSettings(settings);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings. Please try again.');
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <div className="page-header">
        <ui-title-bar title="App Settings">
        </ui-title-bar>
        <div className="header-actions">
          <ui-button variant="primary" onClick={openModal}>
            Edit Settings
          </ui-button>
        </div>
      </div>
      
      <style>{`
        .page-header {
          margin-bottom: 24px;
        }

        .header-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 16px;
        }
      `}</style>
      
      <ui-layout>
        <ui-layout-section>
          <ui-card>
            <ui-text variant="heading" as="h1">App Settings</ui-text>
            <p>Configure your Blog AI app preferences and AI settings.</p>
            
            <div style={{ marginTop: '2rem' }}>
              <ui-button variant="primary" onClick={openModal}>
                Open Settings
              </ui-button>
            </div>
          </ui-card>
        </ui-layout-section>
        
        {/* Current Settings Display */}
        <ui-layout-section>
          <ui-card>
            <ui-text variant="heading" as="h2">Current Configuration</ui-text>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem',
              marginTop: '1rem'
            }}>
              <div style={{ 
                padding: '1rem', 
                backgroundColor: '#f6f6f7', 
                borderRadius: '8px' 
              }}>
                <ui-text variant="heading" as="h4">AI Provider</ui-text>
                <p>{currentSettings.aiProvider === 'openai' ? 'OpenAI GPT-4' : 
                     currentSettings.aiProvider === 'claude' ? 'Anthropic Claude' :
                     currentSettings.aiProvider === 'gemini' ? 'Google Gemini' : 'Custom API'}</p>
              </div>
              
              <div style={{ 
                padding: '1rem', 
                backgroundColor: '#f6f6f7', 
                borderRadius: '8px' 
              }}>
                <ui-text variant="heading" as="h4">Language</ui-text>
                <p>{currentSettings.language === 'en' ? 'English' :
                     currentSettings.language === 'es' ? 'Spanish' :
                     currentSettings.language === 'fr' ? 'French' : 'Other'}</p>
              </div>
              
              <div style={{ 
                padding: '1rem', 
                backgroundColor: '#f6f6f7', 
                borderRadius: '8px' 
              }}>
                <ui-text variant="heading" as="h4">Tone</ui-text>
                <p>{currentSettings.tone.charAt(0).toUpperCase() + currentSettings.tone.slice(1)}</p>
              </div>
              
              <div style={{ 
                padding: '1rem', 
                backgroundColor: '#f6f6f7', 
                borderRadius: '8px' 
              }}>
                <ui-text variant="heading" as="h4">Max Length</ui-text>
                <p>{currentSettings.maxLength} words</p>
              </div>
            </div>
          </ui-card>
        </ui-layout-section>
        
        {/* Quick Actions */}
        <ui-layout-section secondary>
          <ui-card>
            <ui-text variant="heading" as="h2">Quick Actions</ui-text>
            
            <div style={{ marginTop: '1rem' }}>
              <ui-button full-width onClick={openModal}>
                Edit Settings
              </ui-button>
              
              <ui-button full-width style={{ marginTop: '1rem' }}>
                Export Configuration
              </ui-button>
              
              <ui-button full-width style={{ marginTop: '1rem' }}>
                Import Configuration
              </ui-button>
              
              <ui-button full-width style={{ marginTop: '1rem' }}>
                Reset to Default
              </ui-button>
            </div>
          </ui-card>
        </ui-layout-section>
      </ui-layout>
      
      {/* Settings Modal */}
      <SettingsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSaveSettings}
      />
    </div>
  );
}
