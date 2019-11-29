import request from '@/utils/request';
/**
 * hasRegister [公司名称是否登记过]
 * @author lishen
 */
export async function hasRegister(name) {
    return request('http://szhtonpal.aiyongbao.com//api', {
        method: 'POST',
        data: {
            method: 'aiyong.foreigntrade.ca.hasRegister',
            namespace: 'ss',
            name,
        },
    });
}
/**
 * insertMyCustomer [新增客户]
 * @author lishen
 */
export async function insertMyCustomer(form) {
    return request('http://szhtonpal.aiyongbao.com//api', {
        method: 'POST',
        data: {
            method: 'aiyong.foreigntrade.ca.insertMyCustomer',
            namespace: 'ss',
            form: JSON.stringify(form),
        },
    });
}
