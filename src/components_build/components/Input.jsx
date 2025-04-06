import React from 'react';
import { Input, Button, Space } from 'antd';
import * as Icons from '@ant-design/icons';
import withListeners from '../../utils/withListeners';

// Componente de Input
const InputBuild = withListeners(({ config }) => {
  const { 
    type = 'text',
    inputType = 'default',
    buttonText,
    buttonType,
    buttonIcon,
    onButtonClick,
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
    className,
    required,
    requiredMessage,
    validators,
    addon,
    prefix,
    suffix,
    icon,
    suffixIcon,
    ...rest
  } = config;

  // Função para renderizar ícone
  const renderIcon = (iconName) => {
    if (!iconName) return null;
    const IconComponent = Icons[iconName];
    return IconComponent ? <IconComponent /> : null;
  };
  
  // Configuração de prefix e suffix com ícones
  const inputPrefix = icon ? renderIcon(icon) : prefix;
  const inputSuffix = suffixIcon ? renderIcon(suffixIcon) : suffix;
  
  // Mapeamento de tipos - mover para cima 
  const inputTypes = {
    'text': Input,
    'password': Input.Password,
    'textarea': Input.TextArea,
    'number': Input.Number,
    'search': Input.Search
  };
  
  // Input Search
  if (inputType === 'search') {
    const Search = Input.Search;
    return <Search 
      prefix={inputPrefix}
      suffix={inputSuffix}
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
    />;
  }
  
  // Input + Button
  if (inputType === 'withButton') {
    return (
      <Space.Compact style={{ width: '100%', ...style }}>
        <Input
          prefix={inputPrefix}
          suffix={inputSuffix}
          placeholder={placeholder}
          disabled={disabled}
          size={size}
          allowClear={allowClear}
          value={value}
          onChange={onChange}
          onPressEnter={onPressEnter}
          onBlur={onBlur}
          onFocus={onFocus}
          className={className}
          {...rest}
        />
        <Button 
          type={buttonType || 'primary'} 
          icon={buttonIcon ? renderIcon(buttonIcon) : null}
          onClick={onButtonClick}
          disabled={disabled}
          size={size}
        >
          {buttonText}
        </Button>
      </Space.Compact>
    );
  }
  
  // Input Group (prefix/suffix)
  if (inputType === 'prefix' || inputType === 'suffix') {
    return (
      <Input
        prefix={inputPrefix}
        suffix={inputSuffix}
        placeholder={placeholder}
        disabled={disabled}
        addonBefore={inputType === 'prefix' ? addon : addonBefore}
        addonAfter={inputType === 'suffix' ? addon : addonAfter}
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
  }
  
  // Componentes básicos do Input
  const InputComponent = inputTypes[type] || Input;
  
  return (
    <InputComponent
      prefix={inputPrefix}
      suffix={inputSuffix}
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

export default InputBuild;