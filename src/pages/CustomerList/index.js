import React from 'react';
import { Button, Input, DatePicker, Select, Table, Empty, Tooltip, Divider, message,Modal } from 'antd';
import router from 'umi/router';

import locale from 'antd/es/date-picker/locale/zh_CN';
import './index.scss';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { deleteMyCustomer, getCustomerList,pushToMyCustomer } from '@/services/customerList';
import { connect } from 'react-redux';
import UpdateCustomer from '@/components/UpdateCustomer';

moment.locale('zh-cn');
const {confirm}=Modal;
const { RangePicker } = DatePicker;
const { Option } = Select;

class CustomerList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
      rootPower:1, // root权限控制
      userID: this.props.status, // 登入用户id
      dataSource: [],
			selectValue: "none",
			selectedRowKeys: [], // Check here to configure the default column
			searchText: '',
			filteredInfo: null,
      columns:[]
		};
		this.fnDebounce=false; // 函数防抖控制
		this.getPublicCustomer = this.getPublicCustomer.bind(this);
    console.log(this.props);
    console.log("当前用户",this.state.userID);
	}

	componentDidMount() {
		this.getPublicCustomer();
	}
	async getPublicCustomer() {
		const data = await this.getDataSource();
		const columns=await this.getColumns();
    this.setState({
      dataSource: data,
      columns
    });
	}
  async getDataSource(){
    const response =await getCustomerList();
    let data=[];
    if(response===undefined || response[0]===403 ){
      return message.error("获取失败");
    }
    for(let i=0;i < response[1].length;i++){
      data[i] = {};
      data[i].key = response[1][i].CID;
      data[i].name = response[1][i].CName;
      data[i].contact = response[1][i].CContact;
      data[i].tel = response[1][i].CTel;
      data[i].time = response[1][i].CTime;
      data[i].releaser = response[1][i].UName;
      data[i].creater = response[1][i].CUName;
      data[i].state = response[1][i].CState;
      data[i].product = response[1][i].CProduct
    }
    return data
  }
  getColumns(){
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
        title:'创建时间',
        dataIndex:'time',
      },
      {
        title:'最后释放人',
        dataIndex:'releaser',
      },
      {
        title:'创建人',
        dataIndex:'creater',
      },
      {
        title:'状态',
        dataIndex:'state',
        render: (state) => (
          state===3?(<span className="redText">已签单</span>):(
            state===2?(<span className="blueText">已拜访</span>):(
              state===1?(<span className="greenText">已沟通</span>):(
                <span className="grayText">未处理</span>
              )
            )
          )
        ),
      },
      {
        title:'产品',
        dataIndex:'product',
      },
      {
        title: '操作',
        dataIndex:'key',
        render: (key,record) => (
          this.state.userID!==this.state.rootPower?(
            <span>
              <span className="blueText" onClick={()=>{router.push(`/customerList/${key}`)}} style={{cursor:"pointer"}}>查看详情</span>
            </span>
          ):(
            <span>
              <span className="blueText" onClick={()=>{router.push(`/customerList/${key}`)}} style={{cursor:"pointer"}}>查看详情</span>
              <Divider type="vertical" />
              <UpdateCustomer record={record} cid={key} updatePage={()=>this.getPublicCustomer(this.state.userID)}/>

              <Divider type="vertical" />
              <span className="redText" onClick={()=>this.showDeleteConfirm(key)} style={{cursor:"pointer"}}>删除</span>
            </span>)

        ),
      }
    ];
    return columns;
  }
  // 伪删除事件
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
  onOkDelete = (key) => {
    if (this.deleteMy(key)) {
      message.success('删除成功');
      this.getPublicCustomer();
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

  // 批量转换私有客户
	onSelectChange = selectedRowKeys => {
		// console.log('selectedRowKeys changed: ', selectedRowKeys);
		this.setState({ selectedRowKeys });
	};
  pushToMyCustomer=async ()=>{
    if(this.fnDebounce){return}
    this.fnDebounce=true;
    if(this.state.selectedRowKeys.length===0){;return message.warning("请先选择客户",3,()=>{this.fnDebounce=false})}
    let response=await pushToMyCustomer({cid:this.state.selectedRowKeys,userID:this.state.userID});
    if (response === undefined || response[0] === 403 || response[3] === false) {
      return message.error("添加失败");
    }
    this.onceUpdateDataSource(this.state.selectedRowKeys)
    this.setState({selectedRowKeys:[]},()=>{message.success('添加成功',3,()=>{this.fnDebounce=false;})})
  }

	stateSelectChange = value => {
		if(value === undefined){
			value = "none";
		}
		console.log(value);
		this.setState({
			selectValue: value
		})
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
		let { selectedRowKeys,columns,dataSource } = this.state;
		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectChange
		};

		return (
			<div>
				<div id="topmain">
					<div className="topmain-left">
						<Tooltip placement="bottomLeft" title="公司名称或联系人或电话">
							<Input className="margin" style={{ width: '200px' }} placeholder="请输入" allowClear />
						</Tooltip>
						<Select id="stateSelect" className="margin" defaultValue="none" value={this.state.selectValue} style={{ width: '200px' }} allowClear onChange={this.stateSelectChange}>
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
						<Button id="add" className="inlineRight margin" icon="plus" onClick={this.pushToMyCustomer}>
							添加至我的客户
						</Button>
					</div>
				</div>
				<div id="main">
					{dataSource.length === 0 ? (
						<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
					) : (
						<Table
							rowSelection={rowSelection}
							columns={columns}
							dataSource={dataSource}
							footer={() => <span> 共{dataSource.length}条数据，当前页最多展示10条</span>}
						/>
					)}
				</div>
			</div>
		);
	}
}
export default connect(({ login: { status } }) => ({ status }))(CustomerList);

