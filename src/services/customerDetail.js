import request from '@/utils/request';
/**
 * getCustomerDetail [获取客户详情]
 * @author lishen
 */
export async function getCustomerDetail(id,isPublic) {
    return request('http://szhtonpal.aiyongbao.com/api', {
        method: 'POST',
        data: {
            method: 'aiyong.foreigntrade.ca.getCustomerDetail',
            namespace: 'ss',
            id: id,
            public: isPublic,
        },
    });
}
