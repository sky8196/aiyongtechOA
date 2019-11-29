import request from '@/utils/request';
/**
 * getCustomerDetail [获取客户详情]
 * @author lishen
 */
async function getCustomerDetail(id, isPublic) {
    return request('http://szhtonpal.aiyongbao.com/api', {
        method: 'POST',
        data: {
            method: 'aiyong.foreigntrade.ca.getCustomerDetail',
            namespace: 'ss',
            id,
            public: isPublic,
        },
    });
}

export default getCustomerDetail;
