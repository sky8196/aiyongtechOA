import React from 'react';
import {Button} from 'antd';
import './index.scss';
class CustomerList extends React.Component {
  render() {
    return (
      <div id="main">
        <div style={{ marginBottom: "40px" }}>
          <input type="text" />
          <input type="text" />
          <select></select>
          <select></select>
          <select></select>
          <Button type="primary" className="button">查询</Button>
        </div>
        <div>
          <table width="100%" cellSpacing="0" cellPadding="0" className="table">
            <tbody>
              <tr>
                <td className="bgcolor">ID</td>
                <td className="bgcolor">公司名</td>
                <td className="bgcolor">代理商</td>
                <td className="bgcolor">网站链接</td>
                <td className="bgcolor">联系人</td>
                <td className="bgcolor">手机号</td>
                <td className="bgcolor">询盘数</td>
                <td className="bgcolor">录入时间</td>
                <td className="bgcolor">合同到期</td>
                <td className="bgcolor">套餐版本</td>
                <td className="bgcolor">备注</td>
                <td className="bgcolor">状态</td>
                <td colSpan="2" className="bgcolor">操作</td>
              </tr>
              <tr>
                <td>1</td>
                <td>苏州优尔集团有限公司</td>
                <td>江苏互旦</td>
                <td>www.youiai.com</td>
                <td>张经理</td>
                <td>18936097848</td>
                <td>0/0</td>
                <td>2019-08-23</td>
                <td>2022-0824</td>
                <td>经济套餐</td>
                <td>客户只需要开个全网搜索</td>
                <td>待建站</td>
                <td>收录</td>
                <td>详情</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
export default CustomerList;