import styles from '../AccountForm.module.scss'
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { noUser, selectData, userRegister } from '../../../redux/reducer';
import { useNavigate } from 'react-router-dom';
import validator from 'validator';

const cx = classNames.bind(styles);
function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const data = useSelector(selectData);

    const [lengthName, setLengthName] = useState(true)
    const [isEmail, setIsEmail] = useState(true)
    const [isLengthPassword, setIsLengthPassword] = useState(true)

    useEffect(() => {
        dispatch(noUser())
    }, [dispatch])

    const handleSubmit = async e => {
        e.preventDefault();

        setLengthName(validator.isLength(name, { min: 5, max: undefined }))
        setIsEmail(validator.isEmail(email))
        setIsLengthPassword(validator.isLength(password, { min: 5, max: undefined }))

        if (validator.isLength(name, { min: 5, max: undefined }) && validator.isEmail(email) && validator.isLength(password, { min: 5, max: undefined })) {
            const register = await dispatch(userRegister({
                name, email, password
            }));

            if (register.payload.status >= 200 && register.payload.status < 400) {
                navigate('/login');
            }
        }
    }

    return (
        <>
            <div className={cx('wrapper')}>
                <div className={cx('container')}>
                    <div className={cx('FormAccount')}>
                        <Button closeAccount>
                            <FontAwesomeIcon icon={faXmark} />
                        </Button>
                        <Button titleForm>Register</Button>
                        <form onSubmit={handleSubmit}>
                            <div className={cx('input-form')}>
                                <div className={cx('form-container')}>
                                    <Input AccountForm type={'text'} onChange={e => setName(e.target.value)} name={'name'} placeholder={"Name"} />
                                    <div className="container-error">
                                        <div className={cx('error')}>
                                            {lengthName ? <Fragment /> : 'The name must be at least 5 characters'}
                                        </div>
                                    </div>
                                    <Input AccountForm type={'email'} onChange={e => setEmail(e.target.value)} name={'email'} placeholder={"Email"} />
                                    <div className="container-error">
                                        <div className={cx('error')}>
                                            {isEmail ? <Fragment /> : 'The email must be a valid email address'}
                                        </div>
                                    </div>
                                    <Input AccountForm type={'password'} onChange={e => setPassword(e.target.value)} name={'password'} placeholder={"Password"} />
                                    <div className="container-error">
                                        <div className={cx('error')}>
                                            {isLengthPassword ? <Fragment /> : 'The password must be at least 5 characters'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={cx('container-btn')}>
                                <Button SubmitAccount>Register</Button>
                            </div>

                            <div className="container-error">
                                <div className={cx('error-ms')}>
                                    {data.data.message ? data.data.message : <Fragment />}
                                </div>
                            </div>

                        </form>

                        <div className={cx('input-form')}>
                            <Button> You already have an account ! Login</Button>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}

export default Register;