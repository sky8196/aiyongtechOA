import React from 'react';
import NavLink from 'umi/navlink';
import './index.scss';

/** 头部 */
const Header = () => (
    <header id="header">
        <div className="header-a-box">
            <NavLink to="/customerList">公海客户</NavLink>
        </div>
        <div className="header-a-box">
            <NavLink to="/myCustomer">我的客户</NavLink>
        </div>
    </header>
);
export default Header;
