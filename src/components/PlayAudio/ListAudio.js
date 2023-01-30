import styles from './PlayAudio.module.scss';
import classNames from 'classnames/bind';
import Button from '../Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetMusic, selectData, song } from '../../redux/reducer';
const cx = classNames.bind(styles)

function ListAudio() {
    const localHistory = JSON.parse(localStorage.getItem('songs'))
    const localQueue = JSON.parse(localStorage.getItem('list'))
    const [active, setActive] = useState(true)
    const data = useSelector(selectData);
    const history = useRef([])
    const dispatch = useDispatch()

    const listening = JSON.parse(localStorage.getItem('listen'))
    const queue = JSON.parse(localStorage.getItem('queue'))

    useEffect(() => {
        if (data.data.currentSong.playerQueue) {
            const idQueue = document.getElementById('queue');
            const idHistory = document.getElementById('history');
            active ? idQueue.style.backgroundColor = 'red' : idHistory.style.backgroundColor = 'red'
            return () => active ? idQueue.style.backgroundColor = '#000000' : idHistory.style.backgroundColor = '#000000'
        }
    }, [active, data.data.currentSong.playerQueue])

    useEffect(() => {
        const fake = [...localHistory]
        let array = []
        let j = fake.length - 2
        for (let i = 0; i < fake.length - 1; i++) {
            if (j >= 0) {
                array[i] = fake[j]
                j--
            }
        }
        history.current = array
    }, [localHistory])

    const playSongHistory = (music) => {
        let ref = [...localHistory]
        dispatch(song(music.id))
        setActive(true)

        let array = []
        let j = 0

        for (let i = 0; i < localQueue.length; i++) {
            array[j] = localQueue[i]
            j++
            if (music.id === localQueue[i].id) {
                localStorage.setItem('listen', JSON.stringify(array))
                array = []
                j = 0
            }
            else {
                if (j === localQueue.length) {
                    const listenFake = [...listening]

                    for (let index = 0; index < listenFake.length; index++) {
                        if (music.id === listenFake[index].id) {
                            delete listenFake[index]
                            for (let k = index; k < listenFake.length; k++) {
                                listenFake[k] = listenFake[k + 1]
                            }
                            listenFake[listenFake.length - 1] = music
                            localStorage.setItem('listen', JSON.stringify(listenFake))
                        }
                        else {
                            if (index === listenFake.length - 1) {
                                localStorage.setItem('listen', JSON.stringify(listening.concat(music)))
                            }
                        }
                    }
                    localStorage.setItem('list', JSON.stringify(listening.concat(music).concat(queue)))
                    array = queue

                }
            }
        }

        localStorage.setItem('queue', JSON.stringify(array))

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

    const deleteQueue = () => {
        dispatch(resetMusic())
    }

    const showQueue = () => {
        setActive(true)
    }

    const showHistory = () => {
        setActive(false)
    }

    if (data.data.currentSong.playerQueue && listening && queue) {
        return (
            <>
                <div className={cx('wrapper')}>
                    <div className={cx('header')}>
                        <Button btnQueue queue id={'queue'} onClick={showQueue}>
                            Queue
                        </Button>
                        <Button btnQueue history id={'history'} onClick={showHistory}>
                            History
                        </Button>
                        <Button btnQueue option onClick={deleteQueue}>
                            <FontAwesomeIcon icon={faEllipsis} />
                        </Button>
                    </div>

                    <div className={cx('box-contains')}>
                        {
                            active ?
                                <>
                                    {
                                        listening.map((data) => {
                                            return (
                                                <Button key={data.id} cardRow onClick={() => playSongHistory(data)}>
                                                    <img src={'http://localhost:8000/storage/images/' + data.image} alt='' />
                                                    <div className={cx('card-list')}>
                                                        <div>{data.name}</div>
                                                        <div className={cx('text')}>{data.artist}</div>
                                                    </div>
                                                </Button>
                                            )
                                        })
                                    }
                                    <h3 className={cx('title')}>Tiếp theo</h3>
                                    {
                                        queue.map((data) => {
                                            return (
                                                <Button key={data.id} cardRow onClick={() => playSongHistory(data)}>
                                                    <img src={'http://localhost:8000/storage/images/' + data.image} alt='' />
                                                    <div className={cx('card-list')}>
                                                        <div>{data.name}</div>
                                                        <div className={cx('text')}>{data.artist}</div>
                                                    </div>
                                                </Button>
                                            )
                                        })
                                    }
                                </>
                                :
                                history.current.map((data) => {
                                    return (
                                        <Button key={data.id} cardRow onClick={() => playSongHistory(data)}>
                                            <>
                                                <img src={'http://localhost:8000/storage/images/' + data.image} alt='' />
                                                <div className={cx('card-list')}>
                                                    <div>{data.name}</div>
                                                    <div className={cx('text')}>{data.artist}</div>
                                                </div>
                                            </>
                                        </Button>
                                    )
                                })
                        }
                    </div>
                </div>
            </>
        )
    }
}

export default ListAudio;