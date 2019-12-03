import request from '@/utils/request';
/**
 * testRegisterService [公司名称是否登记过]
 * @author zhuoyue
 * @param string name [公司名字]
 */
export async function testRegisterService(name) {
    return request('http://szhtonpal.aiyongbao.com//api', {
        method: 'POST',
        data: {
            method: 'aiyong.foreigntrade.ca.registeredAction',
            namespace: 'ss',
            name,
        },
    });
}
/**
 * insertMyCustomerService [新增客户]
 * @author zhuoyue
 * @param json form [表单数据]
 */
export async function insertMyCustomerService(form) {
    return request('http://szhtonpal.aiyongbao.com//api', {
        method: 'POST',
        data: {
            method: 'aiyong.foreigntrade.ca.insertMyCustomerAction',
            namespace: 'ss',
            form: JSON.stringify(form),
        },
    });
}
