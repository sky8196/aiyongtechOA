import React from 'react';
import { Card, Descriptions, Button, Steps } from 'antd';
import Link from 'umi/link';
import { getCustomerDetail } from '@/services/customerDetail';
import style from './index.scss'
const { Step } = Steps;
let isPublic = 1;

class CustomerDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      link: this.props.match.url.substr(0, this.props.match.url.lastIndexOf('/')),
      id: this.props.match.params.id,
      list: {},
    };
    this.getCustomerDetail = this.getCustomerDetail.bind(this);
  }

  componentDidMount() {
    if (this.state.link === '/myCustomer') {
      isPublic = 0;
    }
    this.getCustomerDetail(this.state.id, isPublic);
  }

  async getCustomerDetail(id, isPublic) {
    const data = await this.customerDetail(id, isPublic);
    this.setState({
      list: data,
    });
  }

  async customerDetail(id, isPublic) {
    const response = await getCustomerDetail(id, isPublic);
    console.log(response);
    let data = {
      key: 0,
      name: '',
      contact: '',
      tel: '',
      time: '',
      releaser: '',
      creater: '',
      state: 0,
      product: '',
    };
    if (response === undefined || response[0] === 403) {
      return data;
    }
    data.key = response[1][0].CID; // id
    data.name = response[1][0].CName; // 公司名字
    data.contact = response[1][0].CContact; // 联系人
    data.tel = response[1][0].CTel; // 电话
    data.time = response[1][0].CTime; // 时间
    data.releaser = response[1][0].UName; // 最后释放人
    data.creater = response[1][0].CUName; // 创建人
    data.state = response[1][0].CState; // 转态
    data.product = response[1][0].CProduct; // 产品
    data.detail=response[1][0].CDetail; // 备注
    data.detail2=response[1][0].CDetail2; // 备注2
    data.detail3=response[1][0].CDetail3; // 备注3
    return data;
  }

  render() {
    const current = this.state.list.state;
    console.log(current);
    return (
      <div id="main" style={{ padding: 20, backgroundColor: 'white' }}>
        <Card title="客户详情" bordered={false} extra={<Link to={this.state.link}><Button>返回</Button></Link>}>
          <Descriptions column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}>
            <Descriptions.Item label="公司名称">{this.state.list.name}</Descriptions.Item>
            <Descriptions.Item label="联系人">{this.state.list.contact}</Descriptions.Item>
            <Descriptions.Item label="联系方式">{this.state.list.tel}</Descriptions.Item>
            <Descriptions.Item label="创建人">{this.state.list.creater}</Descriptions.Item>
            {this.state.link === '/customerList' ? (
              <Descriptions.Item label="最后释放人">{this.state.list.releaser}</Descriptions.Item>
            ) : null
            }
            <Descriptions.Item label="产品">{this.state.list.product}</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Steps current={Number(current)} size="default" className={style.customerDetailSteps}>
                <Step title="录入信息" description={this.state.list.time} />
                <Step title="已沟通" style={{ width: '200px' }} description={this.state.list.detail}/>
                <Step title="已拜访" style={{ width: '200px' }} description={this.state.list.detail2}/>
                <Step title="已签单" style={{ width: '200px' }} description={this.state.list.detail3}/>
              </Steps>
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>
    );
  }
}

export default CustomerDetail;
