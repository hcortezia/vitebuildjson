import React from 'react';

// HOC para aplicar listeners a qualquer componente
const withListeners = (WrappedComponent) => {
  const WithListenersComponent = (props) => {
    const { config } = props;
    const { listeners = {} } = config;
    
    const enhancedProps = { ...props };
    
    // Mapeia os listeners do ExtJS para eventos React/Ant Design
    if (listeners) {
      Object.keys(listeners).forEach(eventName => {
        const handler = listeners[eventName];
        
        // Mapeamento de eventos ExtJS para eventos React/Ant
        const reactEventMap = {
          click: 'onClick',
          change: 'onChange',
          load: 'onLoad',
          afterLoad: 'onAfterLoad',
          // Adicione mais mapeamentos conforme necessário
        };
        
        const reactEventName = reactEventMap[eventName] || eventName;
        enhancedProps[reactEventName] = handler;
      });
    }
    
    return React.createElement(WrappedComponent, enhancedProps);
  };

  WithListenersComponent.displayName = `WithListeners(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  
  return WithListenersComponent;
};

export default withListeners; 