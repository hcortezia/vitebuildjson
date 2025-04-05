import React from 'react';
import { Radio } from 'antd';
import withListeners from '../../utils/withListeners';

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

export default RadioBuild;