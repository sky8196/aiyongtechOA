import React from 'react';
import { Card, Descriptions, Button, Steps, message } from 'antd';
import Link from 'umi/link';
import PropTypes from 'prop-types';
import getCustomerDetailService from '@/services/customerDetail';
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
        const { id } = this.state;
        this.getCustomerDetail(id);
    }

    getCustomerDetail = async (params) => {
        const data = await this.customerDetail(params);
        this.setState({ list: data });
    };

    customerDetail = async (params) => {
        const response = await getCustomerDetailService(params);
        let data = {};
        if (response === undefined || response.code === 403) {
            message.error('获取失败或没有数据');
            return data;
        }
        data = response.result;
        return data;
    };

    /** 组件挂载 */
    render() {
        const { list, link } = this.state;
        const current = list.presentState;
        return (
            <div className="detail-box">
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
                            {list.companyName}
                        </Descriptions.Item>
                        <Descriptions.Item label="联系人">
                            {list.contact}
                        </Descriptions.Item>
                        <Descriptions.Item label="联系方式">
                            {list.contactTel}
                        </Descriptions.Item>
                        <Descriptions.Item label="创建人">
                            {list.createUserName}
                        </Descriptions.Item>
                        {link === '/customerList' ? (
                            <Descriptions.Item label="最后释放人">
                                {list.lastReleaseUserName}
                            </Descriptions.Item>
                        ) : null}
                        <Descriptions.Item label="产品">
                            <div>{list.product}</div>
                        </Descriptions.Item>
                        <Descriptions.Item label="状态">
                            <Steps
                                current={Number(current)}
                                size="default"
                                className={style.customerDetailSteps}
                            >
                                <Step title="录入信息" description={list.createTime} />
                                <Step
                                    title="已沟通"
                                    style={{ width: '200px' }}
                                    description={list.connectNotes}
                                />
                                <Step
                                    title="已拜访"
                                    style={{ width: '200px' }}
                                    description={list.visitNotes}
                                />
                                <Step
                                    title="已签单"
                                    style={{ width: '200px' }}
                                    description={list.signingNotes}
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
