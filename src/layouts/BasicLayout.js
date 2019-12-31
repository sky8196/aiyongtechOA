import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import router from 'umi/router';
import '../assets/css/public.css';
import Header from './Header';
import { getSession } from '@/utils/common';

/** 页面入口 */
class BasicLayout extends React.Component {
    /** */
    constructor(props) {
        super(props);
        this.state = {};
        if (this.checkLoginSession()) {
            router.push('/user/login');
        }
    }

    /** */
    checkLoginSession = () => {
        const { dispatch } = this.props;
        let customerProtectionLogin = getSession('customerProtectionLogin');
        if (customerProtectionLogin !== '') {
            customerProtectionLogin = JSON.parse(customerProtectionLogin);
            const { id, name, authorityState } = customerProtectionLogin;
            dispatch({ type: 'login/setLoginState', payload: { id, name, authorityState } });
            return false;
        }
        return true;
    };

    /** */
    render() {
        const { location: { pathname }, children } = this.props;
        return (
            <>
                <Header pathname={pathname} />
                <div className="router-box">{children}</div>
            </>
        );
    }
}


BasicLayout.defaultProps = { location: '', children: '', dispatch: '' };
BasicLayout.propTypes = { location: PropTypes.any, children: PropTypes.any, dispatch: PropTypes.any };

export default connect(({ login }) => ({ login }))(BasicLayout);
