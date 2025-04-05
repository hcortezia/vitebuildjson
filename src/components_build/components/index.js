import ButtonBuild from './Button';
import SelectBuild from './Select';
import InputBuild from './Input';
import DatePickerBuild from './DatePicker'; 
import CheckboxBuild from './Checkbox';
import RadioBuild from './Radio';
import SwitchBuild from './Switch';
import PanelBuild from './Panel';

// Criando o registro de componentes
const componentsRegistry = {
  'button': ButtonBuild,
  'select': SelectBuild,
  'input': InputBuild,
  'datepicker': DatePickerBuild,
  'checkbox': CheckboxBuild,
  'radio': RadioBuild,
  'switch': SwitchBuild,
  'panel': PanelBuild
};

export { 
    ButtonBuild, 
    SelectBuild, 
    InputBuild,
    DatePickerBuild, 
    CheckboxBuild, 
    RadioBuild, 
    SwitchBuild, 
    PanelBuild 
}; 

// Exportação padrão do componentsRegistry
export default componentsRegistry;