import React from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Button, Input, Table, Empty, Divider, Select, Modal, message } from 'antd';

import moment from 'moment';
// import 'moment/locale/zh-cn';
import router from 'umi/router';
import AddNewPrivateCustomer from '@/components/AddNewPrivateCustomer';
import UpdateCustomer from '@/components/UpdateCustomer';
import MoreConditionSearch from '@/components/MoreConditionSearch';
import { getCustomerListService, updateCustomerStateService, releaseCustomerService } from '@/services/customerList';
import { deleteCustomer, tableUpdateDataProcessing } from '../../utils/customerGlobal';


const { confirm } = Modal;

moment.locale('zh-cn');
const { Option } = Select;

/** 私有客户页面 */
class PrivateCustomer extends React.Component {
    /** 构造函数 */
    constructor(props) {
        super(props);
        this.state = {
            rootPower: '2', // root权限控制
            dataSource: [], // 渲染tabel的数据
            dataSourceOld: [], // table旧数据-用于回退
            visibleData: {}, // 修改状态临时存储的数据
            visibleUpdateState: false, // 修改状态时控制Model的显隐
            updateStataDetail: '', // 临时存储修改状态时备注中数据
            selectedRowKeys: [], // Check here to configure the default column
        };
    }

    /** 组件挂载 */
    componentDidMount() {
        const { UID } = this.props;
        this.getMyCustomer(UID);
    }

    /** 异步请求数据 */
    getMyCustomer = async (id) => {
        const data = await this.getDataSource(id);
        this.setState({ dataSource: data });
    };

    getDataSource = async (id) => {
        if (id === 0) { return []; }
        const response = await getCustomerListService(id);
        let data = [];
        if (response === undefined || response.code === 403) {
            return data;
        }
        data = response.result;
        return data;
    };

    // 查询更新DataSource
    updateDataSource = (data) => {
        this.setState({ dataSource: data });
    };

    // 删除事件
    showDeleteConfirm = (id) => {
        deleteCustomer(id, this.onceUpdateDataSource);
    };

    // 单个释放操作
    showConfirm = ({ id }) => {
        this.setState({ selectedRowKeys: [id] }, () => {
            this.twoConfirmationRelease();
        });
    };

