import React from 'react';
import componentsRegistry from './components';
import FormBuild from './form-build';
import GridBuild from './grid-build';

// Componente principal que converte JSON em componentes React
const BaseBuild = ({ json }) => {
  // Renderiza o componente baseado no xtype
  const renderComponent = (config, index) => {
    const { xtype } = config;
    
    // Primeiro, tentamos obter o componente do registro
    const Component = componentsRegistry[xtype];
    if (Component) {
      return <Component key={index} config={config} />;
    }
    
    // Caso o componente não esteja no registro, usamos o fallback
    switch (xtype) {
      case 'form':
        return <FormBuild key={index} config={config} />;
      case 'grid':
        return <GridBuild key={index} config={config} />;
      default:
        return <div key={index}>Componente não suportado: {xtype}</div>;
    }
  };

  return renderComponent(json, 0);
};

// Função auxiliar que pode ser usada por outros componentes
export const JSONToComponent = ({ json, index = 0 }) => {
  const baseBuild = new BaseBuild({});
  return baseBuild.renderComponent(json, index);
};

export default BaseBuild; 