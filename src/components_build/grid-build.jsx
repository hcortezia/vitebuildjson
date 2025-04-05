import React, { useEffect, useState, useRef } from 'react';
import { Table, Card, Button, Input, Space, Tooltip, Popconfirm } from 'antd';
import { SearchOutlined, ReloadOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

const GridBuild = ({ config }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showQuickJumper: true,
    showSizeChanger: true,
  });
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  
  const { 
    title, 
    store, 
    columns = [], 
    features = {},
    rowKey = 'id',
    listeners = {},
    toolbar = [],
    actions = []
  } = config;
  
  // Features do grid
  const {
    pagination: paginationEnabled = true,
    filter: filterEnabled = true,
    sort: sortEnabled = true,
    selection: selectionEnabled = false,
    rowActions: rowActionsEnabled = true
  } = features;
  
  // Load data from store
  useEffect(() => {
    if (store) {
      loadData();
    }
  }, [pagination.current, pagination.pageSize]);
  
  // Função para carregar dados da store
  const loadData = (params = {}) => {
    setLoading(true);
    
    // Trigger evento beforeLoad
    if (listeners.beforeLoad) {
      listeners.beforeLoad();
    }
    
    const queryParams = {
      page: pagination.current,
      pageSize: pagination.pageSize,
      ...params
    };
    
    store.load(queryParams)
      .then(response => {
        const { data, total } = response;
        
        setData(data);
        setPagination({
          ...pagination,
          total: total
        });
        
        // Trigger evento afterLoad
        if (listeners.afterLoad) {
          listeners.afterLoad(response);
        }
      })
      .catch(error => {
        console.error('Erro ao carregar dados:', error);
        
        // Trigger evento loadError
        if (listeners.loadError) {
          listeners.loadError(error);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  
  // Função para realizar busca
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    
    // Atualiza os critérios de busca na store
    loadData({ 
      search: { 
        field: dataIndex, 
        value: selectedKeys[0] 
      } 
    });
  };
  
  // Função para resetar busca
  const handleReset = (clearFilters, confirm, dataIndex) => {
    clearFilters();
    setSearchText('');
    
    // Limpa o filtro na store
    loadData({ 
      search: null 
    });
  };
  
  // Função para tratamento de mudança de paginação e ordenação
  const handleTableChange = (pagination, filters, sorter) => {
    setPagination(pagination);
    
    loadData({
      page: pagination.current,
      pageSize: pagination.pageSize,
      sort: sorter.field ? {
        field: sorter.field,
        order: sorter.order
      } : null
    });
    
    // Trigger evento change
    if (listeners.change) {
      listeners.change(pagination, filters, sorter);
    }
  };
  
  // Componente de filtro para as colunas
  const getColumnSearchProps = (dataIndex, title) => {
    if (!filterEnabled) return {};
    
    return {
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={searchInput}
            placeholder={`Buscar ${title}`}
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Buscar
            </Button>
            <Button
              onClick={() => handleReset(clearFilters, confirm, dataIndex)}
              size="small"
              style={{ width: 90 }}
            >
              Limpar
            </Button>
          </Space>
        </div>
      ),
      filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
      filterDropdownProps: {
        onOpenChange: visible => {
          if (visible) {
            setTimeout(() => searchInput.current?.select(), 100);
          }
        }
      },
      render: text =>
        searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ''}
          />
        ) : (
          text
        ),
    };
  };
  
  // Configuração das colunas
  const getColumns = () => {
    let tableColumns = columns.map(column => {
      const { 
        dataIndex, 
        title, 
        render, 
        width, 
        sortable = true,
        filterable = true,
        align = 'left',
        fixed,
        hidden
      } = column;
      
      if (hidden) return null;
      
      let columnConfig = {
        title,
        dataIndex,
        key: dataIndex,
        width,
        align,
        fixed,
        sorter: sortEnabled && sortable,
        ...filterable ? getColumnSearchProps(dataIndex, title) : {}
      };
      
      // Se tiver uma função render customizada
      if (render) {
        columnConfig.render = (text, record, index) => render(text, record, index);
      }
      
      return columnConfig;
    }).filter(Boolean); // Remove colunas null (hidden)
    
    // Adiciona coluna de ações se necessário
    if (rowActionsEnabled && actions.length > 0) {
      tableColumns.push({
        title: 'Ações',
        key: 'actions',
        fixed: 'right',
        width: 120,
        render: (_, record) => (
          <Space size="small">
            {actions.map((action, index) => {
              const { type, icon, tooltip, onClick, danger, confirm } = action;
              
              // Se for uma ação de editar
              if (type === 'edit') {
                return (
                  <Tooltip key={index} title={tooltip || 'Editar'}>
                    <Button 
                      type="link" 
                      size="small" 
                      icon={icon || <EditOutlined />} 
                      onClick={() => onClick(record)}
                    />
                  </Tooltip>
                );
              }
              
              // Se for uma ação de excluir
              if (type === 'delete') {
                return (
                  <Popconfirm
                    key={index}
                    title={confirm || "Tem certeza que deseja excluir este registro?"}
                    onConfirm={() => onClick(record)}
                    okText="Sim"
                    cancelText="Não"
                  >
                    <Tooltip title={tooltip || 'Excluir'}>
                      <Button 
                        type="link" 
                        size="small" 
                        danger={danger !== false}
                        icon={icon || <DeleteOutlined />} 
                      />
                    </Tooltip>
                  </Popconfirm>
                );
              }
              
              // Ação customizada
              return (
                <Tooltip key={index} title={tooltip}>
                  <Button 
                    type="link" 
                    size="small" 
                    icon={icon} 
                    onClick={() => onClick(record)}
                    danger={danger}
                  />
                </Tooltip>
              );
            })}
          </Space>
        ),
      });
    }
    
    return tableColumns;
  };
  
  // Configuração da barra de ferramentas
  const renderToolbar = () => {
    if (!toolbar || toolbar.length === 0) {
      return null;
    }
    
    return (
      <div style={{ marginBottom: 16 }}>
        <Space>
          {toolbar.map((item, index) => {
            const { type, text, icon, onClick } = item;
            
            if (type === 'add') {
              return (
                <Button 
                  key={index}
                  type="primary" 
                  icon={icon || <PlusOutlined />} 
                  onClick={onClick}
                >
                  {text || 'Adicionar'}
                </Button>
              );
            }
            
            if (type === 'reload') {
              return (
                <Button 
                  key={index}
                  icon={icon || <ReloadOutlined />} 
                  onClick={() => loadData()}
                >
                  {text || 'Atualizar'}
                </Button>
              );
            }
            
            // Botão customizado
            return (
              <Button 
                key={index}
                type={item.buttonType || 'default'}
                icon={icon} 
                onClick={onClick}
              >
                {text}
              </Button>
            );
          })}
        </Space>
      </div>
    );
  };
  
  // Configuração de seleção de linhas
  const rowSelection = selectionEnabled ? {
    onChange: (selectedRowKeys, selectedRows) => {
      if (listeners.selectionChange) {
        listeners.selectionChange(selectedRowKeys, selectedRows);
      }
    }
  } : undefined;
  
  // Renderização do componente
  const tableComponent = (
    <>
      {renderToolbar()}
      
      <Table
        columns={getColumns()}
        dataSource={data}
        rowKey={rowKey}
        pagination={paginationEnabled ? pagination : false}
        loading={loading}
        onChange={handleTableChange}
        rowSelection={rowSelection}
        scroll={{ x: 'max-content' }}
      />
    </>
  );
  
  // Wrap com Card se tiver título
  if (title) {
    return (
      <Card title={title}>
        {tableComponent}
      </Card>
    );
  }
  
  return tableComponent;
};

export default GridBuild;