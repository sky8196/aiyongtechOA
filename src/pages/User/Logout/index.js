import React from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import './index.scss';

/** */
const Logout = ({ dispatch }) => (
    <div className="logout">
        <span onClick={() => { dispatch({ type: 'login/logout' }); }}>退出登录</span>
    </div>
);
Logout.defaultProps = { dispatch: {} };
Logout.propTypes = { dispatch: PropTypes.any };
export default connect(({ login }) => ({ login }))(Logout);
