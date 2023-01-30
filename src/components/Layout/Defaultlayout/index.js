import styles from "./Defaultlayout.module.scss"
import Header from "../components/Header";
import classNames from "classnames";
const cx = classNames.bind(styles);

function Defaultlayout({ children }) {
    return <div className={cx('wrapper')}>
        <Header />
        {children}
    </div>;
}

export default Defaultlayout;