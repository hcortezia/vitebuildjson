import React, { useEffect, useState } from 'react';
import componentsRegistry from './components';
import FormBuild from './form-build';
import GridBuild from './grid-build';
import { 
  InputBuild,
  ButtonBuild,
  SelectBuild, 
  DatePickerBuild,
  CheckboxBuild,
  RadioBuild,
  SwitchBuild,
  PanelBuild 
} from './input-components';

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
      case 'input':
        return <InputBuild key={index} config={config} />;
      case 'button':
        return <ButtonBuild key={index} config={config} />;
      case 'select':
        return <SelectBuild key={index} config={config} />;
      case 'datepicker':
        return <DatePickerBuild key={index} config={config} />;
      case 'checkbox':
        return <CheckboxBuild key={index} config={config} />;
      case 'radio':
        return <RadioBuild key={index} config={config} />;
      case 'switch':
        return <SwitchBuild key={index} config={config} />;
      case 'panel':
        return <PanelBuild key={index} config={config} />;
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