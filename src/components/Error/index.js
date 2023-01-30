import styles from './PageError.module.scss'
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles)

function PageError({ error }) {
    return (
        <Link to={'/'}>
            <div className={cx('container')}>
                <div className={cx('status')}>{error.status}</div>
                <div className={cx('message')}>{error.message}</div>
                <div className={cx('homePage')}>HomePage</div>
            </div>
        </Link>
    );
}

export default PageError;