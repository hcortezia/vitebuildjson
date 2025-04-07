// src/utils/withListeners.jsx
import React from 'react';

// HOC para aplicar listeners a qualquer componente
const withListeners = (WrappedComponent) => {
  const WithListenersComponent = (props) => {
    // Desestruturar props para isolar config
    const { config, ...restProps } = props;
    
    // Extrair listeners da config
    const { listeners = {}, ...restConfig } = config;
    
    // Criar props melhoradas para o componente
    const enhancedProps = {
      // Passar todas as props que não são config diretamente
      ...restProps,
      
      // Mesclar a config sem os listeners
      config: {
        ...restConfig
      }
    };
    
    // Adicionar event handlers dos listeners
    if (Object.keys(listeners).length > 0) {
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
    
    return <WrappedComponent {...enhancedProps} />;
  };

  WithListenersComponent.displayName = `WithListeners(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  
  return WithListenersComponent;
};

// Usar export default
export default withListeners;