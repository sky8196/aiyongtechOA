import React from 'react';
import { Button, Input, DatePicker, Select, Table, Empty, Tooltip, Divider, message, Modal } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import locale from 'antd/es/date-picker/locale/zh_CN';
import './index.scss';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { deleteMyCustomerService, getCustomerListService, pushToMyCustomerService } from '@/services/customerList';

import UpdateCustomer from '@/components/UpdateCustomer';

moment.locale('zh-cn');
const { confirm } = Modal;
const { RangePicker } = DatePicker;
const { Option } = Select;

/** 公海页面 */
class PublicCustomer extends React.Component {
    /** 构造函数 */
    constructor(props) {
        super(props);
        this.state = {
            rootPower: 1, // root权限控制
            dataSource: [],
            selectValue: 'none',
            selectedRowKeys: [],
            columns: [],
        };
        this.fnDebounce = false; // 函数防抖控制
        // console.log(this.props);
        // console.log('当前用户', this.state.userID);
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
            },
            {
                title: '联系人',
                dataIndex: 'contact',
            },
            {
                title: '联系方式',
                dataIndex: 'contactTel',
            },
            {
                title: '释放时间',
                dataIndex: 'lastReleaseTime',
            },
            {
                title: '最后释放人',
                dataIndex: 'lastReleaseUserName',
            },
            {
                title: '创建人',
                dataIndex: 'createUserName',
            },
            {
                title: '状态',
                dataIndex: 'presentState',
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
        console.log(response);
        if (response === undefined || response.code === 403) {
            message.error('获取失败或没有数据');
            return data;
        }
        data = response.result;
        return data;
    };

    // 伪删除事件
    showDeleteConfirm = (id) => {
        confirm({
            title: '确定要删除这条信息吗?',
            content: '删除后数据无法恢复!',
            okText: '删除',
            okType: 'danger',
            cancelText: '取消',
            onOk: () => {
                this.onOkDelete(id);
            },
            onCancel: () => {
                message.warning('取消删除');
            },
        });
    };

    onOkDelete = async (id) => {
        const response = await deleteMyCustomerService(id);
        if (response === undefined || response.code === 403 || response.result === false) {
            message.error('删除失败!');
        } else {
            await this.onceUpdateDataSource([id]);
            message.success('删除成功');
        }
    };

    // 批量转换私有客户
    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    };

    pushToMyCustomer = async () => {
        const { UID } = this.props;
        if (this.fnDebounce) {
            return;
        }
        this.fnDebounce = true;
        if (this.state.selectedRowKeys.length === 0) {
            message.warning('请先选择客户', 3, () => {
                this.fnDebounce = false;
            });
            return;
        }
        const response = await pushToMyCustomerService({
            cid: this.state.selectedRowKeys,
            userID: UID,
        });
        if (response === undefined || response[0] === 403 || response[3] === false) {
            message.error('添加失败');
            return;
        }
        this.onceUpdateDataSource(this.state.selectedRowKeys);
        this.setState({ selectedRowKeys: [] }, () => {
            message.success('添加成功', 3, () => {
                this.fnDebounce = false;
            });
        });
    };

    stateSelectChange = (value) => {
        let lsvalue = value;
        if (lsvalue === undefined) {
            lsvalue = 'none';
        }
        this.setState({ selectValue: lsvalue });
    };

    // 再次更新dataSource
    onceUpdateDataSource = (dataArray) => {
        const { dataSource } = this.state;
        const arr = dataSource;
        for (let i = 0; i < arr.length; i += 1) {
            for (let j = 0; j < dataArray.length; j += 1) {
                if (arr[i].key === dataArray[j]) {
                    arr.splice(i, 1);
                }
            }
        }
        this.setState({ dataSource: arr });
    };

    /** 渲染页面 */
    render() {
        const { selectedRowKeys, columns, dataSource, selectValue } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };

        return (
            <div>
                <div id="topmain">
                    <div className="topmain-left">
                        <Tooltip placement="bottomLeft" title="公司名称或联系人或电话">
                            <Input
                                className="margin"
                                style={{ width: '200px' }}
                                placeholder="请输入"
                                allowClear
                            />
                        </Tooltip>
                        <Select
                            id="stateSelect"
                            className="margin"
                            defaultValue="none"
                            value={selectValue}
                            style={{ width: '200px' }}
                            allowClear
                            onChange={this.stateSelectChange}
                        >
                            <Option style={{ display: 'none' }} value="none">
                                请选择
                            </Option>
                            <Option value="all">全部</Option>
                            <Option value="talked">已沟通</Option>
                            <Option value="visited">已拜访</Option>
                            <Option value="done">已签单</Option>
                        </Select>
                        <RangePicker className="margin" locale={locale} />
                        <Button className="margin" type="primary" icon="search">
                            查询
                        </Button>
                    </div>
                    <div className="topmain-right">
                        <Button className="inlineRight margin" icon="rollback">
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
PublicCustomer.defaultProps = { UID: 0 };
PublicCustomer.propTypes = { UID: PropTypes.any };
export default connect(({ login: { UID } }) => ({ UID }))(PublicCustomer);
