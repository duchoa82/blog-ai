import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PageHeader.css';

interface PageHeaderProps {
  title: string;
  buttonText?: string;
  buttonAction?: () => void;
  buttonVariant?: 'primary' | 'secondary';
  showButton?: boolean;
}

export default function PageHeader({ 
  title, 
  buttonText, 
  buttonAction, 
  buttonVariant = 'primary',
  showButton = true 
}: PageHeaderProps) {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (buttonAction) {
      buttonAction();
    }
  };

  return (
    <div className="page-header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="page-title">{title}</h1>
        </div>
        {showButton && buttonText && (
          <div className="header-right">
            <button 
              className={`polaris-button polaris-button--${buttonVariant}`}
              onClick={handleButtonClick}
            >
              {buttonText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
