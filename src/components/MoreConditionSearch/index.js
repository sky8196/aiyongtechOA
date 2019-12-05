// import React from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
// import { Button, Input, Select, Tooltip, message, DatePicker } from 'antd';
// import locale from 'antd/es/date-picker/locale/zh_CN';
// import moment from 'moment';
// import { searchCustomerService } from '@/services/customerList';
// import { emptyOrBlank } from '@/utils/common';
//
//
// const { RangePicker } = DatePicker;
// const { Option } = Select;
// /** 模糊搜索 */
// class MoreConditionSearch extends React.Component {
//     /** 构造函数 */
//     constructor(props) {
//         super(props);
//         this.state = {
//             link: match.url.substr(0, match.url.lastIndexOf('/')),
//             dateValue: null,
//             searchNameOrTelValue: '',
//             selectValue: 'none',
//             dateValueString: '',
//         };
//     }
//
//     // 获取要搜索的信息
//     searchNameOrTel = ({ target }) => {
//         this.setState({ searchNameOrTelValue: target.value });
//     };
//
//     stateSelectChange = (value) => {
//         let lsvalue = value;
//         if (lsvalue === undefined) {
//             lsvalue = 'none';
//         }
//         this.setState({ selectValue: lsvalue });
//     };
//
//     dateChange = (val, dateString) => {
//         const startTime = new Date(emptyOrBlank(val[0], '_d', ''));
//         const endTime = new Date(emptyOrBlank(val[1], '_d', ''));
//         this.setState({
//             dateValue: [moment(startTime), moment(endTime)],
//             dateValueString: dateString,
//         });
//     };
//
//     // 点击查询
//     moreConditionSearch = async () => {
//         const { link } = this.state;
//         let data = [];
//         const { searchNameOrTelValue, selectValue, dateValueString } = this.state;
//         if (searchNameOrTelValue === '' && dateValueString === '' && selectValue === 'none') {
//             message.warning('请输入至少一个条件');
//             return;
//         }
//         let parames = { searchNameOrTelValue, selectValue, dateValueString };
//         if (link === '/myCustomer') {
//             const { UID } = this.props;
//             parames = Object.assign(parames, { UID });
//         }
//         const response = await searchCustomerService(parames);
//         if (response === undefined || response.code === 403 || response.result.length === 0) {
//             message.error('获取失败或没有数据');
//             data = [];
//         } else {
//             message.success('查询成功');
//             data = response.result;
//         }
//         this.setState({ dataSource: data });
//         // const response = await searchCustomerService({ searchNameOrTelValue, selectValue, dateValueString });
//         console.log(response);
//     };
//
//     /** 组件渲染 */
//     render() {
//         const { dateValue, selectValue } = this.state;
//         return (
//             <div className="topmain-left">
//                 <Tooltip placement="bottomLeft" title="公司名称或联系人或电话">
//                     <Input
//                         className="margin"
//                         style={{ width: '200px' }}
//                         placeholder="请输入"
//                         allowClear
//                         onChange={this.searchNameOrTel}
//                     />
//                 </Tooltip>
//                 <Select
//                     className="margin"
//                     defaultValue="none"
//                     value={selectValue}
//                     onChange={this.stateSelectChange}
//                     style={{ width: '200px' }}
//                     allowClear
//                 >
//                     <Option style={{ display: 'none' }} value="none">
//                       请选择
//                     </Option>
//                     <Option value="all">全部</Option>
//                     <Option value="1">已沟通</Option>
//                     <Option value="2">已拜访</Option>
//                     <Option value="3">已签单</Option>
//                 </Select>
//                 <RangePicker
//                     className="margin"
//                     onChange={this.dateChange}
//                     value={dateValue}
//                     locale={locale}
//                 />
//                 <Button
//                     className="margin"
//                     type="primary"
//                     icon="search"
//                     onClick={this.moreConditionSearch}
//                 >
//                 查询
//                 </Button>
//             </div>
//         );
//     }
// }
// MoreConditionSearch.defaultProps = { UID: 0, match: '' };
// MoreConditionSearch.propTypes = { UID: PropTypes.any, match: PropTypes.any };
// export default connect(({ login: { UID } }) => ({ UID }))(MoreConditionSearch);
