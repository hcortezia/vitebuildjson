import React from 'react';
import componentsRegistry, { 
  ButtonBuild,
  // Quando migrar os outros componentes, importe-os aqui
  // InputBuild,
  // SelectBuild,
  // DatePickerBuild,
  // CheckboxBuild,
  // RadioBuild,
  // SwitchBuild,
  // PanelBuild
} from './components';

// Registra componentes por xtype
const registerComponents = () => {
  // Já registrado no registry, mas podemos registrar novamente aqui
  // para manter compatibilidade com código existente
  componentsRegistry['button'] = ButtonBuild;

  // Quando migrar os outros componentes, registre-os aqui
  // componentsRegistry['input'] = InputBuild;
  // componentsRegistry['select'] = SelectBuild;
  // componentsRegistry['datepicker'] = DatePickerBuild;
  // componentsRegistry['checkbox'] = CheckboxBuild;
  // componentsRegistry['radio'] = RadioBuild;
  // componentsRegistry['switch'] = SwitchBuild;
  // componentsRegistry['panel'] = PanelBuild;
};

// Executamos a função de registro imediatamente
registerComponents();

// Exportamos os componentes para manter compatibilidade com o código existente
export {
  ButtonBuild,
  // Quando migrar os outros componentes, exporte-os aqui
  // InputBuild,
  // SelectBuild,
  // DatePickerBuild,
  // CheckboxBuild,
  // RadioBuild,
  // SwitchBuild,
  // PanelBuild
}; 