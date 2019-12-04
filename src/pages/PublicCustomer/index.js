import React from 'react';
import { Button, Input, DatePicker, Select, Table, Empty, Tooltip, Divider, message, Modal } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import locale from 'antd/es/date-picker/locale/zh_CN';
import './index.scss';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { getCustomerListService, pushToMyCustomerService, searchCustomerService } from '@/services/customerList';

import UpdateCustomer from '@/components/UpdateCustomer';
import { emptyOrBlank } from '@/utils/common';
import { tableUpdateDataProcessing, deleteCustomer } from '@/utils/customerGlobal';

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
            selectedRowKeys: [],
            columns: [],
            selectValue: 'none',
            searchNameOrTelValue: '',
            dateValueString: '',
        };
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
                title: '释放时间',
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
        console.log(response);
        if (response === undefined || response.code === 403) {
            message.error('获取失败或没有数据');
            return data;
        }
        data = response.result;
        return data;
    };

    // 获取要搜索的信息
    searchNameOrTel = ({ target }) => {
        this.setState({ searchNameOrTelValue: target.value });
    };

    stateSelectChange = (value) => {
        let lsvalue = value;
        if (lsvalue === undefined) {
            lsvalue = 'none';
        }
        this.setState({ selectValue: lsvalue });
    };

    dateChange = (val, dateString) => {
        const startTime = new Date(emptyOrBlank(val[0], '_d', ''));
        const endTime = new Date(emptyOrBlank(val[1], '_d', ''));
        this.setState({
            dateValue: [moment(startTime), moment(endTime)],
            dateValueString: dateString,
        });
    };

    // 确认查询
    moreConditionSearch = async () => {
        let data = [];
        const { searchNameOrTelValue, selectValue, dateValueString } = this.state;
        if (searchNameOrTelValue === '' && dateValueString === '' && selectValue === 'none') {
            message.warning('请输入至少一个条件');
            return;
        }
        const response = await searchCustomerService({
            searchNameOrTelValue,
            selectValue,
            dateValueString,
        });
        if (response === undefined || response.code === 403 || response.result.length === 0) {
            message.error('获取失败或没有数据');
            data = [];
        } else {
            message.success('查询成功');
            data = response.result;
        }
        this.setState({ dataSource: data });
        console.log(response);
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
                        id: this.state.selectedRowKeys,
                        userID: UID,
                    });
                    if (response === undefined || response[0] === 403 || response[3] === false) {
                        message.error('添加失败');
                        return;
                    }
                    this.onceUpdateDataSource(this.state.selectedRowKeys);
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
    onceUpdateDataSource = (dataArray) => {
        const { dataSource } = this.state;
        const newData = tableUpdateDataProcessing(dataArray, dataSource);
        this.setState({ dataSource: newData });
    };

    /** 渲染页面 */
    render() {
        const { selectedRowKeys, columns, dataSource, selectValue, dateValue } = this.state;
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
                                onChange={this.searchNameOrTel}
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
                            <Option value="1">已沟通</Option>
                            <Option value="2">已拜访</Option>
                            <Option value="3">已签单</Option>
                        </Select>
                        <RangePicker
                            className="margin"
                            locale={locale}
                            onChange={this.dateChange}
                            value={dateValue}
                        />
                        <Button
                            className="margin"
                            type="primary"
                            icon="search"
                            onClick={this.moreConditionSearch}
                        >
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
