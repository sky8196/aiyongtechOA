import request from '@/utils/request';
/**
 * testRegisterService [公司名称是否登记过]
 * @author zhuoyue
 * @param string name [公司名字]
 */
export async function testRegisterService(companyName) {
    return request('/api', {
        method: 'POST',
        data: {
            method: 'aiyong.tonpaladmin.newoa.registered',
            namespace: 'ss',
            companyName,
        },
    });
}
/**
 * insertMyCustomerService [新增客户]
 * @author zhuoyue
 * @param string companyName [公司名称]
 * @param string contact [联系人]
 * @param string contactTel [联系人电话]
 * @param string product [产品]
 * @param int UID [用户UID|归属用户]
 * @param string UName [用户名称|创建人名称]
 */
export async function insertMyCustomerService({ companyName, contact, contactTel, product, UID, UName }) {
    return request('/api', {
        method: 'POST',
        data: {
            method: 'aiyong.tonpaladmin.newoa.insertmycustomer',
            namespace: 'ss',
            companyName,
            contact,
            contactTel,
            product,
            UID,
            UName,
        },
    });
}
