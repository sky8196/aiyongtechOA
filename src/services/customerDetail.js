import request from '@/utils/request';
/**
 * getCustomerDetailService [获取客户详情]
 * @author zhuoyue
 */
async function getCustomerDetailService(id) {
    return request('/api', {
        method: 'POST',
        data: {
            method: 'aiyong.tonpaladmin.newoa.getcustomerdetail',
            namespace: 'ss',
            id,
        },
    });
}

export default getCustomerDetailService;
