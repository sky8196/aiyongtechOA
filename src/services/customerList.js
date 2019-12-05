import request from '@/utils/request';
/**
 * getCustomerListService [获取客户信息]
 * @author zhuoyue
 * @param int UID [用户UID]
 */
export async function getCustomerListService(UID) {
    return request('http://szhtonpal.aiyongbao.com//api', {
        method: 'POST',
        data: {
            method: 'aiyong.foreigntrade.ca.getcustomerlist',
            namespace: 'ss',
            UID,
        },
    });
}
/**
 * deleteCustomerService [伪删除客户信息]
 * @author zhuoyue
 * @param int id [用户id]
 */
export async function deleteCustomerService(id) {
    return request('http://szhtonpal.aiyongbao.com//api', {
        method: 'POST',
        data: {
            method: 'aiyong.foreigntrade.ca.deletecustomer',
            namespace: 'ss',
            id,
        },
    });
}
/**
 * updateCustomerService [修改客户信息]
 * @author zhuoyue
 * @param string contact [联系人]
 * @param string contactTel [联系人电话]
 * @param string product [产品]
 * @param int id [客户id]
 */
export async function updateCustomerService({ contact, contactTel, product, id }) {
    return request('http://szhtonpal.aiyongbao.com//api', {
        method: 'POST',
        data: {
            method: 'aiyong.foreigntrade.ca.updatecustomer',
            namespace: 'ss',
            contact,
            contactTel,
            product,
            id,
        },
    });
}
/**
 * updateCustomerStateService [修改客户状态]
 * @author zhuoyue
 * @param string note [备注]
 * @param string presentState [状态值]
 * @param int id [客户id]
 */
export async function updateCustomerStateService({ note, presentState, id }) {
    return request('http://szhtonpal.aiyongbao.com//api', {
        method: 'POST',
        data: {
            method: 'aiyong.foreigntrade.ca.updatecustomerstate',
            namespace: 'ss',
            note,
            presentState,
            id,
        },
    });
}
/**
 * releaseCustomerService [释放用户到公海]
 * @author zhuoyue
 * @param string UName [用户名称]
 * @param array idArray [需要修改的id]
 */
export async function releaseCustomerService({ UName, idArray }) {
    return request('http://szhtonpal.aiyongbao.com//api', {
        method: 'POST',
        data: {
            method: 'aiyong.foreigntrade.ca.releasecustomer',
            namespace: 'ss',
            UName,
            idArray: JSON.stringify(idArray),
        },
    });
}
/**
 * pushToMyCustomerService [从公海添加到私有]
 * @author zhuoyue
 * @param int UID [用户名称]
 * @param array idArray [需要修改的id]
 */
export async function pushToMyCustomerService({ UID, idArray }) {
    return request('http://szhtonpal.aiyongbao.com//api', {
        method: 'POST',
        data: {
            method: 'aiyong.foreigntrade.ca.pushtomycustomer',
            namespace: 'ss',
            UID,
            idArray: JSON.stringify(idArray),
        },
    });
}
/**
 * searchCustomerService [模糊查询]
 * @author zhuoyue
 * @param array idArray [需要修改的id]
 * @param array idArray [需要修改的id]
 * @param array idArray [需要修改的id]
 */
export async function searchCustomerService(parames) {
    return request('http://szhtonpal.aiyongbao.com//api', {
        method: 'POST',
        data: {
            method: 'aiyong.foreigntrade.ca.searchcustomer',
            namespace: 'ss',
            data: JSON.stringify(parames),
        },
    });
}
