// import { message, Modal } from 'antd';
// import { deleteMyCustomerService } from '@/services/customerList';
//
// const { confirm } = Modal;
// /**
//  * deleteCustomer [解析json]
//  * @author zhuoyue
//  * @param int id[客户id]
//  * @param function id[客户id]
//  * @return 解析值
//  */
// export function deleteCustomer(id, onceUpdateDataSource) {
//     confirm({
//         title: '确定要删除这条信息吗?',
//         content: '删除后数据无法恢复!',
//         okText: '删除',
//         okType: 'danger',
//         cancelText: '取消',
//         onOk: async () => {
//             const response = await deleteMyCustomerService(id);
//             if (response === undefined || response.code === 403 || response.result === false) {
//                 message.error('删除失败!');
//             } else {
//                 await onceUpdateDataSource([id]);
//                 message.success('删除成功');
//             }
//         },
//         onCancel: () => {
//             message.warning('取消删除');
//         },
//     });
// }
// /**
//  * jsonDecode [解析json]
//  * @author Terrence
//  * @param string json [要进行解析的json字符串]
//  * @param object defaultValue [解析失败时的默认结果]
//  * @return 解析值
//  */
// export function onceUpdateDataSource(dataArray, stateData) {
//     for (let i = 0; i < stateData.length; i += 1) {
//         for (let j = 0; j < dataArray.length; j += 1) {
//             if (stateData[i].id === dataArray[j]) {
//                 stateData.splice(i, 1);
//             }
//         }
//     }
//     return stateData;
// }
