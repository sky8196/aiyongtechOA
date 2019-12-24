import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import router from 'umi/router';

import '../assets/css/public.css';
import Header from './Header';

/** 页面入口 */
const BasicLayout = ({ location: { pathname }, children, login }) => {
    useEffect(() => {
        const { authorityState } = login;
        if (authorityState === '') {
            router.push('/user/login');
        }
    });
    return (
        <div>
            <Header pathname={pathname} />
            <div className="router-box">{children}</div>
        </div>
    );
};
BasicLayout.defaultProps = { location: '', children: '', login: '' };
BasicLayout.propTypes = { location: PropTypes.any, children: PropTypes.any, login: PropTypes.any };

export default connect(({ login }) => ({ login }))(BasicLayout);
