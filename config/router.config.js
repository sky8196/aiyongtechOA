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
            },
            {
                name: 'modify',
                path: '/user/modify',
                component: './User/Modify',
            },
        ],
    },
    {
        path: '/',
        component: '../layouts/BasicLayout.js',
        routes: [
            {
                path: '/',
                redirect: '/customerList',
                authority: ['admin', 'user'],
            },
            {
                path: '/customerList',
                name: 'customerList',
                component: './PublicCustomer/',
                icon: 'home',
            },
            {
                path: '/customerList/:id',
                name: 'customerDetail',
                component: './CustomerDetail/',
            },
            {
                path: '/myCustomer',
                name: 'myCustomer',
                component: './PrivateCustomer/',
            },
            {
                path: '/myCustomer/:id',
                name: 'myCustomerDetail',
                component: './CustomerDetail/',
            },
        ],
    },
];
