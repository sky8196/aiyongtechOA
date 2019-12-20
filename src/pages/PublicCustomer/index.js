import React from 'react';
import { Button, Table, Empty, Divider, message, Modal } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import './index.scss';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { getCustomerListService, pushToMyCustomerService } from '@/services/customerList';
import MoreConditionSearch from '@/components/MoreConditionSearch';
import UpdateCustomer from '@/components/UpdateCustomer';
import { tableUpdateDataProcessing, deleteCustomer } from '@/utils/customerGlobal';

moment.locale('zh-cn');
const { confirm } = Modal;

/** 公海页面 */
class PublicCustomer extends React.Component {
    /** 构造函数 */
    constructor(props) {
        super(props);
        this.state = {
            rootPower: '29', // root权限控制
            dataSource: [],
            selectedRowKeys: [],
            columns: [],
        };
    }

    /** 组件挂载 */
    componentDidMount() {
        this.getPublicCustomer();
    }

    /** 异步请求数据 */
    async getPublicCustomer() {
        const { UID } = this.props;
        const { rootPower } = this.state;
        const data = await this.getDataSource();
        const columns = [
            {
                title: '公司名称',
                dataIndex: 'companyName',
                ellipsis: true,
                width: '13%',
            },
            {
                title: '联系人',
                dataIndex: 'contact',
                ellipsis: true,
                width: '8%',
            },
            {
                title: '联系方式',
                dataIndex: 'contactTel',
                ellipsis: true,
                width: '10%',
            },
            {
                title: '最后释放时间',
                dataIndex: 'lastReleaseTime',
                width: '13%',
            },
            {
                title: '最后释放人',
                dataIndex: 'lastReleaseUserName',
                ellipsis: true,
                width: '8%',
            },
            {
                title: '创建人',
                dataIndex: 'createUserName',
                ellipsis: true,
                width: '8%',
            },
            {
                title: '状态',
                dataIndex: 'presentState',
                width: '8%',
                render: (presentState) => {
                    let option = '';
                    if (presentState === '3') {
                        option = <span className="redText">已签单</span>;
                    } else if (presentState === '2') {
                        option = <span className="blueText">已拜访</span>;
                    } else if (presentState === '1') {
                        option = <span className="greenText">已沟通</span>;
                    } else {
                        option = <span className="grayText">未处理</span>;
                    }
                    return option;
                },
            },
            {
                title: '产品',
                dataIndex: 'product',
                ellipsis: true,
            },
            {
                title: '操作',
                dataIndex: 'id',
                render: (id, record) => (UID !== rootPower ? (
                    <span>
                        <span
                            className="blueText"
                            onClick={() => {
                                router.push(`/customerList/${id}`);
                            }}
                            style={{ cursor: 'pointer' }}
                        >
                                查看详情
                        </span>
                    </span>
                ) : (
                    <span>
                        <span
                            className="blueText"
                            onClick={() => {
                                router.push(`/customerList/${id}`);
                            }}
                            style={{ cursor: 'pointer' }}
                        >
                                查看详情
                        </span>
                        <Divider type="vertical" />
                        <UpdateCustomer
                            record={record}
                            cid={id}
                            updatePage={() => this.getPublicCustomer(UID)}
                        />

                        <Divider type="vertical" />
                        <span
                            className="redText"
                            onClick={() => this.showDeleteConfirm(id)}
                            style={{ cursor: 'pointer' }}
                        >
                                删除
                        </span>
                    </span>
                )),
            },
        ];
        this.setState({
            dataSource: data,
            columns,
        });
    }

    getDataSource = async () => {
        const response = await getCustomerListService();
        let data = [];
        if (response === undefined || response.code === 403 || response.code === 404) {
            message.error('获取失败或没有数据');
            return data;
        }
        data = response.result;
        return data;
    };

    // 查询更新DataSource
    updateDataSource = (data) => {
        this.setState({ dataSource: data });
    };

    // 伪删除事件
    showDeleteConfirm = (id) => {
        deleteCustomer(id, this.onceUpdateDataSource);
    };

    // 批量转换私有客户
    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    };

    pushToMyCustomer = async () => {
        const { UID } = this.props;
        if (this.state.selectedRowKeys.length === 0) {
            message.warning('请先选择客户');
        } else {
            confirm({
                title: '确定要添加到我的客户吗?',
                content: '添加后可在我的客户查看',
                okText: '确定',
                cancelText: '取消',
                onOk: async () => {
                    const response = await pushToMyCustomerService({
                        idArray: this.state.selectedRowKeys,
                        UID,
                    });
                    if (response === undefined || response[0] === 403 || response[3] === false) {
                        message.error('添加失败');
                        return;
                    }
                    await this.onceUpdateDataSource(this.state.selectedRowKeys);
                    this.setState({ selectedRowKeys: [] }, () => {
                        message.success('添加成功');
                    });
                },
                onCancel: () => {
                    message.warning('取消添加');
                },
            });
        }
    };

    // 再次更新dataSource
    onceUpdateDataSource = (conditionArray) => {
        const { dataSource } = this.state;
        const newData = tableUpdateDataProcessing(conditionArray, dataSource);
        this.setState({ dataSource: newData });
    };

    /** 渲染页面 */
    render() {
        const { match } = this.props;
        const { selectedRowKeys, columns, dataSource } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };

        return (
            <div>
                <div id="topmain">
                    <MoreConditionSearch updateDataSource={this.updateDataSource} link={match.url} />
                    <div className="topmain-right">
                        <Button className="inlineRight margin" icon="rollback" onClick={() => { window.location.href = '/index-transfer.shtml'; return 0; }}>
                            返回OA
                        </Button>
                        <Button
                            id="add"
                            className="inlineRight margin"
                            icon="plus"
                            onClick={this.pushToMyCustomer}
                        >
                            添加至我的客户
                        </Button>
                    </div>
                </div>
                <div id="main">
                    {dataSource.length === 0 ? (
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    ) : (
                        <Table
                            rowKey="id"
                            rowSelection={rowSelection}
                            columns={columns}
                            dataSource={dataSource}
                            footer={() => (
                                <span>
                                    {' '}
                                    共
                                    {dataSource.length}
                                    条数据，当前页最多展示10条
                                </span>
                            )}
                        />
                    )}
                </div>
            </div>
        );
    }
}
PublicCustomer.defaultProps = { UID: 0, match: '' };
PublicCustomer.propTypes = { UID: PropTypes.any, match: PropTypes.any };
export default connect(({ login: { UID } }) => ({ UID }))(PublicCustomer);
