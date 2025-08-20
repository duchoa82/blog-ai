declare namespace JSX {
  interface IntrinsicElements {
    'ui-title-bar': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      title?: string;
    };
    'ui-layout': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    'ui-layout-section': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      secondary?: boolean;
    };
    'ui-card': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    'ui-text': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      variant?: 'heading' | 'headingLg' | 'headingMd' | 'headingSm' | 'body' | 'bodySm' | 'bodyMd' | 'bodyLg';
      as?: string;
    };
    'ui-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      variant?: 'primary' | 'secondary' | 'tertiary' | 'destructive';
      size?: 'slim' | 'medium' | 'large';
      disabled?: boolean;
      loading?: boolean;
      onClick?: (event: React.MouseEvent<HTMLElement>) => void;
    };
    'ui-stack': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      spacing?: 'tight' | 'loose' | 'extraLoose';
      alignment?: 'leading' | 'trailing' | 'center' | 'fill' | 'baseline';
      distribution?: 'equalSpacing' | 'leading' | 'trailing' | 'center' | 'fill' | 'fillEvenly';
      vertical?: boolean;
    };
    'ui-select': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      label?: string;
      options?: Array<{ label: string; value: string }>;
      value?: string;
      onChange?: (event: React.ChangeEvent<HTMLElement>) => void;
    };
    'ui-text-field': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      label?: string;
      value?: string;
      placeholder?: string;
      onChange?: (event: React.ChangeEvent<HTMLElement>) => void;
      type?: string;
    };
    'ui-modal': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      open?: boolean;
      title?: string;
      onClose?: () => void;
    };
    'ui-tabs': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    'ui-tab': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      id: string;
      title: string;
      selected?: boolean;
    };
    'ui-accordion': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    'ui-accordion-item': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      title: string;
      expanded?: boolean;
    };
  }
}
