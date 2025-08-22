import React, { useState, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Start writing your blog content...',
  readOnly = false
}) => {
  const [editorValue, setEditorValue] = useState(value);

  // Quill modules configuration
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false,
    }
  }), []);

  // Quill editor formats
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'color', 'background',
    'align',
    'link', 'image'
  ];

  const handleChange = (content: string) => {
    setEditorValue(content);
    onChange(content);
  };

  return (
    <div className="rich-text-editor-container">
      <ReactQuill
        theme="snow"
        value={editorValue}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        readOnly={readOnly}
        style={{
          height: '300px',
          marginBottom: '20px'
        }}
      />
      
      {/* Custom CSS for better Shopify integration */}
      <style jsx>{`
        .rich-text-editor-container {
          border-radius: 8px;
          overflow: hidden;
        }
        
        .rich-text-editor-container .ql-editor {
          min-height: 200px;
          font-size: 16px;
          line-height: 1.6;
          color: #202223;
          padding: 16px;
        }
        
        .rich-text-editor-container .ql-toolbar {
          border-top: 1px solid #e1e3e5;
          border-left: 1px solid #e1e3e5;
          border-right: 1px solid #e1e3e5;
          border-bottom: none;
          border-radius: 8px 8px 0 0;
          background-color: #f6f6f7;
        }
        
        .rich-text-editor-container .ql-container {
          border: 1px solid #e1e3e5;
          border-top: none;
          border-radius: 0 0 8px 8px;
        }
        
        .rich-text-editor-container .ql-editor.ql-blank::before {
          color: #8c9196;
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
