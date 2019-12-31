import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Input, Select, Tooltip, message, DatePicker } from 'antd';
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';
import { getCustomerListService, searchCustomerService } from '@/services/customerList';


const { RangePicker } = DatePicker;
const { Option } = Select;
/** 模糊搜索 */
class MoreConditionSearch extends React.Component {
    /** 构造函数 */
    constructor(props) {
        super(props);
        this.state = {
            dateValue: null,
            searchNameOrTelValue: '',
            selectValue: 'none',
            dateValueString: '',
        };
    }

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
        if (val.length !== 0) {
            const startTime = val[0].format('YYYY-MM-DD HH:mm:ss');
            const endTime = val[1].format('YYYY-MM-DD HH:mm:ss');
            this.setState({
                dateValue: [moment(startTime), moment(endTime)],
                dateValueString: dateString,
            });
        } else {
            this.setState({ dateValue: null });
        }
    };

    // 点击查询
    moreConditionSearch = async () => {
        const { UID, updateDataSource, link } = this.props;
        let data = [];
        const { searchNameOrTelValue, selectValue, dateValueString } = this.state;
        if (searchNameOrTelValue === '' && dateValueString === '' && selectValue === 'none') {
            if (link === '/privateCustomer') {
                const response = await getCustomerListService(UID);
                data = response.result;
            } else {
                const response = await getCustomerListService();
                data = response.result;
            }
            updateDataSource(data);
            return;
        }
        let parames = { searchNameOrTelValue, selectValue, dateValueString };
        if (link === '/privateCustomer') {
            parames = Object.assign(parames, { UID });
        }
        const response = await searchCustomerService(parames);
        if (response === undefined || response.code === 403 || response.result.length === 0) {
            updateDataSource([]);
        } else {
            message.success('查询成功');
            data = response.result;
            updateDataSource(data);
        }
    };

    /** 组件渲染 */
    render() {
        const { dateValue, selectValue } = this.state;
        return (
            <div className="topmain-left" style={{ marginLeft: 10 }}>
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
                    className="margin"
                    defaultValue="none"
                    value={selectValue}
                    onChange={this.stateSelectChange}
                    style={{ width: '200px' }}
                    allowClear
                >
                    <Option style={{ display: 'none' }} value="none">
                      请选择
                    </Option>
                    <Option value="all">全部</Option>
                    <Option value="0">未处理</Option>
                    <Option value="1">已沟通</Option>
                    <Option value="2">已拜访</Option>
                    <Option value="3">已签单</Option>
                </Select>
                <RangePicker
                    className="margin"
                    onChange={this.dateChange}
                    value={dateValue}
                    locale={locale}
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
        );
    }
}
MoreConditionSearch.defaultProps = { UID: 0, link: '', updateDataSource: '' };
MoreConditionSearch.propTypes = { UID: PropTypes.any, link: PropTypes.any, updateDataSource: PropTypes.any };
export default connect(({ login: { UID } }) => ({ UID }))(MoreConditionSearch);
