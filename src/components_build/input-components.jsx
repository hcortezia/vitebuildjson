import React from 'react';
import { Input, Button, Select, DatePicker, Checkbox, Radio, Switch } from 'antd';
import withListeners from '../utils/withListeners';

// Componente de Input base
const BaseInputComponent = React.forwardRef(({ config, ...rest }, ref) => {
  const { 
    type = 'text', 
    placeholder, 
    disabled, 
    addonBefore, 
    addonAfter, 
    size,
    allowClear = true,
    value,
    onChange,
    onPressEnter,
    onBlur,
    onFocus,
    style,
    className
  } = config;
  
  // Mapeamento de tipos
  const inputTypes = {
    'text': Input,
    'password': Input.Password,
    'textarea': Input.TextArea,
    'number': Input.Number,
    'search': Input.Search
  };
  
  const InputComponent = inputTypes[type] || Input;
  
  return (
    <InputComponent
      ref={ref}
      placeholder={placeholder}
      disabled={disabled}
      addonBefore={addonBefore}
      addonAfter={addonAfter}
      size={size}
      allowClear={allowClear}
      value={value}
      onChange={onChange}
      onPressEnter={onPressEnter}
      onBlur={onBlur}
      onFocus={onFocus}
      style={style}
      className={className}
      {...rest}
    />
  );
});

BaseInputComponent.displayName = 'BaseInputComponent';

// Aplicando o HOC withListeners
const InputBuild = withListeners(BaseInputComponent);

// Componente de Botão
const ButtonBuild = withListeners(({ config }) => {
  const { 
    text, 
    type = 'default', 
    size, 
    icon,
    disabled,
    loading,
    danger,
    ghost,
    block,
    htmlType = 'button',
    shape,
    onClick,
    style,
    className
  } = config;
  
  return (
    <Button
      type={type}
      size={size}
      icon={icon}
      disabled={disabled}
      loading={loading}
      danger={danger}
      ghost={ghost}
      block={block}
      htmlType={htmlType}
      shape={shape}
      onClick={onClick}
      style={style}
      className={className}
    >
      {text}
    </Button>
  );
});

// Componente de Select
const SelectBuild = withListeners(({ config }) => {
  const { 
    options = [], 
    placeholder, 
    disabled, 
    mode,
    allowClear = true,
    showSearch = true,
    value,
    onChange,
    onBlur,
    onFocus,
    style,
    className,
    optionFilterProp = 'label',
    loading,
    size,
    store
  } = config;
  
  const [selectOptions, setSelectOptions] = React.useState(options);
  
  // Se tiver uma store configurada, carrega as opções dela
  React.useEffect(() => {
    if (store && store.load) {
      store.load().then(result => {
        const { data } = result;
        
        // Mapeia os dados para o formato de opções do Select
        const mappedOptions = data.map(item => ({
          value: item[store.valueField || 'id'],
          label: item[store.displayField || 'name']
        }));
        
        setSelectOptions(mappedOptions);
      });
    }
  }, [store]);
  
  return (
    <Select
      options={selectOptions}
      placeholder={placeholder}
      disabled={disabled}
      mode={mode}
      allowClear={allowClear}
      showSearch={showSearch}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={onFocus}
      style={style}
      className={className}
      optionFilterProp={optionFilterProp}
      loading={loading}
      size={size}
    />
  );
});

// Componente de DatePicker
const DatePickerBuild = withListeners(({ config }) => {
  const { 
    placeholder, 
    disabled, 
    allowClear = true,
    value,
    onChange,
    onBlur,
    onFocus,
    style,
    className,
    format,
    showTime,
    picker = 'date',
    size
  } = config;
  
  const datePickerTypes = {
    'date': DatePicker,
    'week': DatePicker.WeekPicker,
    'month': DatePicker.MonthPicker,
    'quarter': DatePicker.QuarterPicker,
    'year': DatePicker.YearPicker,
    'range': DatePicker.RangePicker
  };
  
  const DatePickerComponent = datePickerTypes[picker] || DatePicker;
  
  return (
    <DatePickerComponent
      placeholder={placeholder}
      disabled={disabled}
      allowClear={allowClear}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={onFocus}
      style={style}
      className={className}
      format={format}
      showTime={showTime}
      size={size}
    />
  );
});

// Componente de Checkbox
const CheckboxBuild = withListeners(({ config }) => {
  const { 
    label, 
    disabled, 
    value,
    onChange,
    style,
    className,
    checked,
    indeterminate
  } = config;
  
  return (
    <Checkbox
      disabled={disabled}
      checked={checked}
      onChange={onChange}
      style={style}
      className={className}
      indeterminate={indeterminate}
    >
      {label}
    </Checkbox>
  );
});

// Componente de Radio
const RadioBuild = withListeners(({ config }) => {
  const { 
    options = [], 
    disabled, 
    value,
    onChange,
    style,
    className,
    optionType = 'default',
    buttonStyle,
    size,
    store
  } = config;
  
  const [radioOptions, setRadioOptions] = React.useState(options);
  
  // Se tiver uma store configurada, carrega as opções dela
  React.useEffect(() => {
    if (store && store.load) {
      store.load().then(result => {
        const { data } = result;
        
        // Mapeia os dados para o formato de opções do Radio
        const mappedOptions = data.map(item => ({
          value: item[store.valueField || 'id'],
          label: item[store.displayField || 'name']
        }));
        
        setRadioOptions(mappedOptions);
      });
    }
  }, [store]);
  
  return (
    <Radio.Group
      options={radioOptions}
      disabled={disabled}
      value={value}
      onChange={onChange}
      style={style}
      className={className}
      optionType={optionType}
      buttonStyle={buttonStyle}
      size={size}
    />
  );
});

// Componente de Switch
const SwitchBuild = withListeners(({ config }) => {
  const { 
    checkedChildren, 
    unCheckedChildren, 
    disabled, 
    size,
    loading,
    defaultChecked,
    checked,
    onChange,
    style,
    className
  } = config;
  
  return (
    <Switch
      checkedChildren={checkedChildren}
      unCheckedChildren={unCheckedChildren}
      disabled={disabled}
      size={size}
      loading={loading}
      defaultChecked={defaultChecked}
      checked={checked}
      onChange={onChange}
      style={style}
      className={className}
    />
  );
});

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
            <JSONToComponent json={item} />
          </div>
        ))}
      </div>
    </div>
  );
});

// Importa o JSONToComponent para evitar referência circular
import JSONToComponent from './BaseBuild';

export {
  InputBuild,
  ButtonBuild,
  SelectBuild,
  DatePickerBuild,
  CheckboxBuild,
  RadioBuild,
  SwitchBuild,
  PanelBuild
};