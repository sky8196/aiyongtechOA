import React from 'react';
import PropTypes from 'prop-types';
import '../assets/css/public.css';
import Header from './Header';

/** 页面入口 */
const BasicLayout = ({ location: { pathname }, children }) => (
    <div>
        <Header pathname={pathname} />
        <div className="router-box">{children}</div>
    </div>
);
BasicLayout.defaultProps = { location: '', children: '' };
BasicLayout.propTypes = { location: PropTypes.any, children: PropTypes.any };
export default BasicLayout;
