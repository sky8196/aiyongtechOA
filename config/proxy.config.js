export default {
    '/*.shtml': {
        target: 'http://tonpaladmin.aiyongbao.com/',
        // pathRewrite: { '^/like/uploadFile': '' },
        changeOrigin: true, // target是域名的话，需要这个参数，
        secure: false, // 设置支持https协议的代理
    },
    '/api': {
        target: 'http://tonpaladmin.aiyongbao.com/',
        changeOrigin: true, // target是域名的话，需要这个参数，
    },
    '/login/*': {
        target: 'http://tonpaladmin.aiyongbao.com/',
        changeOrigin: true, // target是域名的话，需要这个参数，
    },
    '/like/*': {
        target: 'http://tonpaladmin.aiyongbao.com/',
        changeOrigin: true, // target是域名的话，需要这个参数，
    },
    '/assets/*': {
        target: 'http://tonpaladmin.aiyongbao.com/',
        changeOrigin: true, // target是域名的话，需要这个参数，
        secure: false, // 设置支持https协议的代理
    },
};
