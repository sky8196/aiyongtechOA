import React from 'react';
import { Card, Descriptions, Button, Steps } from 'antd';
import Link from 'umi/link';
import PropTypes from 'prop-types';
import { getCustomerDetail } from '@/services/customerDetail';
import style from './index.scss';

const { Step } = Steps;


/** 客户详情 */
class CustomerDetail extends React.Component {
    /** 构造函数 */
    constructor(props) {
        super(props);
        const { match } = this.props;
        this.state = {
            link: match.url.substr(0, match.url.lastIndexOf('/')),
            id: match.params.id,
            list: {},
        };
    }

    /** 组件挂载 */
    componentDidMount() {
        const { link, id } = this.state;
        let isPublic = 1;
        if (link === '/myCustomer') {
            isPublic = 0;
        }
        this.getCustomerDetail({ id, isPublic });
    }

    getCustomerDetail = async (params) => {
        const data = await this.customerDetail(params);
        this.setState({ list: data });
    };

    customerDetail = async (params) => {
        const response = await getCustomerDetail(params);
        console.log(response);
        const data = {
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
        data.detail = response[1][0].CDetail; // 备注
        data.detail2 = response[1][0].CDetail2; // 备注2
        data.detail3 = response[1][0].CDetail3; // 备注3
        return data;
    };

    /** 组件挂载 */
    render() {
        const { list, link } = this.state;
        const current = list.state;
        console.log(current);
        return (
            <div id="main" style={{ padding: 20, backgroundColor: 'white' }}>
                <Card
                    title="客户详情"
                    bordered={false}
                    extra={(
                        <Link to={link}>
                            <Button>返回</Button>
                        </Link>
                    )}
                >
                    <Descriptions column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}>
                        <Descriptions.Item label="公司名称">
                            {list.name}
                        </Descriptions.Item>
                        <Descriptions.Item label="联系人">
                            {list.contact}
                        </Descriptions.Item>
                        <Descriptions.Item label="联系方式">
                            {list.tel}
                        </Descriptions.Item>
                        <Descriptions.Item label="创建人">
                            {list.creater}
                        </Descriptions.Item>
                        {link === '/customerList' ? (
                            <Descriptions.Item label="最后释放人">
                                {list.releaser}
                            </Descriptions.Item>
                        ) : null}
                        <Descriptions.Item label="产品">
                            {list.product}
                        </Descriptions.Item>
                        <Descriptions.Item label="状态">
                            <Steps
                                current={Number(current)}
                                size="default"
                                className={style.customerDetailSteps}
                            >
                                <Step title="录入信息" description={list.time} />
                                <Step
                                    title="已沟通"
                                    style={{ width: '200px' }}
                                    description={list.detail}
                                />
                                <Step
                                    title="已拜访"
                                    style={{ width: '200px' }}
                                    description={list.detail2}
                                />
                                <Step
                                    title="已签单"
                                    style={{ width: '200px' }}
                                    description={list.detail3}
                                />
                            </Steps>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>
            </div>
        );
    }
}
CustomerDetail.defaultProps = { match: '' };
CustomerDetail.propTypes = { match: PropTypes.any };

export default CustomerDetail;
