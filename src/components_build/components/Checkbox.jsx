import React from 'react';
import { Checkbox } from 'antd';
import withListeners from '../../utils/withListeners';

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

export default CheckboxBuild;