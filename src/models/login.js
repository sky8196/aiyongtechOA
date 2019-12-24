export default {
    namespace: 'login',
    state: {
        UID: 0, // 1  //2 // 3
        UName: '', // 小李 // 小张 // 小王
        authorityState: '',
    },
    effects: {},
    reducers: {
        /** 更新state */
        setStart(state, { payload }) {
            return { ...state, ...payload };
        },
        /**  */
        setLoginState(state, { payload }) {
            return {
                UID: payload.id,
                UName: payload.name,
                authorityState: payload.authorityState,
            };
        },
    },
};
