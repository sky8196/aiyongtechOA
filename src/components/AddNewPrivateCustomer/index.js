import React from 'react';
import './index.scss';
import { Button, Modal, Form, Input, message } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { hasRegister, insertMyCustomer } from '@/services/newCustomer';

const { TextArea } = Input;

/** 新增私有客户 */
class AddNewPrivateCustomer extends React.Component {
    /** 构造函数 */
    constructor(props) {
        super(props);
        this.state = {
            hasFeedback: false,
            validateStatus: '',
            help: '',
            visible: false,
        };
    }

    registered = async (name) => {
        const { form } = this.props;
        if (
            name !== ''
            && form.getFieldValue('name') !== ''
            && form.getFieldValue('name') !== undefined
        ) {
            const hasregister = await this.getRegister(name);
            if (hasregister === true) {
                this.setState({
                    hasFeedback: true,
                    validateStatus: 'error',
                    help: '该名称已存在',
                });
                return true;
            }
            this.setState({
                hasFeedback: false,
                validateStatus: '',
                help: '',
            });
            return false;
        }
        this.setState({
            hasFeedback: true,
            validateStatus: 'error',
            help: '公司名称不能为空',
        });
        return true;
    };

    newCustomer = async (form) => {
        const { status } = this.props;
        const pamers = Object.assign(form, { id: status });
        const result = await this.insertCustomer(pamers);
        return result;
    };

    getRegister = async (name) => {
        const response = await hasRegister(name);
        if (response === undefined || response[0] === 403 || response[1] === false) {
            return false;
        }
        return true;
    };

    insertCustomer = async (form) => {
        const response = await insertMyCustomer(form);
        if (response === undefined || response[0] === 403 || response[1] === false) {
            return false;
        }
        return true;
    };

    onChangeName = ({ target: { value } }) => {
        const { form } = this.props;
        form.setFieldsValue({ name: value });
        this.registered(value);
    };

    showNewCustomer = () => {
        const visible = true;
        this.setState({ visible });
    };

    onOk = () => {
        const { refreshList, status, form } = this.props;
        const { hasFeedback } = this.state;
        const hasregister = this.registered(form.getFieldValue('name'));
        if (
            hasregister === true
            || form.getFieldValue('name') === ''
            || hasFeedback
        ) {
            message.error('不能提交,请检查输入!');
        } else if (this.newCustomer(form.getFieldsValue())) {
            message.success('保存成功');
            form.resetFields();
            this.setState({
                hasFeedback: false,
                validateStatus: '',
                help: '',
                visible: false,
            });
            refreshList(status);
        } else {
            message.error('保存失败');
        }
    };

    hideModal = () => {
        const { form } = this.props;
        form.resetFields();
        this.setState({
            hasFeedback: false,
            validateStatus: '',
            help: '',
            visible: false,
        });
    };

    /** 渲染组件 */
    render() {
        const { form } = this.props;
        const { visible, hasFeedback, validateStatus, help } = this.state;
        const { getFieldDecorator } = form;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        };
        return (
            <span className="inlineRight margin">
                <Button id="add" icon="usergroup-add" onClick={this.showNewCustomer}>
                    新增客户
                </Button>
                {visible === false ? null : (
                    <Modal
                        title="新增客户"
                        maskClosable={false}
                        visible={visible}
                        onOk={this.onOk}
                        onCancel={() => {
                            this.hideModal();
                        }}
                        okText="保存"
                        cancelText="取消"
                    >
                        <Form layout="horizontal">
                            <Form.Item
                                label="公司名称"
                                {...formItemLayout}
                                hasFeedback={hasFeedback}
                                validateStatus={validateStatus}
                                help={help}
                            >
                                {getFieldDecorator('name')(
                                    <Input onChange={this.onChangeName} allowClear />,
                                )}
                            </Form.Item>
                            <Form.Item label="联系人" {...formItemLayout}>
                                {getFieldDecorator('contact')(<Input allowClear />)}
                            </Form.Item>
                            <Form.Item label="联系方式" {...formItemLayout}>
                                {getFieldDecorator('tel')(<Input allowClear />)}
                            </Form.Item>
                            <Form.Item label="产品" {...formItemLayout}>
                                {getFieldDecorator('product')(
                                    <TextArea
                                        placeholder=""
                                        autoSize={{ minRows: 3, maxRows: 5 }}
                                        allowClear
                                    />,
                                )}
                            </Form.Item>
                        </Form>
                    </Modal>
                )}
            </span>
        );
    }
}

AddNewPrivateCustomer.defaultProps = { status: 0, form: '', refreshList: '' };
AddNewPrivateCustomer.propTypes = { status: PropTypes.any, form: PropTypes.any, refreshList: PropTypes.any };
const AddNewPrivateCustomerForm = Form.create({ name: 'form_in_modal' })(AddNewPrivateCustomer);
export default connect(({ login: { status } }) => ({ status }))(AddNewPrivateCustomerForm);
