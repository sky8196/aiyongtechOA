import React from 'react';
import NavLink from 'umi/navlink';
import './index.scss';

/** 头部 */
const Header = () => (
    <div className="hearder">
        <header className="nav">
            <div className="header-a-box">
                <NavLink to="/customerList">公海客户</NavLink>
            </div>
            <div className="header-a-box">
                <NavLink to="/myCustomer">我的客户</NavLink>
            </div>
        </header>
        <div className="header-right" />
    </div>
);
export default Header;
