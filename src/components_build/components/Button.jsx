import React from 'react';
import  { Button } from 'antd';
import withListeners from '../../utils/withListeners';

// Componente de Botão
const ButtonComponent = ({ config }) => {
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
};

// Aplicando o HOC withListeners
const ButtonBuild = withListeners(ButtonComponent);

export default ButtonBuild; 