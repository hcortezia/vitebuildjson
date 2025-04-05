import componentsRegistry, { 
  ButtonBuild,
  SelectBuild,
  InputBuild,
  DatePickerBuild,
  CheckboxBuild,
  RadioBuild,
  SwitchBuild,
  PanelBuild
} from './components';

// Este arquivo agora serve apenas como um ponto central para exportar todos os componentes
// As implementações individuais foram movidas para arquivos separados em ./components/
const registerComponents = () => {
  // Já registrado no registry, mas podemos registrar novamente aqui
  // para manter compatibilidade com código existente
  componentsRegistry['button'] = ButtonBuild;
  componentsRegistry['select'] = SelectBuild;
  componentsRegistry['input'] = InputBuild;
  componentsRegistry['datepicker'] = DatePickerBuild;
  componentsRegistry['checkbox'] = CheckboxBuild;
  componentsRegistry['radio'] = RadioBuild;
  componentsRegistry['switch'] = SwitchBuild;
  componentsRegistry['panel'] = PanelBuild;
};

// Executamos a função de registro imediatamente
registerComponents();

export {
  InputBuild,
  SelectBuild,
  DatePickerBuild,
  CheckboxBuild,
  RadioBuild,
  SwitchBuild,
  PanelBuild,
  ButtonBuild
};