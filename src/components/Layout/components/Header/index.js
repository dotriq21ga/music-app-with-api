import images from "../../../../assets/images";
import styles from "./Header.module.scss";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faMoon } from "@fortawesome/free-regular-svg-icons";
import Button from "../../../Button";
import Input from "../../../Input";
import { useSelector } from "react-redux";
import { selectData } from "../../../../redux/reducer";

const cx = classNames.bind(styles);

function Header() {

    const data = useSelector(selectData);

    return (
        <>
            <header>
                <nav>
                    <div className={cx("logo")}>
                        <img src={images.logo} alt="" />
                    </div>
                    <div className={cx("search")}>
                        <Input search type={'search'} name={'search'} placeholder={"Search songs, artists & podcasts you love!"} />
                        <Button search>
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </Button>
                    </div>
                    <div className={cx('home-page')}>
                        <Button to="/">Home</Button>
                    </div>

                    <Button toggle>
                        <FontAwesomeIcon icon={faMoon} />
                    </Button>

                    {data.data.currentUser.name ? <>
                        <Button account to="/profile">{data.data.currentUser.name}</Button>
                        <Button account to="/logout">Logout</Button>
                    </> : <>
                        <Button account to="/login">Login</Button>
                        <Button account to="/register">Register</Button>
                    </>
                    }
                </nav>
            </header>
        </>
    );
}

export default Header;
