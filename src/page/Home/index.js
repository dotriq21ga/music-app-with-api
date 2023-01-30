import { useEffect, useState } from "react";
import HomeContainer from "../../Container/Home";

async function getHome() {
    const data = await fetch('http://localhost:8000/api/home');
    return await data.json();
}

function Home() {
    const [home, setHome] = useState();

    useEffect(() => {
        let mounted = true;
        getHome()
            .then(datas => {
                if (mounted) {
                    setHome(datas)
                }
            })
        return () => mounted = false;
    }, [])

    if (home) {
        return (
            <HomeContainer data={home} />
        )
    }

}

export default Home;