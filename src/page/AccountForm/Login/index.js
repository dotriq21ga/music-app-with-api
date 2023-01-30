import { Fragment, useEffect, useState } from "react";
import styles from '../AccountForm.module.scss'
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import { useDispatch, useSelector } from "react-redux";
import { noUser, selectData, userLogin } from "../../../redux/reducer";
import { useNavigate } from "react-router-dom";
import { render } from "@testing-library/react";
import validator from 'validator';
const cx = classNames.bind(styles);

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const data = useSelector(selectData);
    const [isEmail, setIsEmail] = useState(true)
    const [isLengthPassword, setIsLengthPassword] = useState(true)

    useEffect(() => {
        dispatch(noUser())
    }, [dispatch])

    const handleSubmit = async e => {
        e.preventDefault();

        setIsEmail(validator.isEmail(email))
        setIsLengthPassword(validator.isLength(password, { min: 5, max: undefined }))

        if (validator.isEmail(email) && validator.isLength(password, { min: 5, max: undefined })) {
            const user = await dispatch(userLogin({
                email,
                password
            }));
            if (user.payload.status >= 200 && user.payload.status < 400) {
                navigate('/')
                render(
                    <div className={cx('notification')}>
                        <FontAwesomeIcon icon={faCheck} />
                        <div>
                            Logged successfully
                        </div>
                    </div>)
            }
        }
    }

    return <>
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('FormAccount')}>
                    <Button closeAccount>
                        <FontAwesomeIcon icon={faXmark} />
                    </Button>
                    <Button titleForm>Login</Button>

                    <form onSubmit={handleSubmit}>
                        <div className={cx('input-form')}>
                            <div className={cx('form-container')}>
                                <Input AccountForm type={'email'} name={'email'} onChange={e => setEmail(e.target.value)} placeholder={"Email"} />
                                <div className="container-error">
                                    <div className={cx('error')}>
                                        {isEmail ? <Fragment /> : 'The email must be a valid email address'}
                                    </div>
                                </div>
                                <Input AccountForm type={'password'} name={'password'} onChange={e => setPassword(e.target.value)} placeholder={"Password"} />
                                <div className="container-error">
                                    <div className={cx('error')}>
                                        {isLengthPassword ? <Fragment /> : 'The password must be at least 5 characters'}
                                    </div>
                                </div>
                            </div>

                            <div className={cx('remember')}>
                                <div>
                                    <Input remember type={"checkbox"} name={'remember'} />
                                    <span>Remember me</span>
                                </div>
                                <div>
                                    <Button href="/">Forgot Password?</Button>
                                </div>
                            </div>
                        </div>

                        <div className={cx('container-btn')}>
                            <Button SubmitAccount>Login</Button>
                        </div>

                        <div className="container-error">
                            <div className={cx('error-ms')}>
                                {data.data.message}
                            </div>
                        </div>
                    </form>

                    <div className={cx('input-form')}>
                        <Button>Don't have an account yet ! Create an account.</Button>
                    </div>

                </div>
            </div>
        </div>
    </>
}

export default Login;