import request from '@/utils/request';

/**
 * loginCustomerProtection [登入]
 * @author zhuoyue
 * @param {String} phonenumber [手机号]
 * @param {String} password [密码]
 */
export async function loginCustomerProtectionAction({ phonenumber, password }) {
    return request('/login/loginCustomerProtection', {
        method: 'POST',
        data: {
            phonenumber,
            password,
        },
    });
}
/**
 * modifyPasswordOAAction [修改密码]
 * @author zhuoyue
 * @param {String} phonenumber [手机号]
 * @param {String} newPassword [新密码]
 */
export async function modifyPasswordOAAction({ phonenumber, newPassword, verificationCode }) {
    return request('/login/modifyPasswordOAAction', {
        method: 'POST',
        data: {
            phonenumber,
            newPassword,
            verificationCode,
        },
    });
}
/**
 * verificationCodeOAAction [获取验证码]
 * @author zhuoyue
 * @param {String} phonenumber [手机号]
 */
export async function verificationCodeOAAction({ phonenumber }) {
    return request('/login/verificationCodeOAAction', {
        method: 'POST',
        data: { phonenumber },
    });
}
/**
 * logoutOAServices [退出登入]
 * @author zhuoyue
 * */
export async function logoutOAServices() {
    return request('/api', {
        method: 'POST',
        data: {
            method: 'aiyong.tonpaladmin.newoa.logoutoa',
            namespace: 'ss',
        },
    });
}
