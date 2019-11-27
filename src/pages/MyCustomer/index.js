import React from 'react';
import { connect } from 'dva';
// import PropTypes from 'prop-types';
import { Button, Input, DatePicker, Table, Empty, Tooltip } from 'antd';
import { Divider, Select, Modal, message } from 'antd';
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import NewCustomer from '../NewCustomer';
import router from 'umi/router';
import UpdateCustomer from '@/components/UpdateCustomer';
import { deleteMyCustomer, getMyCustomer, updateCustomerState,releaseCustomer } from '@/services/customerList';

const { confirm } = Modal;

moment.locale('zh-cn');
const { RangePicker } = DatePicker;
const { Option } = Select;

class CustomerList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rootPower:1, // root权限控制
      userID: this.props.status, // 登入用户id
      dataSource: [],// 渲染tabel的数据
      dataSourceOld: [],// table旧数据-用于回退
      selectValue: 'none',
      visibleData: {},// 修改状态临时存储的数据
      visibleUpdateState: false,// 修改状态时控制Model的显隐
      updateStataDetail: '', // 临时存储修改状态时备注中数据
      selectedRowKeys: [], // Check here to configure the default column
      searchText: '',
      filteredInfo: null,
    };
    console.log(this.props);
    console.log("当前用户",this.state.userID);
    this.getMyCustomer = this.getMyCustomer.bind(this);
  }

  componentDidMount() {
    this.getMyCustomer(this.state.userID);
  }

  // 获取客户数据
  async getMyCustomer(id) {
    let data = await this.getDataSource(id);
    this.setState({
      dataSource: data,
    });
  }
  async getDataSource(id) {
    const response = await getMyCustomer(id);
    let data = [];
    let count=0;
    if (response === undefined || response[0] === 403 || response[1][0] === undefined
      || response[1][0].CID === undefined) {
      return [];
    }
    for (let i = 0; i < response[1].length; i++) {
      if(response[1][i].CPublic==="0"){
        data[count] = {};
        data[count].key = response[1][i].CID;
        data[count].name = response[1][i].CName;
        data[count].contact = response[1][i].CContact;
        data[count].tel = response[1][i].CTel;
        data[count].time = response[1][i].CTime;
        data[count].creater = response[1][i].CUName;
        data[count].state = response[1][i].CState;
        data[count].product = response[1][i].CProduct;
        count++;
      };
    }
    return data;
  }

  stateSelectChange = value => {
    if (value === undefined) {
      value = 'none';
    }
    console.log(value);
    this.setState({
      selectValue: value,
    });
  };
  // 删除事件
  showDeleteConfirm = (key) => {
    confirm({
      title: '确定要删除这条信息吗?',
      content: '删除后数据无法恢复!',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        this.onOkDelete(key);
      },
      onCancel() {
        message.warning('取消删除');
      },
    });
  };
  // 确认删除
  onOkDelete = (key) => {
    if (this.deleteMy(key)) {
      message.success('删除成功');
      this.onceUpdateDataSource([key]);
    } else {
      message.error('删除失败!');
    }
  };
  async deleteMy(id) {
    const response = await deleteMyCustomer(id);
    if (response === undefined || response[0] === 403 || response[1] === false) {
      return false;
    } else {
      return true;
    }
  }
  // 释放操作
  showConfirm = ({key}) => {
    confirm({
      title: '确定要释放到公海吗?',
      content: '释放后可在公海查看',
      okText: '确定',
      cancelText: '取消',
      onOk:()=>{
        this.setState({selectedRowKeys:[key]},()=>{this.onOKshowConfirm();})
      },
      onCancel() {
        message.warning("取消释放")
      },
    });
  };
  // 执行释放
async onOKshowConfirm(){
  let userID=this.state.userID;
  let parames={userID,cid:this.state.selectedRowKeys};
  const response =await releaseCustomer(parames);
  if (response === undefined || response[0] === 403 || response[3] === undefined) {
    return message.error("释放失败");
  }
  this.onceUpdateDataSource(this.state.selectedRowKeys);
  this.setState({selectedRowKeys:[]},()=>{message.success('释放成功')})
}

