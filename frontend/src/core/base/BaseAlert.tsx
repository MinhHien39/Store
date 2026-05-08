import React, { useEffect, useState } from 'react';

export enum AlertType {
  error = "error",
  warning = "warning",
  info = "info",
  success = "success"
}

export type AlertConfig = {
  type: AlertType;
  title: string;
  content: string;
};

const AlertComponent: React.FC<{ config: AlertConfig }> = ({ config }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fade in
    const showTimer = setTimeout(() => setIsVisible(true), 100);

    // Fade out after 4s
    const hideTimer = setTimeout(() => setIsVisible(false), 3100);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div className={`base-alert base-alert--${config.type} ${isVisible ? 'show' : 'hide'}`}>
      <div className="alert-content">
        <strong>{config.title}</strong>
        <div style={{ whiteSpace: 'pre-line' }}>{config.content}</div>
      </div>
      <div className={`base-progress-bar base-progress-bar--${config.type}`}></div>
    </div>
  );
};

export default AlertComponent;