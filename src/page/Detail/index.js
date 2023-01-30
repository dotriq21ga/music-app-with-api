import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageError from '../../components/Error';
import styles from './Detail.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faHeart, faPause, faPlay, faSpinner, faUser } from '@fortawesome/free-solid-svg-icons';
import Button from '../../components/Button';
import { useDispatch, useSelector } from 'react-redux';
import { PauseMusic, PlayMusic, selectData, song } from '../../redux/reducer';
import Pusher from "pusher-js";

const cx = classNames.bind(styles);

async function getDetail(id) {
    const data = await fetch('http://localhost:8000/api/album/' + id);
    return await data.json();
}

async function getDetailToken(id, token) {
    const data = await fetch('http://localhost:8000/api/album/detail/' + id, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    return await data.json();
}

async function like(id, token) {
    const data = await fetch('http://localhost:8000/api/like/' + id, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    return await data.json();
}


function DetailAlbum() {
    const { id } = useParams();
    const [detail, setDetail] = useState();
    const dispatch = useDispatch();
    const data = useSelector(selectData);
    const localJson = localStorage.getItem('songs')
    const [local, setLocal] = useState([])
    const [classHiden, setClassHiden] = useState()

    const tokenString = sessionStorage.getItem('token');
    const token = JSON.parse(tokenString);

    const [notification, setNotification] = useState({})

    const navigate = useNavigate();

    useEffect(() => {
        let mounted = true;
        if (!token) {
            getDetail(id)
                .then(datas => {
                    if (mounted) {
                        setDetail(datas)
                    }
                })
        }
        else {
            getDetailToken(id, token)
                .then(datas => {
                    if (mounted) {
                        setDetail(datas)
                    }
                })
        }

        return () => mounted = false;
    }, [id, token])

    useEffect(() => {
        if (localJson) {
            setLocal(JSON.parse(localJson))
        }
    }, [localJson])

    useEffect(() => {
        dispatch(PauseMusic())
    }, [dispatch])

    useEffect(() => {
        if (detail) {
            if (detail.status < 400) {
                if (data.data.currentSong.isPlay) {
                    const array = []
                    for (let i = 0; i < detail.items.songs.length; i++) {
                        if (local[local.length - 1].id === detail.items.songs[i].id) {
                            array[i] = true
                        }
                        else {
                            array[i] = false
                        }
                    }
                    setClassHiden(array)
                }
                else {
                    const array = []
                    for (let i = 0; i < detail.items.songs.length; i++) {
                        array[i] = false
                    }
                    setClassHiden(array)
                }
            }
        }
    }, [data, detail, local])

    useEffect(() => {
        const pusher = new Pusher("38294470fd1709afb927", {
            cluster: "ap1",
        });
        const channel = pusher.subscribe("my-channel");
        channel.bind("my-event", (data) => {
            setNotification({
                dataLike: data,
            });
        });
    }, [])

    const handleClick = () => {
        if (!data.data.currentSong.song) {
            dispatch(song(detail.items.songs[0].id))
            let ref = [...local]

            localStorage.setItem('listen', JSON.stringify([detail.items.songs[0]]))
            let array = []
            for (let i = 0; i < detail.items.songs.length - 1; i++) {
                array[i] = detail.items.songs[i + 1]
            }
            localStorage.setItem('queue', JSON.stringify(array))

            if (Object.keys(local).length === 0) {
                return localStorage.setItem('songs', JSON.stringify(local.concat(detail.items.songs[0])))
            }
            else {
                if (ref[ref.length - 1].id !== detail.items.songs[0].id) {
                    return localStorage.setItem('songs', JSON.stringify(ref.concat(detail.items.songs[0])))
                }
                else {
                    return data.data.currentSong.isPlay ? dispatch(PauseMusic()) : dispatch(PlayMusic())
                }
            }
        }
        else {
            return data.data.currentSong.isPlay ? dispatch(PauseMusic()) : dispatch(PlayMusic())
        }
    }

    const ClickSong = (music) => {
        if (local.length >= 1) {
            if (local[local.length - 1].id === music.id) {
                if (data.data.currentSong.song) {
                    return data.data.currentSong.isPlay ? dispatch(PauseMusic()) : dispatch(PlayMusic())
                }
            }
        }
        dispatch(song(music.id))
        let ref = [...local]
        let array = []
        let j = 0
        for (let i = 0; i < detail.items.songs.length; i++) {
            array[j] = detail.items.songs[i]
            j++
            if (detail.items.songs[i].id === music.id) {
                localStorage.setItem('listen', JSON.stringify(array))
                array = []
                j = 0
            }
        }

        localStorage.setItem('queue', JSON.stringify(array))

        if (local.length === 0) {
            return localStorage.setItem('songs', JSON.stringify([music]))
        }

        for (let count = 0; count < ref.length; count++) {
            if (ref[count].id === music.id) {
                delete ref[count]
                for (let crurrentCount = count; crurrentCount < ref.length - 1; crurrentCount++) {
                    ref[crurrentCount] = ref[crurrentCount + 1]
                }
                ref[ref.length - 1] = music
                return localStorage.setItem('songs', JSON.stringify(ref))
            }
            else {
                if (count === ref.length - 1) {
                    return localStorage.setItem('songs', JSON.stringify(ref.concat(music)))
                }
            }
        }
    }

    console.log(notification)

    const likeDetail = (idSong, event) => {
        /* const el = event.target; */
        if (token) {
            /* el.setAttribute('style', 'color: red') */
            like(idSong.id, token)
                .then(data => {
                    if (data.status > 400) {
                        /* el.setAttribute('style', 'color: white') */
                    }
                })
        } else {
            navigate('/login');
        }
    }

    if (detail) {
        if (detail.status >= 400) {
            return (
                <PageError error={detail} />
            )
        }
        else {
            localStorage.setItem('list', JSON.stringify(detail.items.songs))
            if (classHiden) {

                return (
                    <>
                        <div className={cx('wrapper')}>
                            <div className={cx('box-left')}>
                                <img src={"http://localhost:8000/storage/images/" + detail.items.banner} alt='' />
                                <div className={cx('contains')}>
                                    <div className={cx('title')}>{detail.items.title}</div>
                                    <div className={cx('text')}>Tác giả : {detail.items.artists}</div>
                                    <Button btnPlayList onClick={handleClick}>
                                        <div className={cx('playListContainer')}>
                                            {data.data.currentSong.loading === 'loading' ?
                                                <>
                                                    <FontAwesomeIcon icon={faSpinner} />
                                                    <span>Loading</span>
                                                </>
                                                : data.data.currentSong.isPlay ? <>
                                                    <FontAwesomeIcon icon={faPause} />
                                                    <span>Pause</span>
                                                </> : <>
                                                    <FontAwesomeIcon icon={faPlay} />
                                                    <span>Play</span>
                                                </>}
                                        </div>
                                    </Button>
                                </div>
                            </div>

                            <div className={cx('box-right')}>
                                <div className={cx('description')}>
                                    <span>Lời tựa : </span>
                                    {detail.items.sort_description}
                                </div>

                                <div className={cx('list')}>
                                    <table>
                                        <tbody>
                                            {
                                                detail.items.songs.map((datas, index) => {

                                                    return (
                                                        <tr key={datas.id}>
                                                            <td className={cx('img-td')}>
                                                                <button onClick={() => ClickSong(datas)}>
                                                                    <img src={"http://localhost:8000/storage/images/" + datas.image} alt='' />
                                                                    {
                                                                        classHiden[index] ?
                                                                            <>
                                                                                <div className={(cx('box-animation'))}>
                                                                                    <div style={{ height: '25px' }} className={(cx('animation'))}></div>
                                                                                    <div className={[cx('animation1', cx('animation'))]}></div>
                                                                                    <div className={[cx('animation2', cx('animation'))]}></div>
                                                                                    <div className={[cx('animation3', cx('animation'))]}></div>
                                                                                </div>
                                                                            </>
                                                                            :

                                                                            data.data.currentSong.loading === 'loading' ?
                                                                                <div className={cx('icon-the-hidden')}>
                                                                                    <FontAwesomeIcon icon={faSpinner} />
                                                                                </div>
                                                                                :
                                                                                <div className={cx('icon-the-hidden')}>
                                                                                    <FontAwesomeIcon icon={faPlay} />
                                                                                </div>
                                                                    }
                                                                </button>
                                                            </td>
                                                            <td className={cx('name-song')}>{datas.name} <p>{datas.artist}</p></td>
                                                            <td>
                                                                {
                                                                    datas.has_like
                                                                        ?
                                                                        <Button id={'like'} like>
                                                                            <FontAwesomeIcon icon={faHeart} />
                                                                        </Button> :
                                                                        <Button onClick={(e) => { likeDetail(datas, e) }}>
                                                                            <FontAwesomeIcon icon={faHeart} />
                                                                        </Button>
                                                                }
                                                            </td>
                                                            <td>
                                                                <FontAwesomeIcon icon={faEllipsisVertical} />
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>

                            </div>
                        </div>

                        <div className={cx('wrapper')}>
                            <div className={cx('box')}>
                                <h2>Recommended Songs</h2>
                                <div className={cx('card')}>
                                    <p>
                                        <FontAwesomeIcon icon={faUser} />
                                        Login to view your recommended songs
                                    </p>
                                    <p>
                                        Login or sign up with your mobile number to get personalised recommendations based on the music you have listened to across all your devices
                                    </p>
                                    <div className={cx('box-recommended')}>
                                        <Button haveAccount>
                                            Don't have account?
                                        </Button>

                                        <Button loginRecommended>
                                            Login
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )
            }
        }
    }
}

export default DetailAlbum;