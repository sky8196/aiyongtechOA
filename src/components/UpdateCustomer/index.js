import React from 'react';
import { Modal,Form, Input,message} from 'antd';
import { updateCustomer } from '@/services/customerList';
const { TextArea } = Input;

const UpdateCustomer = Form.create({ name: 'form_in_modal' })(
class  extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            visible: false,// 操作Modal显示隐藏
        }
    }
    showUpdateCustomer=()=> {
      const visible = true
      this.setState({
        visible,
      });
    };
    onOkUpdate = async () => {
      this.setState({
        visible: false,
      });
      let data=await Object.assign(this.props.form.getFieldsValue(),{cid:this.props.cid})
      await updateCustomer({data})
      await this.props.updatePage();
      await message.success('修改成功');
    }
    hideModalUpdate = () => {
      this.setState({
        visible: false,
      });
    };
    render() {
        const {form,record} = this.props
        const { getFieldDecorator } = form;
        const formItemLayout ={
            labelCol: { span: 4 },
            wrapperCol: { span: 20 },
        }
        return (
            <span>
            <span className="greenText" onClick={this.showUpdateCustomer} style={{ cursor: "pointer" }}>修改</span>
            {
              this.state.visible === false ? null : (
                <Modal
                    title="修改客户信息"
                    maskClosable={false}
                    visible={this.state.visible}
                    onOk={this.onOkUpdate}
                    onCancel={()=>{
                        form.resetFields();
                        this.hideModalUpdate();
                    }}
                    okText="保存"
                    cancelText="取消"
                >
                    <Form layout="horizontal">
                <Form.Item label="公司名称" {...formItemLayout}>
                  {getFieldDecorator('name', {
                    initialValue: record.name,
                    rules: [{ required: true, message: 'Please input the title of collection!' }],
                  })(<Input
                    targ='name'
                    allowClear disabled/>)}
                </Form.Item>
                <Form.Item label="联系人" {...formItemLayout}>
                  {getFieldDecorator('contact',{initialValue: record.contact})(<Input
                  allowClear placeholder="请输入" targ='contact'  />)}
                </Form.Item>
                <Form.Item label="联系方式" {...formItemLayout}>
                  {getFieldDecorator('tel',{initialValue: record.tel})(<Input allowClear targ='tel'  />)}
                </Form.Item>
                <Form.Item label="产品" {...formItemLayout}>
                  {getFieldDecorator('product',{initialValue: record.product})(
                      <TextArea
                      targ='product'
                      placeholder=""
                      autoSize={{ minRows: 3, maxRows: 5 }}
                      allowClear />
                  )}
                </Form.Item>
              </Form>
                </Modal>
              )
            }
            </span>
        );
    }
}
);
export default UpdateCustomer;
