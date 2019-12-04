import request from '@/utils/request';
/**
 * getCustomerListService [获取客户信息]
 * @author zhuoyue
 * @param UID [用户UID]
 */
export async function getCustomerListService(UID) {
    return request('http://szhtonpal.aiyongbao.com//api', {
        method: 'POST',
        data: {
            method: 'aiyong.foreigntrade.ca.getCustomerListAction',
            namespace: 'ss',
            UID,
        },
    });
}
/**
 * deleteMyCustomerService [伪删除客户信息]
 * @author zhuoyue
 * @param id [用户id]
 */
export async function deleteMyCustomerService(id) {
    return request('http://szhtonpal.aiyongbao.com//api', {
        method: 'POST',
        data: {
            method: 'aiyong.foreigntrade.ca.deleteMyCustomerAction',
            namespace: 'ss',
            id,
        },
    });
}
/**
 * updateCustomerService [修改客户信息]
 * @author zhuoyue
 * @param data [要修改的数据]
 */
export async function updateCustomerService(parames) {
    const { data } = parames;
    return request('http://szhtonpal.aiyongbao.com//api', {
        method: 'POST',
        data: {
            method: 'aiyong.foreigntrade.ca.updateCustomerAction',
            namespace: 'ss',
            data: JSON.stringify(data),
        },
    });
}
/**
 * updateCustomerStateService [修改客户状态]
 * @param parames [数据]
 * @author zhuoyue
 */
export async function updateCustomerStateService(parames) {
    return request('http://szhtonpal.aiyongbao.com//api', {
        method: 'POST',
        data: {
            method: 'aiyong.foreigntrade.ca.updateCustomerStateAction',
            namespace: 'ss',
            data: JSON.stringify(parames),
        },
    });
}
/**
 * releaseCustomerService [释放用户到公海]
 * @author zhuoyue
 * @param parames [数据]
 */
export async function releaseCustomerService(parames) {
    return request('http://szhtonpal.aiyongbao.com//api', {
        method: 'POST',
        data: {
            method: 'aiyong.foreigntrade.ca.releaseCustomerAction',
            namespace: 'ss',
            data: JSON.stringify(parames),
        },
    });
}
/**
 * pushToMyCustomerService [从公海添加到私有]
 * @author zhuoyue
 * @param parames [数据]
 */
export async function pushToMyCustomerService(parames) {
    return request('http://szhtonpal.aiyongbao.com//api', {
        method: 'POST',
        data: {
            method: 'aiyong.foreigntrade.ca.pushToMyCustomerAction',
            namespace: 'ss',
            data: JSON.stringify(parames),
        },
    });
}
/**
 * searchCustomerService [释放用户到公海]
 * @param parames [数据]
 * @author zhuoyue
 */
export async function searchCustomerService(parames) {
    return request('http://szhtonpal.aiyongbao.com//api', {
        method: 'POST',
        data: {
            method: 'aiyong.foreigntrade.ca.searchCustomerAction',
            namespace: 'ss',
            data: JSON.stringify(parames),
        },
    });
}
