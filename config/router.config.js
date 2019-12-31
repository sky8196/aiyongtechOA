export default [
    // app
    {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
            {
                name: 'login',
                path: '/user/login',
                component: './User/Login',
                title: '登入 | 客保系统',
            },
            {
                name: 'modify',
                path: '/user/modify',
                component: './User/Modify',
                title: '修改密码 | 客保系统',
            },
        ],
    },
    {
        path: '/',
        component: '../layouts/BasicLayout.js',
        // Routes: ['./src/pages/Authorized'],
        routes: [
            {
                path: '/',
                redirect: '/privateCustomer',
                authority: ['admin', 'user'],
            },
            {
                path: '/customerList',
                name: 'customerList',
                component: './PublicCustomer/',
                icon: 'home',
                title: '公海客户 | 客保系统',
            },
            {
                path: '/customerList/:id',
                name: 'customerDetail',
                component: './CustomerDetail/',
                title: '客户详情 | 客保系统',
            },
            {
                path: '/privateCustomer',
                name: 'privateCustomer',
                component: './PrivateCustomer/',
                title: '私有客户 | 客保系统',
            },
            {
                path: '/privateCustomer/:id',
                name: 'privateCustomerDetail',
                component: './CustomerDetail/',
                title: '客户详情 | 客保系统',
            },
        ],
    },
];
