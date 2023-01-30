import styles from './Input.module.scss';
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

function Input({
    name,
    placeholder,
    type,
    className,
    search,
    AccountForm,
    remember,
    onChange,
}) {
    const props = {
        onChange,
    };
    const classes = cx({
        [className]: className,
        search,
        AccountForm,
        remember
    });
    return (<input
        className={classes}
        type={type}
        name={name}
        placeholder={placeholder}
        {...props}
    />);
}

export default Input;