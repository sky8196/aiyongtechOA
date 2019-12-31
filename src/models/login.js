import router from 'umi/router';
import { logoutOAServices } from '@/services/user';
import { setSession } from '@/utils/common';

export default {
    namespace: 'login',
    state: {
        UID: 0, // 1  //2 // 3
        UName: '', // 小李 // 小张 // 小王
        authorityState: '',
    },
    effects: {
        /** */
        * logout(_, { call, put }) {
            const response = yield call(logoutOAServices);
            if (response.code === 200) {
                yield put({ type: 'clearLoginState' });
                setSession('customerProtectionLogin', '');
                router.push('/user/login');
            }
        },
    },
    reducers: {
        /** 更新state */
        setStart(state, { payload }) {
            return { ...state, ...payload };
        },
        /** 登入 */
        setLoginState(state, { payload }) {
            return {
                UID: payload.id,
                UName: payload.name,
                authorityState: payload.authorityState,
            };
        },
        /** */
        clearLoginState(state) {
            return {
                ...state,
                UID: 0,
                UName: '',
                authorityState: '',
            };
        },
    },
};
