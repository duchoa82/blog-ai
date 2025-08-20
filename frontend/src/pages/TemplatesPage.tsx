import React from 'react';

export default function TemplatesPage() {
  return (
    <div>
      <div className="page-header">
        <ui-title-bar title="Blog Templates">
        </ui-title-bar>
        <div className="header-actions">
          <ui-button variant="primary">Create New Template</ui-button>
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
            <ui-text variant="heading" as="h1">Blog Templates</ui-text>
            <p>Create and manage your blog post templates for consistent content structure.</p>
            
            <ui-stack>
              <ui-button variant="primary">Create New Template</ui-button>
              <ui-button>Import Template</ui-button>
            </ui-stack>
          </ui-card>
        </ui-layout-section>
        
        <ui-layout-section secondary>
          <ui-card>
            <ui-text variant="heading" as="h2">Template Library</ui-text>
            <p>Browse through your saved templates and customize them for different content types.</p>
          </ui-card>
        </ui-layout-section>
      </ui-layout>
    </div>
  );
}
