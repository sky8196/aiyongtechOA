import React from 'react';
import NavLink from 'umi/navlink';
import Link from 'umi/link';
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
        <div className="header-right">
            <div className="header-a-box">
                <Link to="/user/modify">修改密码</Link>
            </div>
        </div>
    </div>
);
export default Header;
