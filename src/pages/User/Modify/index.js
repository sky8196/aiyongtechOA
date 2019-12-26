import React from 'react';
import { Input, Button, message } from 'antd';
import router from 'umi/router';
import Link from 'umi/link';
import { modifyPasswordOAService, verificationCodeOAService } from '@/services/user';
import './index.scss';

/** Modify */
class Modify extends React.Component {
    /** */
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            phonenumber: '',
            newPassword: '',
            onceNewPassword: '',
            buttonValue: '发送验证码',
            countDown: 60,
            verificationCode: '',
            codeState: true,
        };
    }

    getValue = ({ target }) => {
        const type = target.getAttribute('name');
        this.setState({ [type]: target.value });
    };

    enterVerificationCode = async () => {
        const { phonenumber, buttonValue } = this.state;
        if (buttonValue === '发送验证码') {
            if (phonenumber === '' || phonenumber.length !== 11) {
                message.warning('请输入正确的手机号');
                return;
            }
            const response = await verificationCodeOAService({ phonenumber });
            console.log(response);
            if (response === undefined || response.code === 403) {
                message.error('发送失败,请检查手机号是否正确');
            } else if (response.code === 200) {
                message.success('发送成功');
                this.setState({ codeState: false });
                const interval = setInterval(() => {
                    console.log(1);
                    const { countDown } = this.state;
                    if (countDown === 0) {
                        clearInterval(interval);
                        this.setState({ countDown: 60, buttonValue: '发送验证码' });
                    } else {
                        const lsTime = countDown - 1;
                        this.setState({ countDown: lsTime, buttonValue: `已发送${lsTime}` });
                    }
                }, 1000);
            }
        }
    };

    enterLoading = () => {
        const { phonenumber, newPassword, onceNewPassword, verificationCode } = this.state;
        if (phonenumber === '' || newPassword === '' || onceNewPassword === '' || verificationCode === '') {
            message.warning('手机号、密码、验证码不能为空');
        } else {
            this.setState({ loading: true }, async () => {
                if (newPassword !== onceNewPassword) {
                    message.warning('二次新密码不一致');
                } else {
                    const response = await modifyPasswordOAService({ phonenumber, newPassword, verificationCode });
                    this.setState({ loading: false }, () => {
                        if (response === undefined || response.code === 403) {
                            message.warning(`${response.msg}`);
                        } else if (response.code === 200) {
                            message.success(`${response.msg}`);
                            router.push('/user/login');
                        }
                    });
                }
            });
        }
    };

    // 倒计时
    setTime = () => {

    };

    /** */
    render() {
        const { buttonValue, codeState } = this.state;
        return (
            <div className="modify">
                <div className="modify-img"><img src="https://q.aiyongbao.com/ft/public/img/logo_dark.png" alt="" /></div>
                <div className="modify-box">
                    <p>外贸通宝客保系统-修改密码</p>
                    <div className="modify-main">
                        <Input placeholder="请输入手机号" name="phonenumber" onChange={this.getValue} />
                        <Input.Password placeholder="请输入新密码" name="newPassword" onChange={this.getValue} />
                        <Input.Password placeholder="请再次新密码" name="onceNewPassword" onChange={this.getValue} />
                        <div className="verificationCode">
                            <Input placeholder="请输入验证码" disabled={codeState} name="verificationCode" onChange={this.getValue} />
                            <Button onClick={this.enterVerificationCode}>{buttonValue}</Button>
                        </div>
                        <div className="button-box">
                            <Button type="primary" loading={this.state.loading} onClick={this.enterLoading}>
                                确认修改
                            </Button>
                            <Link to="/user/login">返回登入</Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default Modify;
