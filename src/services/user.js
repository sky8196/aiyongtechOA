import request from '@/utils/request';

/**
 * loginOAService [登入]
 * @author zhuoyue
 * @param {String} phonenumber [手机号]
 * @param {String} password [密码]
 */
export async function loginOAService({ phonenumber, password }) {
    return request('/api', {
        method: 'POST',
        data: {
            method: 'aiyong.tonpaladmin.newoa.loginoa',
            namespace: 'ss',
            phonenumber,
            password,
        },
    });
}
/**
 * modifyPasswordOAService [修改密码]
 * @author zhuoyue
 * @param {String} phonenumber [手机号]
 * @param {String} newPassword [新密码]
 */
export async function modifyPasswordOAService({ phonenumber, newPassword, verificationCode }) {
    return request('/api', {
        method: 'POST',
        data: {
            method: 'aiyong.tonpaladmin.newoa.modifypasswordoa',
            namespace: 'ss',
            phonenumber,
            newPassword,
            verificationCode,
        },
    });
}
/**
 * verificationCodeOAService [获取验证码]
 * @author zhuoyue
 * @param {String} phonenumber [手机号]
 */
export async function verificationCodeOAService({ phonenumber }) {
    return request('/api', {
        method: 'POST',
        data: {
            method: 'aiyong.tonpaladmin.newoa.verificationcodeoa',
            namespace: 'ss',
            phonenumber,
        },
    });
}