// 批量释放
  onSelectChange = selectedRowKeys => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };
  batchConfirm=()=>{
    this.onOKshowConfirm({cid:this.state.selectedRowKeys});
  };

  // 修改客户状态事件
  stateChange = (e, data) => {
    let value = Number(e);
    let lsData = this.state.dataSource;
    let oldData = this.state.dataSource;
    lsData.forEach((val) => {
      if (val.key === data) {
        if(value!==(Number(val.state)+1)){return message.error('不能回退或跳过状态');}
        this.setState({ dataSourceOld: oldData });
        this.openModel({ value, lsData, id: data });
      }
    });
  };
  // 打开弹窗
  openModel(parames) {
    this.setState({ visibleUpdateState: true, visibleData: parames });
  }
  // 存储备注信息
  updateStataDetail = ({ target }) => {
    this.setState({ updateStataDetail: target.value });
  };
  // 确认修改
  handleOk = () => {
    const { lsData, value, id } = this.state.visibleData;
    lsData.forEach(async (val) => {
      if (val.key === id) {
        val.state = String(value);
        let cid = val.key;
        let cstate = val.state;
        let cdetail = this.state.updateStataDetail;
        const response = await updateCustomerState({ cid, cstate, cdetail });
        if (response === undefined || response[0] === 403) {
          this.clearUpdateTemporaryData();
          return message.error('修改失败');
        }
        this.setState({ visibleUpdateState: false, dataSource: lsData }, () => {
          this.clearUpdateTemporaryData();
          message.success('修改成功');
        });
      }
    });
  };
  // 取消修改
  handleCancel = () => {
    this.setState({ visibleUpdateState: false, dataSource: this.state.dataSourceOld }, () => {
      this.clearUpdateTemporaryData();
      message.warning('取消修改');
    });
  };

  // 清除修改状态时产生的临时数据
  clearUpdateTemporaryData() {
    console.log('clear');
    this.setState({ dataSourceOld: [], visibleData: {}, updateStataDetail: '' });
  }
  // 再次更新dataSource
  onceUpdateDataSource(dataArray){
    let arr=this.state.dataSource;
    for(let i=0;i<arr.length;i++){
      for(let j=0;j<dataArray.length;j++){
        if(arr[i].key===dataArray[j]){
          arr.splice(i,1)
        }
      }
    }
    this.setState({dataSource:arr})
  }
  render() {
    const { selectedRowKeys, dataSource } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const columns = [
      {
        title: '公司名称',
        dataIndex: 'name',
      },
      {
        title: '联系人',
        dataIndex: 'contact',
      },
      {
        title: '联系方式',
        dataIndex: 'tel',
      },
      {
        title: '创建时间',
        dataIndex: 'time',
      },
      {
        title: '创建人',
        dataIndex: 'creater',
      },
      {
        title: '状态',
        dataIndex: 'state',
        render: (state, data) => (
          state === '3' ? (
            <span className="redText">已签单</span>
          ) : (
            <Select className="margin" tar={data.key} value={state} onSelect={(e) => this.stateChange(e, data.key)}>
              <Option value="0"><span className="grayText">未处理</span></Option>
              <Option value="1"><span className="greenText">已沟通</span></Option>
              <Option value="2"><span className="blueText">已拜访</span></Option>
              <Option value="3"><span className="redText">已签单</span></Option>
            </Select>

          )
        ),
      },
      {
        title: '产品',
        dataIndex: 'product',
      },
      {
        title: '操作',
        dataIndex: 'key',
        render: (key, record) => (
          this.state.userID !== this.state.rootPower ? (
            <span>
              <span className="blueText" onClick={() => {
                router.push(`/myCustomer/${key}`);
              }} style={{ cursor: 'pointer' }}>查看详情</span>
              <Divider type="vertical"/>
              <span className="blueText" onClick={()=>this.showConfirm({key})} style={{ cursor: 'pointer' }}>释放</span>
				    </span>
            ) : (
            <span>
              <span className="blueText" onClick={() => {router.push(`/myCustomer/${key}`);}} style={{ cursor: 'pointer' }}>查看详情</span>
              <Divider type="vertical"/>
              <span className="blueText" onClick={()=>this.showConfirm({key})} style={{ cursor: 'pointer' }}>释放</span>
              <Divider type="vertical"/>
              <UpdateCustomer record={record} cid={key} updatePage={()=>this.getMyCustomer(this.state.userID)}/>
              <Divider type="vertical"/>
              <span className="redText" onClick={() => {this.showDeleteConfirm(key);}} style={{ cursor: 'pointer' }}>删除</span>
				    </span>)
        ),
      },
    ];
    return (
      <div>
        <div id="topmain">
          <div className='topmain-left'>
            <Tooltip placement="bottomLeft" title="公司名称或联系人或电话">
              <Input className="margin" style={{ width: '200px' }} placeholder="请输入" allowClear
                     onChange={this.selectChange}/>
            </Tooltip>
            <Select className="margin" defaultValue="none" value={this.state.selectValue}
                    onChange={this.stateSelectChange} style={{ width: '200px' }} allowClear>
              <Option style={{ display: 'none' }} value="none">
                请选择
              </Option>
              <Option value="all">全部</Option>
              <Option value="talked">已沟通</Option>
              <Option value="visited">已拜访</Option>
              <Option value="done">已签单</Option>
            </Select>
            <RangePicker className="margin" locale={locale}/>
            <Button className="margin" type="primary" icon="search">
              查询
            </Button>
          </div>
          <div className='topmain-right'>
            <Button className="inlineRight margin" icon="rollback">
              返回OA
            </Button>
            <Button className="margin" type="primary" icon="cloud-sync" onClick={this.batchConfirm}>
              批量释放
            </Button>
            <NewCustomer refreshList={this.getMyCustomer}/>
          </div>
        </div>
        <div id="main">
          {dataSource.length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
          ) : (
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={dataSource}
              footer={() => <span> 共{dataSource.length}条数据，当前页最多展示10条</span>}
            />
          )}
        </div>
        <Modal
          title="备注"
          visible={this.state.visibleUpdateState}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Input placeholder="请输入备注信息" onChange={this.updateStataDetail} value={this.state.updateStataDetail}/>
        </Modal>
      </div>
    );
  }
}

export default connect(({ login: { status } }) => ({ status }))(CustomerList);
