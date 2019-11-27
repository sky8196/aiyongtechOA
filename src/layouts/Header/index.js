import React from 'react';
import NavLink from 'umi/navlink';
import './index.scss';


class Header extends React.Component {
    
    render() {
            return (
                <header id="header">
                        <div className="header-a-box"><NavLink to="/customerList" >公海客户</NavLink></div>
                        <div className='header-a-box'><NavLink to="/myCustomer" >我的客户</NavLink></div>
                </header>
            );
    }
}
export default Header;