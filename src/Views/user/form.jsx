import React from 'react';
// Você precisará importar o userModel se ele não estiver definido aqui
import { userModel } from '../../models/user'; // ajuste conforme necessário

/**
 * Cria uma configuração de formulário para usuário
 * 
 * @param {Object} userModel - O modelo de usuário
 * @param {Object} options - Opções para customizar o formulário
 * @param {string} options.title - Título do formulário
 * @param {Function} options.onSave - Função a ser chamada ao salvar
 * @param {Function} options.onCancel - Função a ser chamada ao cancelar
 * @returns {Object} Configuração do formulário
 */
const createFormConfig = (userModel, options = {}) => {
    const {
        title = 'Cadastro de Usuário',
        onSave = () => console.log('Salvando...'),
        onCancel = () => console.log('Cancelado')
    } = options;

    return {
        xtype: 'form',
        title: title,
        layout: 'vertical',
        model: userModel,
        items: [
            {
                xtype: 'input',
                name: 'name',
                label: 'Nome',
                validators: [
                    { type: 'required', message: 'Nome é obrigatório' }
                ]
            },
            {
                xtype: 'input',
                name: 'email',
                label: 'E-mail',
                validators: [
                    { type: 'required', message: 'E-mail é obrigatório' },
                    { type: 'email', message: 'E-mail inválido' }
                ]
            },
            {
                xtype: 'select',
                name: 'type',
                label: 'Tipo',
                options: [
                    { value: 'admin', label: 'Administrador' },
                    { value: 'user', label: 'Usuário' }
                ]
            },
            {
                xtype: 'checkbox',
                name: 'active',
                label: 'Ativo'
            },
            {
                xtype: 'datepicker',
                name: 'birthDate',
                label: 'Data de Nascimento'
            }
        ],
        listeners: {
            afterLoad: (data) => {
                console.log('Dados carregados:', data);
            },
            afterSave: (data) => {
                console.log('Dados salvos:', data);
                onSave(data);
            }
        },
        buttons: [
            {
                text: 'Salvar',
                type: 'primary',
                htmlType: 'submit'
            },
            {
                text: 'Cancelar',
                htmlType: 'button',
                onClick: onCancel
            }
        ]
    };
};

export default createFormConfig;