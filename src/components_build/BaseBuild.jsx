import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Table, Select, DatePicker, Checkbox, Radio, Switch } from 'antd';
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

export default BaseBuild;