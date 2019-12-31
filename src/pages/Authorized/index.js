import { Route, Redirect } from 'dva/router';
import { connect } from 'dva';
import PropTypes from 'prop-types';

/** */
const AuthRouter = ({ route, login }) => {
    const { component: Component } = route;
    return (
        <Route render={(props) => {
            const { authorityState } = login;
            if (authorityState === '') {
                return <Redirect to="/user/login" />;
            }
            return <Component {...props} />;
        }}
        />
    );
};
AuthRouter.defaultProps = { route: '', login: '' };
AuthRouter.propTypes = { route: PropTypes.any, login: PropTypes.any };
export default connect(({ login }) => ({ login }))(AuthRouter);
