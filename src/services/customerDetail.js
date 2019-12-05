import request from '@/utils/request';
/**
 * getCustomerDetailService [获取客户详情]
 * @author lishen
 */
async function getCustomerDetailService(id) {
    return request('http://szhtonpal.aiyongbao.com/api', {
        method: 'POST',
        data: {
            method: 'aiyong.foreigntrade.ca.getcustomerdetail',
            namespace: 'ss',
            id,
        },
    });
}

export default getCustomerDetailService;
