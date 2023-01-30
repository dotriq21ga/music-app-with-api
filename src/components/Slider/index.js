import { useCallback, useEffect, useState } from "react";
import styles from './Slider.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft, faCaretRight } from "@fortawesome/free-solid-svg-icons";
import Button from "../Button";
const cx = classNames.bind(styles);

function Slider({ items }) {
    const [data] = useState(items.sliders)
    const [classSlider, setClassSlider] = useState(['last', 'add', 'first', 'previous', 'selected', 'next']);
    const moveRight = useCallback(() => {
        const cutElementFirst = classSlider.slice(0, classSlider.length - 1)
        const elementFirst = classSlider.slice(classSlider.length - 1, classSlider.length)
        cutElementFirst.unshift(elementFirst)

        const home = cutElementFirst.reduce(function (flatOutput, array) {
            return flatOutput.concat(array);
        }, []);

        setClassSlider(home)
    }, [classSlider])

    const moveLeft = () => {
        const cutElementFirst = classSlider.slice(1, classSlider.length)
        const elementFirst = classSlider.slice(0, 1)
        cutElementFirst.push(elementFirst)

        const home = cutElementFirst.reduce(function (flatOutput, array) {
            return flatOutput.concat(array);
        }, []);

        setClassSlider(home)

    }

    useEffect(() => {
        let timeout = setTimeout(moveRight, 5000);
        return () => {
            clearInterval(timeout)
        }
    }, [moveRight])

    return (
        <>
            <div className={cx('wrapper')}>
                <Button btnSlider moveLeft onClick={moveLeft}>
                    <FontAwesomeIcon icon={faCaretLeft} />
                </Button>
                {
                    data.map((data, index) => {
                        return (
                            <div key={data.id} id={cx(classSlider[index])} className={cx('slider')}>
                                <img src={"http://localhost:8000/storage/images/" + data.thumbnail} alt='' />
                            </div>
                        )
                    })
                }
                <Button btnSlider moveRight onClick={moveRight}>
                    <FontAwesomeIcon icon={faCaretRight} />
                </Button>

            </div>
        </>
    );
}

export default Slider;