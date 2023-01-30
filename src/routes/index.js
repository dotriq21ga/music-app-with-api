import Home from "../page/Home";
import Login from "../page/AccountForm/Login/index"
import Register from "../page/AccountForm/Register";
import Logout from "../page/Logout";
import DetailAlbum from "../page/Detail";

const publicRoutes = [
    { path: '/login', component: Login },
    { path: '/', component: Home },
    { path: '/register', component: Register },
    { path: '/album/:id', component: DetailAlbum }
]

const privateRoutes = [
    { path: '/logout', component: Logout }
]

export { publicRoutes, privateRoutes }