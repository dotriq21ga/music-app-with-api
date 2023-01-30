import { useState } from "react";
import styles from './PlayList.module.scss';
import classNames from 'classnames/bind';
import { Link } from "react-router-dom";
const cx = classNames.bind(styles);

function PlayList({ items }) {

    const [albums] = useState(items.albums)

    return (
        <>
            <h2 className={cx('title')}>{items.title}</h2>

            <div className={cx('list-album')}>
                {
                    albums.map((data) => {
                        return (
                            <div key={data.id} className={cx('card')}>
                                <Link to={'/album/'+ data.id}>
                                    <img src={"http://localhost:8000/storage/images/" + data.banner} alt='' />
                                    <h1 className={cx('title-card')}>{data.title}</h1>
                                    <div>{data.sort_description}</div>
                                </Link>
                            </div>
                        )
                    })
                }
            </div>
        </>
    )
}

export default PlayList;