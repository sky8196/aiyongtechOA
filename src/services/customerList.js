import request from '@/utils/request';
/**
 * getCustomerList [获取公海客户信息]
 * @author szh
 */
export async function getCustomerList() {
    return request('http://szhtonpal.aiyongbao.com//api', {
        method: 'POST',
        data: {
            method: 'aiyong.foreigntrade.ca.getCustomerList',
            namespace: 'ss',
        },
    });
}
/**
 * getMyCustomer [获取我的客户信息]
 * @param id [用户id]
 * @author sfz
 */
export async function getMyCustomer(id) {
    return request('http://szhtonpal.aiyongbao.com//api', {
        method: 'POST',
        data: {
            method: 'aiyong.foreigntrade.ca.getMyCustomer',
            namespace: 'ss',
            id,
        },
    });
}
/**
 * deleteMyCustomer [伪删除客户信息]
 * @param id [用户id]
 * @author szh
 */
export async function deleteMyCustomer(id) {
    return request('http://szhtonpal.aiyongbao.com//api', {
        method: 'POST',
        data: {
            method: 'aiyong.foreigntrade.ca.deleteMyCustomer',
            namespace: 'ss',
            id,
        },
    });
}
/**
 * updateCustomer [修改客户信息]
 * @param data [数据]
 * @author zhuoyue
 */
export async function updateCustomer(parames) {
    const { data } = parames;
    return request('http://szhtonpal.aiyongbao.com//api', {
        method: 'POST',
        data: {
            method: 'aiyong.foreigntrade.ca.updateCustomer',
            namespace: 'ss',
            data: JSON.stringify(data),
        },
    });
}
/**
 * updateCustomerState [修改客户状态]
 * @param parames [数据]
 * @author zhuoyue
 */
export async function updateCustomerState(parames) {
    return request('http://szhtonpal.aiyongbao.com//api', {
        method: 'POST',
        data: {
            method: 'aiyong.foreigntrade.ca.updateCustomerState',
            namespace: 'ss',
            data: JSON.stringify(parames),
        },
    });
}
/**
 * releaseCustomer [释放用户到公海]
 * @param parames [数据]
 * @author zhuoyue
 */
export async function releaseCustomer(parames) {
    return request('http://szhtonpal.aiyongbao.com//api', {
        method: 'POST',
        data: {
            method: 'aiyong.foreigntrade.ca.releaseCustomer',
            namespace: 'ss',
            data: JSON.stringify(parames),
        },
    });
}
/**
 * pushToMyCustomer [释放用户到公海]
 * @param parames [数据]
 * @author zhuoyue
 */
export async function pushToMyCustomer(parames) {
    return request('http://szhtonpal.aiyongbao.com//api', {
        method: 'POST',
        data: {
            method: 'aiyong.foreigntrade.ca.pushToMyCustomer',
            namespace: 'ss',
            data: JSON.stringify(parames),
        },
    });
}
/**
 * searchCustomer [释放用户到公海]
 * @param parames [数据]
 * @author zhuoyue
 */
export async function searchCustomer(parames) {
    return request('http://szhtonpal.aiyongbao.com//api', {
        method: 'POST',
        data: {
            method: 'aiyong.foreigntrade.ca.searchCustomer',
            namespace: 'ss',
            data: JSON.stringify(parames),
        },
    });
}
