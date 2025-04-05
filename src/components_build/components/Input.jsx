import React from 'react';
import { Input } from 'antd';
import withListeners from '../../utils/withListeners';

// Componente de Input
const InputBuild = withListeners(({ config }) => {
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
    className,
    ...rest
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