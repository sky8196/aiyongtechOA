import React from 'react';
import NavLink from 'umi/navlink';
import './index.scss';
import Logout from '@/pages/User/Logout';
/** 头部 */
const Header = () => (
    <div className="hearder">
        <header className="nav">
            <div className="header-a-box">
                <NavLink to="/customerList">公海客户</NavLink>
            </div>
            <div className="header-a-box">
                <NavLink to="/privateCustomer">我的客户</NavLink>
            </div>
        </header>
        <div className="header-right">
            <Logout />
        </div>
    </div>
);
export default Header;
