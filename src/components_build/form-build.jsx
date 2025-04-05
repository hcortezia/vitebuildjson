import React, { useEffect, useState } from 'react';
import { Form, Button, Row, Col, Card } from 'antd';
import BaseBuild from './BaseBuild';

const FormBuild = ({ config }) => {
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { 
    title, 
    items = [], 
    layout = 'vertical', 
    model, 
    buttons = [],
    width,
    labelCol = { span: 8 },
    wrapperCol = { span: 16 },
    onSubmit,
    onReset,
    listeners = {}
  } = config;
  
  // Renderiza os itens do formulário
  const renderItems = () => {
    return items.map((item, index) => {
      // Se o item tiver um layout específico (como Row, Col)
      if (item.layout) {
        return renderLayoutItem(item, index);
      }
      
      // Se for um componente normal
      return (
        <Form.Item 
          key={index} 
          label={item.label} 
          name={item.name}
          rules={mapValidationRules(item.validators)}
        >
          <BaseBuild json={item} />
        </Form.Item>
      );
    });
  };
  
  // Renderiza itens com layout específico (Row/Col)
  const renderLayoutItem = (layoutConfig, key) => {
    if (layoutConfig.layout === 'row') {
      return (
        <Row key={key} gutter={layoutConfig.gutter || 16}>
          {layoutConfig.items.map((colItem, colIndex) => (
            <Col key={`${key}-${colIndex}`} span={colItem.span || 24}>
              <Form.Item 
                label={colItem.label} 
                name={colItem.name}
                rules={mapValidationRules(colItem.validators)}
              >
                <BaseBuild json={colItem} />
              </Form.Item>
            </Col>
          ))}
        </Row>
      );
    }
    
    return null;
  };
  
  // Mapeia as regras de validação do ExtJS para regras Ant Design
  const mapValidationRules = (validators = []) => {
    return validators.map(validator => {
      if (validator.type === 'required') {
        return { required: true, message: validator.message || 'Campo obrigatório' };
      }
      
      if (validator.type === 'email') {
        return { 
          type: 'email', 
          message: validator.message || 'Email inválido' 
        };
      }
      
      if (validator.type === 'length') {
        return { 
          len: validator.len, 
          message: validator.message || `Este campo deve ter ${validator.len} caracteres` 
        };
      }
      
      if (validator.type === 'min') {
        return { 
          min: validator.min, 
          message: validator.message || `O valor mínimo é ${validator.min}` 
        };
      }
      
      if (validator.type === 'max') {
        return { 
          max: validator.max, 
          message: validator.message || `O valor máximo é ${validator.max}` 
        };
      }
      
      if (validator.type === 'custom') {
        return { 
          validator: validator.fn,
          message: validator.message || 'Validação personalizada falhou'
        };
      }
      
      return {};
    });
  };
  
  // Carrega dados do modelo, se especificado
  useEffect(() => {
    if (model && model.load) {
      setIsLoading(true);
      
      // Trigger evento beforeLoad
      if (listeners.beforeLoad) {
        listeners.beforeLoad();
      }
      
      model.load()
        .then(data => {
          form.setFieldsValue(data);
          setFormData(data);
          
          // Trigger evento afterLoad
          if (listeners.afterLoad) {
            listeners.afterLoad(data);
          }
        })
        .catch(error => {
          console.error('Erro ao carregar dados do modelo:', error);
          
          // Trigger evento loadError
          if (listeners.loadError) {
            listeners.loadError(error);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [model, form]);
  
  // Handler para submit do formulário
  const handleSubmit = (values) => {
    // Trigger evento beforeSubmit
    if (listeners.beforeSubmit) {
      const shouldProceed = listeners.beforeSubmit(values);
      if (shouldProceed === false) return;
    }
    
    if (model && model.save) {
      setIsLoading(true);
      
      model.save(values)
        .then(response => {
          // Trigger evento submitSuccess
          if (listeners.submitSuccess) {
            listeners.submitSuccess(response);
          }
          
          if (onSubmit) {
            onSubmit(values, response);
          }
        })
        .catch(error => {
          console.error('Erro ao salvar dados:', error);
          
          // Trigger evento submitError
          if (listeners.submitError) {
            listeners.submitError(error);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (onSubmit) {
      onSubmit(values);
    }
  };
  
  // Handler para reset do formulário
  const handleReset = () => {
    form.resetFields();
    
    if (onReset) {
      onReset();
    }
    
    // Trigger evento reset
    if (listeners.reset) {
      listeners.reset();
    }
  };
  
  // Renderiza botões do formulário
  const renderButtons = () => {
    // Se houver botões configurados
    if (buttons && buttons.length > 0) {
      return buttons.map((button, index) => (
        <Button
          key={index}
          type={button.type || 'default'}
          htmlType={button.htmlType || 'button'}
          onClick={button.onClick}
          loading={button.htmlType === 'submit' && isLoading}
        >
          {button.text}
        </Button>
      ));
    }
    
    // Botões padrão
    return (
      <>
        <Button type="primary" htmlType="submit" loading={isLoading}>
          Salvar
        </Button>
        <Button htmlType="button" onClick={handleReset} style={{ marginLeft: 8 }}>
          Limpar
        </Button>
      </>
    );
  };
  
  // Wrap com Card se tiver título
  const formContent = (
    <Form
      form={form}
      layout={layout}
      labelCol={labelCol}
      wrapperCol={wrapperCol}
      onFinish={handleSubmit}
      style={{ width: width || '100%' }}
    >
      {renderItems()}
      
      <Form.Item wrapperCol={{ offset: layout === 'horizontal' ? labelCol.span : 0 }}>
        {renderButtons()}
      </Form.Item>
    </Form>
  );
  
  if (title) {
    return (
      <Card title={title} loading={isLoading}>
        {formContent}
      </Card>
    );
  }
  
  return formContent;
};

export default FormBuild;