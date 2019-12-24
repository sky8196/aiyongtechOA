import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import router from 'umi/router';
import { Input, Button, message } from 'antd';
import { loginOAService } from '@/services/user';
import './index.scss';

/** Login */
class Login extends React.Component {
    /** */
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            phonenumber: '',
            password: '',
        };
    }

    enterLoading = () => {
        const { phonenumber, password } = this.state;
        const { dispatch } = this.props;
        if (phonenumber === '' || password === '') {
            message.warning('请输入手机号或密码');
        } else {
            this.setState({ loading: true }, async () => {
                const response = await loginOAService({ phonenumber, password });
                if (response.code === 403) {
                    message.warning('手机号或密码错误');
                    this.setState({ loading: false });
                } else if (response.code === 200) {
                    const { authorityState, id, name } = response;
                    if (authorityState === '0') {
                        message.error('权限不足');
                        this.setState({ loading: false });
                    } else {
                        dispatch({ type: 'login/setLoginState', payload: { id, name, authorityState } });
                        this.setState({ loading: false }, () => {
                            message.success('登入成功');
                            router.push('/');
                        });
                    }
                }
            });
        }
    };

    getPhonenumber = ({ target }) => {
        this.setState({ phonenumber: target.value });
    };

    getPassword = ({ target }) => {
        this.setState({ password: target.value });
    };

    /** */
    render() {
        return (
            <div className="login">
                <div className="login-img"><img src="https://q.aiyongbao.com/ft/public/img/logo_dark.png" alt="" /></div>
                <div className="login-box">
                    <p>外贸通宝客保系统</p>
                    <div>
                        <Input placeholder="请输入手机号" onChange={this.getPhonenumber} />
                        <Input.Password placeholder="请输入密码" onChange={this.getPassword} />
                        <Button type="primary" loading={this.state.loading} onClick={this.enterLoading}>
                            登入
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}
Login.defaultProps = { dispatch: '' };
Login.propTypes = { dispatch: PropTypes.any };
export default connect(({ login }) => ({ login }))(Login);
