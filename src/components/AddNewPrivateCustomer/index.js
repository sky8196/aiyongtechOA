import React from 'react';
import './index.scss';
import { Button, Modal, Form, Input, message } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { testRegisterService, insertMyCustomerService } from '@/services/addNewPrivateCustomer';

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
            registerName: false,
        };
    }

    /** 打开model */
    showNewCustomer = () => {
        const visible = true;
        this.setState({ visible });
    };

    /** 检测公司名字是否为空 */
    testRegistered = ({ target: { value } }) => {
        if (value === '') {
            this.setState({
                hasFeedback: true,
                validateStatus: 'error',
                help: '公司名称不能为空',
            });
        } else {
            this.getRegister(value);
        }
    };

    /** 检测公司名字是否可用 */
    getRegister = async (companyName) => {
        const response = await testRegisterService(companyName);
        if (response === undefined || response.result === false) {
            this.setState({
                hasFeedback: false,
                validateStatus: 'success',
                help: '该客户未客保',
                registerName: true,
            });
        } else {
            const { presentState } = response;
            let lsString = '该客户已存在';
            if (presentState === '0') {
                lsString = '已客保，未处理';
            } else if (presentState === '1') {
                lsString = '已客保，已沟通';
            } else if (presentState === '2') {
                lsString = '已客保，已拜访';
            } else if (presentState === '3') {
                lsString = '已签单';
            }
            this.setState({
                hasFeedback: true,
                validateStatus: 'error',
                help: lsString,
                registerName: false,
            });
        }
    };

    /** 确认增加 */
    onOk = async () => {
        const { refreshList, UID, UName, form } = this.props;
        const { registerName } = this.state;
        if (registerName === false) {
            this.setState({
                hasFeedback: true,
                validateStatus: 'error',
                help: '公司名称不能为空',
            });
        } else {
            form.validateFields(async (errors) => {
                if (!errors) {
                    const data = Object.assign(form.getFieldsValue(), { UID, UName });
                    const response = await insertMyCustomerService(data);
                    if (response === undefined || response.code === 403) {
                        message.error('保存失败');
                    } else {
                        const hide = message.loading('正在保存请稍后...', 0);
                        await setTimeout(hide, 1000);
                    }
                    form.resetFields();
                    this.setState({
                        hasFeedback: false,
                        validateStatus: '',
                        help: '',
                        visible: false,
                    }, () => { refreshList(UID); });
                }
            });
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
                                required="true"
                                help={help}
                            >
                                {getFieldDecorator('companyName')(
                                    <Input allowClear onBlur={this.testRegistered} onChange={() => { this.setState({ registerName: false }); }} />,
                                )}
                            </Form.Item>
                            <Form.Item label="联系人" {...formItemLayout}>
                                {getFieldDecorator('contact', { rules: [{ required: true, message: '请输入联系人' }] })(<Input allowClear />)}
                            </Form.Item>
                            <Form.Item label="联系方式" {...formItemLayout}>
                                {getFieldDecorator('contactTel', { rules: [{ required: true, message: '请输入联系方式' }] })(<Input allowClear />)}
                            </Form.Item>
                            <Form.Item label="产品" {...formItemLayout}>
                                {getFieldDecorator('product', { rules: [{ required: true, message: '请填写产品' }] })(
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

AddNewPrivateCustomer.defaultProps = { UID: 0, UName: '', form: '', refreshList: '' };
AddNewPrivateCustomer.propTypes = { UID: PropTypes.any, UName: PropTypes.any, form: PropTypes.any, refreshList: PropTypes.any };
const AddNewPrivateCustomerForm = Form.create({ name: 'form_in_modal' })(AddNewPrivateCustomer);
export default connect(({ login: { UID, UName } }) => ({ UID, UName }))(AddNewPrivateCustomerForm);
