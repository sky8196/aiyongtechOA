export default [
    // app
    {
        path: '/',
        component: '../layouts/index',
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
