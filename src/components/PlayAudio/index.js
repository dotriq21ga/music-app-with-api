import styles from './PlayAudio.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faPause, faPlay, faRepeat, faShuffle, faSpinner, faStepBackward, faStepForward, faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import Button from '../Button';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { off, on, PauseMusic, PlayMusic, selectData } from '../../redux/reducer';

const cx = classNames.bind(styles)

function PlayAudio() {
    const dispatch = useDispatch()
    const data = useSelector(selectData);
    const localJson = localStorage.getItem('songs')
    const [song, setSong] = useState()

    const audioRadio = useRef();
    const [loop, setloop] = useState(false)
    const [random, setRandom] = useState(false)
    const [seekValue, setSeekValue] = useState(0);

    useEffect(() => {
        if (localJson) {
            const arrayLocal = JSON.parse(localJson).length;
            setSong(JSON.parse(localJson)[arrayLocal - 1])
        }
    }, [localJson])

    useEffect(() => {
        if (data.data.currentSong.song) {
            if (audioRadio.current) {
                if (data.data.currentSong.isPlay) {
                    audioRadio.current.play();
                }
                else {
                    audioRadio.current.pause();
                }
            }
        }
        else{
            setSeekValue(0)
        }
    }, [data.data.currentSong.song, data.data.currentSong.isPlay, audioRadio])

    const updateTimeAudio = () => {
        setSeekValue(
            (audioRadio.current.currentTime / audioRadio.current.duration) * 100
        );
    }

    const handleValue = (e) => {
        const seekto = audioRadio.current.duration * (+e.target.value / 100);
        audioRadio.current.currentTime = seekto;
        setSeekValue(parseFloat(e.target.value));
    }

    const listShow = () => data.data.currentSong.playerQueue ? dispatch(off()) : dispatch(on())

    if (song) {
        return (
            <>
                <div className={cx('round')}>
                    <div className={cx('box')}>
                        <img src={'http://localhost:8000/storage/images/' + song.image} alt='' />
                        <div className={cx('contains')}>
                            <div>{song.name}</div>
                            <div className={cx('text')}>{song.artist}</div>
                        </div>
                    </div>
                    <div className={cx('box-icon')}>
                        <div className={cx('container-icon')}>
                            <Button onClick={() => { random ? setRandom(false) : setRandom(true) }}>
                                <FontAwesomeIcon icon={faShuffle} />
                            </Button>

                            <Button>
                                <FontAwesomeIcon icon={faStepBackward} />
                            </Button>

                            <Button onClick={() => {
                                data.data.currentSong.isPlay ?
                                    dispatch(PauseMusic()) : dispatch(PlayMusic())
                            }}>
                                {data.data.currentSong.loading === 'loading' ?
                                    <FontAwesomeIcon icon={faSpinner} /> :
                                    data.data.currentSong.isPlay ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />}
                            </Button>

                            <Button>
                                <FontAwesomeIcon icon={faStepForward} />
                            </Button>

                            <Button onClick={() => { loop ? setloop(false) : setloop(true) }}>
                                <FontAwesomeIcon icon={faRepeat} />
                            </Button>
                        </div>

                        <input type="range" onChange={handleValue} max={100} min={0} value={seekValue} step={1} />

                        {
                            data.data.currentSong.song ?
                                <audio ref={audioRadio} id={cx('audio')}
                                    /* src={`http://localhost:8000/storage/audios/${data.data.currentSong.song.audio}`} */
                                    src={'https://vnso-zn-23-tf-mp3-s1-zmp3.zmdcdn.me/b95546185d58b406ed49/7656162748835414493?authen=exp=1673937458~acl=/b95546185d58b406ed49/*~hmac=10d9cb811736032e0fad69a5d4d50d40&fs=MTY3MzmUsIC2NDY1ODA3MXx3ZWJWNnwxMDY0MjIyNDk0fDEyMy4xNy4yMTkdUngMTgz'}
                                    onTimeUpdate={updateTimeAudio}
                                /> :
                                <Fragment />
                        }

                    </div>
                    <div className={cx('container-icon-right')}>
                        <Button btnRight>
                            <FontAwesomeIcon icon={faVolumeUp} />
                        </Button>
                        <Button btnRight onClick={listShow}>
                            <FontAwesomeIcon icon={faList} />
                        </Button>
                    </div>
                </div>
                <div className={cx('container')}></div>
            </>
        );
    }
}

export default PlayAudio;