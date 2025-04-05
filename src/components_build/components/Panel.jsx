import React from 'react';
import withListeners from '../../utils/withListeners';

// Componente de Panel
const PanelBuild = withListeners(({ config }) => {
    const { 
      title, 
      items = [], 
      style, 
      className 
    } = config;
    
    return (
      <div className={className} style={style}>
        {title && <h3>{title}</h3>}
        <div className="panel-content">
          {items.map((item, index) => (
            <div key={index} className="panel-item">
            </div>
          ))}
        </div>
      </div>
    );
  });

export default PanelBuild;