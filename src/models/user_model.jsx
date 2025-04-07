import { ModelBuild } from '../core/model-build';

// Exemplo de definição de modelo com campos e validações
const userModel = new ModelBuild({
  name: 'User',
  fields: [
    { 
        name: 'id', 
        type: 'number' 
    },
    { 
        name: 'name', 
        type: 'string', 
        label: 'Nome', 
        validators: [ { type: 'required', message: 'O nome é obrigatório' } ]
    },
    { 
        name: 'email', 
        type: 'string', 
        label: 'E-mail',
        validators: [
            { type: 'required', message: 'O e-mail é obrigatório' },
            { type: 'email', message: 'E-mail inválido' }
        ]
    },
    { 
        name: 'type', 
        type: 'select', 
        label: 'Tipo',
        validators: [
            { type: 'required', message: 'O tipo é obrigatório' }
        ],
        config: {
            options: [
                { value: 'admin', label: 'Administrador' },
                { value: 'user', label: 'Usuário' }
            ]
        }
    },
    { name: 'active', type: 'boolean', label: 'Ativo' },
    { name: 'birthDate', type: 'date', label: 'Data de Nascimento' }
  ],
  proxy: {
    type: 'rest',
    url: 'http://localhost:3000/api/users',
    reader: {
      root: 'data',
      totalProperty: 'total'
    }
  }
});

// Exportando o modelo para ser usado em outros arquivos
export { userModel };

// Também podemos exportar como padrão para facilitar a importação
export default userModel;
