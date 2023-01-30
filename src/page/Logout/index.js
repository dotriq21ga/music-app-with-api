import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { userLogout } from "../../redux/reducer";

function Logout() {

    const tokenString = sessionStorage.getItem('token');
    const token = JSON.parse(tokenString);
    const dispatch = useDispatch();

    useEffect(() => {
        if (token) {
            dispatch(userLogout(token))
        }
    }, [dispatch, token])

}

export default Logout;