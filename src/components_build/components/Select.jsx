import React from 'react';
import  { Select } from 'antd';
import withListeners from '../../utils/withListeners';

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

export default SelectBuild;
