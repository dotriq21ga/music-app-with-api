import styles from './Button.module.scss';
import classNames from 'classnames/bind';
import React from 'react';
import { Link } from 'react-router-dom';
const cx = classNames.bind(styles);

function Button({
    id,
    children,
    className,
    to,
    href,
    onClick,
    btnSlider = false,
    moveLeft = false,
    moveRight = false,
    search = false,
    toggle = false,
    account = false,
    closeAccount = false,
    titleForm = false,
    SubmitAccount = false,
    btnPlayList = false,
    haveAccount = false,
    loginRecommended = false,
    btnRight = false,
    btnQueue = false,
    queue = false,
    history = false,
    option = false,
    cardRow = false,
    like = false,
    iconHeadert = false,
}) {

    let Comp = 'button';
    const props = {
        onClick,
    };

    if (href) {
        props.href = href;
        Comp = 'a';
    } else if (to) {
        props.to = to;
        Comp = Link;
    }

    const classes = cx({
        [className]: className,
        search,
        toggle,
        account,
        closeAccount,
        titleForm,
        SubmitAccount,
        btnSlider,
        moveLeft,
        moveRight,
        btnPlayList,
        haveAccount,
        loginRecommended,
        btnRight,
        btnQueue,
        queue,
        option,
        history,
        cardRow,
        like,
        iconHeadert,
    });

    return (
        <Comp id={id} className={classes} {...props}>
            {children}
        </Comp>
    );
}

export default Button;