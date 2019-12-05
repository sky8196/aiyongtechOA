import { message, Modal } from 'antd';
import { deleteCustomerService } from '@/services/customerList';

const { confirm } = Modal;
/**
 * deleteCustomer [解析json]
 * @author zhuoyue
 * @param int id[客户id]
 * @param function onceUpdateDataSource [删除后更新数据]
 * @return 解析值
 */
export function deleteCustomer(id, onceUpdateDataSource) {
    confirm({
        title: '确定要删除这条信息吗?',
        content: '删除后数据无法恢复!',
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk: async () => {
            const response = await deleteCustomerService(id);
            if (response === undefined || response.code === 403 || response.result === false) {
                message.error('删除失败!');
            } else {
                onceUpdateDataSource([id]);
                message.success('删除成功');
            }
        },
        onCancel: () => {
            message.warning('取消删除');
        },
    });
}
/**
 * tableUpdateDataProcessing [table数据更新处理]
 * @author zhuoyue
 * @param array conditionArray [更改数据的条件]
 * @param array dataSource [需要更改的数据]
 * @return 更改后的数据
 */
export function tableUpdateDataProcessing(conditionArray, dataSource) {
    const arr = dataSource;
    for (let i = 0; i < arr.length; i += 1) {
        for (let j = 0; j < conditionArray.length; j += 1) {
            if (arr[i].id === conditionArray[j]) {
                arr.splice(i, 1);
            }
        }
    }
    return arr;
}
