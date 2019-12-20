import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import '../assets/css/public.css';
import Header from './Header';

/** 页面入口 */
const BasicLayout = ({ location: { pathname }, children, dispatch }) => {
    useEffect(() => {
        const id = window.sessionStorage.getItem('sys_organization_id');
        const name = window.sessionStorage.getItem('name');
        dispatch({ type: 'login/getSession', payload: { id, name } });
    }, [dispatch]);
    return (
        <div>
            <Header pathname={pathname} />
            <div className="router-box">{children}</div>
        </div>
    );
};
BasicLayout.defaultProps = { location: '', children: '', dispatch: '' };
BasicLayout.propTypes = { location: PropTypes.any, children: PropTypes.any, dispatch: PropTypes.any };

export default connect()(BasicLayout);
