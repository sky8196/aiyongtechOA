import React from 'react';
import './index.scss'
import { Button, Modal, Form, Input, message } from 'antd';

import { hasRegister, insertMyCustomer } from '@/services/newCustomer';
import { connect } from 'dva';
const { TextArea } = Input;

const NewCustomer = Form.create({ name: 'form_in_modal' })(
	class extends React.Component {
		constructor(props) {
			super(props);
			this.state = {
				hasFeedback: false,
				validateStatus: '',
				help: '',
				visible: false,
        userID:this.props.status
      };
      this.newCustomer = this.newCustomer.bind(this);
			this.registered = this.registered.bind(this);
			this.showNewCustomer = this.showNewCustomer.bind(this);
			this.onOk = this.onOk.bind(this);
			this.hideModal = this.hideModal.bind(this);
		}
		async registered(name) {
			if (name !== '' && this.props.form.getFieldValue('name')!=='' && this.props.form.getFieldValue('name')!==undefined) {
        const hasregister = await this.getRegister(name);
				if (hasregister === true) {
					this.setState({
						hasFeedback: true,
						validateStatus: 'error',
						help: '该名称已存在'
					});
					return true;
				} else {
					this.setState({
						hasFeedback: false,
						validateStatus: '',
						help: ''
					});
					return false;
				}
			} else {
				this.setState({
					hasFeedback: true,
					validateStatus: 'error',
					help: '公司名称不能为空'
        });
        return true;
			}
    }
    async newCustomer(form){
      let pamers=Object.assign(form,{id:this.state.userID})
      const result = await this.insertCustomer(pamers);
      return result;
    }
    async getRegister(name) {
      const response = await hasRegister(name);
      if (response === undefined || response[0] === 403 || response[1] === false) {
        return false;
      } else {
        return true;
      }
    }
    async insertCustomer(form) {
      const response = await insertMyCustomer(form);
      if (response === undefined || response[0] === 403 || response[1] === false) {
        return false;
      } else {
        return true;
      }
    }
		onChangeName = ({ target: { value } }) => {
      this.props.form.setFieldsValue({
        name: value,
      });
			this.registered(value);
		};
		showNewCustomer() {
			const visible = true;
			this.setState({
				visible: visible
			});
		}
		onOk = () => {
			const hasregister = this.registered(this.props.form.getFieldValue('name'));
			if (hasregister === true || this.props.form.getFieldValue('name') === '' || this.state.hasFeedback) {
				message.error('不能提交,请检查输入!');
			} else if(this.newCustomer(this.props.form.getFieldsValue())){
				message.success('保存成功');
				this.props.form.resetFields();
				this.setState({
					hasFeedback: false,
					validateStatus: '',
					help: '',
					visible: false
        });
        const {refreshList} = this.props;
        refreshList(this.state.userID);
			}else{
        message.error('保存失败');
      }
		};
		hideModal = () => {
			this.props.form.resetFields();
			this.setState({
				hasFeedback: false,
				validateStatus: '',
				help: '',
				visible: false
			});
		};
		render() {
			const { form } = this.props;
			const { getFieldDecorator } = form;
			const formItemLayout = {
				labelCol: { span: 4 },
				wrapperCol: { span: 20 }
			};
			return (
				<span className="inlineRight margin">
					<Button id="add" icon="usergroup-add" onClick={this.showNewCustomer}>
						新增客户
					</Button>
					{this.state.visible === false ? null : (
						<Modal
							title="新增客户"
							maskClosable={false}
							visible={this.state.visible}
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
									hasFeedback={this.state.hasFeedback}
									validateStatus={this.state.validateStatus}
									help={this.state.help}
								>
									{getFieldDecorator('name')(<Input onChange={this.onChangeName} allowClear />)}
								</Form.Item>
								<Form.Item label="联系人" {...formItemLayout}>
									{getFieldDecorator('contact')(<Input allowClear />)}
								</Form.Item>
								<Form.Item label="联系方式" {...formItemLayout}>
									{getFieldDecorator('tel')(<Input allowClear />)}
								</Form.Item>
								<Form.Item label="产品" {...formItemLayout}>
									{getFieldDecorator('product')(
										<TextArea placeholder="" autoSize={{ minRows: 3, maxRows: 5 }} allowClear />
									)}
								</Form.Item>
							</Form>
						</Modal>
					)}
				</span>
			);
		}
	}
);
// export default NewCustomer;
export default connect(({login:{status}})=>({status}))(NewCustomer)
