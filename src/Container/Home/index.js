import PlayList from '../../components/PlayList';
import Slider from '../../components/Slider';

function HomeContainer(data) {
    const slider = data.data.items[0];
    const artistTheme = data.data.items[1];
    const listenList = data.data.items[2];

    return (
        <>
            <Slider items={slider} />
            <PlayList items={artistTheme} />
            <PlayList items={listenList} />
        </>
    )
}

export default HomeContainer;