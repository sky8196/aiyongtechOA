import React from 'react';
import PropTypes from 'prop-types';
import router from 'umi/router';

import { connect } from 'react-redux';
import { Divider, Select, Table } from 'antd';
import UpdateCustomer from '@/components/UpdateCustomer';

const { Option } = Select;

/** 模糊搜索 */
class CustomerTableList extends React.Component {
    /** 构造函数 */
    constructor(props) {
        super(props);
        this.state = {
            rootPower: 2,
            columns: [],
        };
    }

    /** */
    componentDidMount() {
        this.setPublicCustomer();
    }

    /** 设置表格数据 */
    setPublicCustomer = () => {
        const { login, type } = this.props;
        const { rootPower } = this.state;
        const { UID, authorityState } = login;
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
        ];
        // type publicCustomer || privateCustomer
        if (type === 'publicCustomer') {
            columns.push(
                ...[
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
                        render: (id, record) => (
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
                                {authorityState !== rootPower ? (
                                    <>
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
                                    </>
                                ) : (
                                    <></>
                                )}
                            </span>
                        ),
                    },
                ],
            );
        } else if (type === 'privateCustomer') {
            columns.push(
                ...[
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
                        render: (id, record) => (
                            <span>
                                <span
                                    className="blueText"
                                    onClick={() => {
                                        router.push(`/privateCustomer/${id}`);
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
                                {authorityState !== rootPower ? (
                                    <>
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
                                    </>
                                ) : (<></>)}
                            </span>
                        ),
                    },
                ],
            );
        }

        this.setState({ columns });
    };

    /** 组件渲染 */
    render() {
        const { rowSelection = {}, dataSource = [] } = this.props;
        const { columns } = this.state;
        return (
            <>
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
            </>
        );
    }
}
CustomerTableList.defaultProps = { login: {}, type: '', rowSelection: {}, dataSource: [] };
CustomerTableList.propTypes = { login: PropTypes.any, type: PropTypes.any, rowSelection: PropTypes.any, dataSource: PropTypes.any };
export default connect(({ login }) => ({ login }))(CustomerTableList);