    // 添加批量释放的id
    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    };

    // 批量释放
    batchConfirm = () => {
        const idArray = this.state.selectedRowKeys;
        if (idArray.length === 0) {
            message.error('没有需要释放的对象');
        } else {
            this.twoConfirmationRelease();
        }
    };

    // 二次确认释放
    twoConfirmationRelease = () => {
        confirm({
            title: '确定要释放到公海吗?',
            content: '释放后可在公海查看',
            okText: '确定',
            cancelText: '取消',
            onOk: async () => {
                const { UName } = this.props;
                const parames = { UName, idArray: this.state.selectedRowKeys };
                const response = await releaseCustomerService(parames);
                if (response === undefined || response.code === 403 || response.result !== true) {
                    message.error('释放失败');
                    return;
                }
                await this.onceUpdateDataSource(this.state.selectedRowKeys);
                this.setState({ selectedRowKeys: [] }, () => {
                    message.success('释放成功');
                });
            },
            onCancel: () => {
                message.warning('取消释放');
            },
        });
    };

    // 修改客户状态事件
    stateChange = (e, data) => {
        const value = Number(e);
        const lsData = this.state.dataSource;
        const oldData = this.state.dataSource;
        lsData.forEach((val) => {
            if (val.id === data) {
                if (value !== Number(val.presentState) + 1) {
                    message.error('不能回退或跳过状态');
                    return;
                }
                this.setState({ dataSourceOld: oldData });
                this.openModel({ value, lsData, id: data });
            }
        });
    };

    // 打开弹窗
    openModel = (parames) => {
        this.setState({ visibleUpdateState: true, visibleData: parames });
    };

    // 存储备注信息
    updateStataDetail = ({ target: { value } }) => {
        this.setState({ updateStataDetail: value });
    };

    // 确认修改状态
    handleOk = () => {
        const { lsData, value, id } = this.state.visibleData;
        lsData.forEach(async (val) => {
            if (val.id === id) {
                val.presentState = String(value);
                const note = this.state.updateStataDetail;
                const response = await updateCustomerStateService({ id, presentState: val.presentState, note });
                if (response === undefined || response.code === 403 || response.result !== true) {
                    this.clearUpdateTemporaryData();
                    message.error('修改失败');
                }
                this.setState({ visibleUpdateState: false, dataSource: lsData }, () => {
                    this.clearUpdateTemporaryData();
                    message.success('修改成功');
                });
            }
        });
    };

    // 取消修改状态
    handleCancel = () => {
        const { dataSourceOld } = this.state;
        this.setState({ visibleUpdateState: false, dataSource: dataSourceOld }, () => {
            this.clearUpdateTemporaryData();
            message.warning('取消修改');
        });
    };

    // 清除修改状态时产生的临时数据
    clearUpdateTemporaryData = () => {
        this.setState({ dataSourceOld: [], visibleData: {}, updateStataDetail: '' });
    };

    /** 再次更新dataSource */
    onceUpdateDataSource = (conditionArray) => {
        const { dataSource } = this.state;
        const newData = tableUpdateDataProcessing(conditionArray, dataSource);
        this.setState({ dataSource: newData });
    };

    /** 组件渲染 */
    render() {
        const { UID, match, authorityState } = this.props;
        const { selectedRowKeys, dataSource, rootPower, visibleUpdateState, updateStataDetail } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
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
                title: '创建时间',
                dataIndex: 'createTime',
                width: '13%',
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
                render: (presentState, data) => (presentState === '3' ? (
                    <span className="redText">已签单</span>
                ) : (
                    <Select
                        className="margin"
                        tar={data.id}
                        value={presentState}
                        onSelect={(e) => this.stateChange(e, data.id)}
                    >
                        <Option value="0">
                            <span className="grayText">未处理</span>
                        </Option>
                        <Option value="1">
                            <span className="greenText">已沟通</span>
                        </Option>
                        <Option value="2">
                            <span className="blueText">已拜访</span>
                        </Option>
                        <Option value="3">
                            <span className="redText">已签单</span>
                        </Option>
                    </Select>
                )),
            },
            {
                title: '产品',
                dataIndex: 'product',
                ellipsis: true,
            },
            {
                title: '操作',
                dataIndex: 'id',
                render: (id, record) => (authorityState !== rootPower ? (
                    <span>
                        <span
                            className="blueText"
                            onClick={() => {
                                router.push(`/myCustomer/${id}`);
                            }}
                            style={{ cursor: 'pointer' }}
                        >
                                查看详情
                        </span>
                        <Divider type="vertical" />
                        <span
                            className="blueText"
                            onClick={() => this.showConfirm({ id })}
                            style={{ cursor: 'pointer' }}
                        >
                                释放
                        </span>
                    </span>
                ) : (
                    <span>
                        <span
                            className="blueText"
                            onClick={() => {
                                router.push(`/myCustomer/${id}`);
                            }}
                            style={{ cursor: 'pointer' }}
                        >
                                查看详情
                        </span>
                        <Divider type="vertical" />
                        <span
                            className="blueText"
                            onClick={() => this.showConfirm({ id })}
                            style={{ cursor: 'pointer' }}
                        >
                                释放
                        </span>
                        <Divider type="vertical" />
                        <UpdateCustomer
                            record={record}
                            cid={id}
                            updatePage={() => this.getMyCustomer(UID)}
                        />
                        <Divider type="vertical" />
                        <span
                            className="redText"
                            onClick={() => {
                                this.showDeleteConfirm(id);
                            }}
                            style={{ cursor: 'pointer' }}
                        >
                                删除
                        </span>
                    </span>
                )),
            },
        ];
        return (
            <div>
                <div id="topmain">
                    <MoreConditionSearch updateDataSource={this.updateDataSource} link={match.url} />
                    <div className="topmain-right">
                        <Button className="inlineRight margin" icon="rollback" onClick={() => { window.location.href = '/index-transfer.shtml'; return 0; }}>
                            返回OA
                        </Button>
                        <Button
                            className="margin"
                            type="primary"
                            icon="cloud-sync"
                            onClick={this.batchConfirm}
                        >
                            批量释放
                        </Button>
                        <AddNewPrivateCustomer refreshList={this.getMyCustomer} />
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
                <Modal
                    title="备注"
                    visible={visibleUpdateState}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <Input
                        placeholder="请输入备注信息"
                        onChange={this.updateStataDetail}
                        value={updateStataDetail}
                    />
                </Modal>
            </div>
        );
    }
}
PrivateCustomer.defaultProps = { UID: 0, UName: '', match: '', authorityState: '' };
PrivateCustomer.propTypes = { UID: PropTypes.any, UName: PropTypes.any, match: PropTypes.any, authorityState: PropTypes.any };
export default connect(({ login: { UID, UName, authorityState } }) => ({ UID, UName, authorityState }))(PrivateCustomer);
