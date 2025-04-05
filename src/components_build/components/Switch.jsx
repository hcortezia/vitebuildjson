import React from 'react';
import { Switch } from 'antd';
import withListeners from '../../utils/withListeners';

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

export default SwitchBuild;