import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Input, message } from 'antd';
import { updateCustomerService } from '@/services/customerList';

const { TextArea } = Input;

/** 修改用户数据 */
class UpdateCustomer extends React.Component {
    /** 构造函数 */
    constructor(props) {
        super(props);
        this.state = { visible: false };
    }

    // 打modal
    showUpdateCustomer = () => {
        this.setState({ visible: true });
    };

    // 确认修改
    onOkUpdate = async () => {
        const { form, cid, updatePage } = this.props;
        this.setState({ visible: false });
        const data = await Object.assign(form.getFieldsValue(), { id: cid });
        const response = await updateCustomerService(data);
        if (response === undefined || response.code === 403 || response.result === false) {
            message.error('修改失败!');
        } else {
            const hide = message.loading('正在保存请稍后...', 0);
            await updatePage();
            await setTimeout(hide, 1500);
            await message.success('修改成功', 2);
        }
    };

    // 取消修改
    hideModalUpdate = () => {
        this.setState({ visible: false });
        message.warning('取消修改');
    };

    /** 组件渲染 */
    render() {
        const { form, record } = this.props;
        const { visible } = this.state;
        const { getFieldDecorator } = form;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        };
        return (
            <span>
                <span
                    className="greenText"
                    onClick={this.showUpdateCustomer}
                    style={{ cursor: 'pointer' }}
                >
                    修改
                </span>
                {visible === false ? null : (
                    <Modal
                        title="修改客户信息"
                        maskClosable={false}
                        visible={visible}
                        onOk={this.onOkUpdate}
                        onCancel={() => {
                            form.resetFields();
                            this.hideModalUpdate();
                        }}
                        okText="保存"
                        cancelText="取消"
                    >
                        <Form layout="horizontal">
                            <Form.Item label="公司名称" {...formItemLayout}>
                                {getFieldDecorator('companyName', { initialValue: record.companyName })(<Input targ="name" allowClear disabled />)}
                            </Form.Item>
                            <Form.Item label="联系人" {...formItemLayout}>
                                {getFieldDecorator('contact', { initialValue: record.contact, rules: [{ required: true, message: '不能为空' }] })(
                                    <Input allowClear placeholder="请输入" targ="contact" />,
                                )}
                            </Form.Item>
                            <Form.Item label="联系方式" {...formItemLayout}>
                                {getFieldDecorator('contactTel', { initialValue: record.contactTel, rules: [{ required: true, message: '不能为空' }] })(
                                    <Input allowClear targ="tel" />,
                                )}
                            </Form.Item>
                            <Form.Item label="产品" {...formItemLayout}>
                                {getFieldDecorator('product', { initialValue: record.product, rules: [{ required: true, message: '不能为空' }] })(
                                    <TextArea
                                        targ="product"
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
UpdateCustomer.defaultProps = { form: '', cid: '', updatePage: '', record: '' };
UpdateCustomer.propTypes = { form: PropTypes.any, cid: PropTypes.any, updatePage: PropTypes.any, record: PropTypes.any };
const UpdateCustomerForm = Form.create({ name: 'form_in_modal' })(UpdateCustomer);
export default UpdateCustomerForm;
