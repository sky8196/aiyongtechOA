import request from '@/utils/request';

/**
 * loginCustomerProtection [登入]
 * @author zhuoyue
 * @param {String} phonenumber [手机号]
 * @param {String} password [密码]
 */
export async function loginOAService({ phonenumber, password }) {
    return request('/login/loginCustomerProtection', {
        method: 'POST',
        data: {
            phonenumber,
            password,
        },
    });
}
/**
 * modifyPasswordOA [修改密码]
 * @author zhuoyue
 * @param {String} phonenumber [手机号]
 * @param {String} newPassword [新密码]
 */
export async function modifyPasswordOAService({ phonenumber, newPassword, verificationCode }) {
    return request('/login/modifyPasswordOA', {
        method: 'POST',
        data: {
            phonenumber,
            newPassword,
            verificationCode,
        },
    });
}
/**
 * verificationCodeOA [获取验证码]
 * @author zhuoyue
 * @param {String} phonenumber [手机号]
 */
export async function verificationCodeOAService({ phonenumber }) {
    return request('/login/verificationCodeOA', {
        method: 'POST',
        data: { phonenumber },
    });
}
