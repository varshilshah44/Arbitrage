import { useEffect } from "react";
import { Navigate, Route } from "react-router-dom";
import Home from "../pages/Home"
import Login from "../pages/Login"
import Master from "../pages/Master";

const PublicRoute = ({ component: Component, title }) => {
    const isLogin = localStorage.getItem("accessToken") || false;

    useEffect(() => {
        document.title = title;
    }, [title]);

    return !isLogin ? <>
    <Component />
    </> :  <Navigate to="/login" />
}

const PrivateRoute = ({ component: Component, title }) => {
    const isLogin = localStorage.getItem("accessToken") || false;
    return isLogin ? <Master ptitle={title}>
        <Component />
    </Master> : <Navigate to="/login" />
}


const routes = () => {
    return [
        {
            path: "home",
            exact: true,
            auth: true,
            element: <PrivateRoute title="Arbitrage Bot" component={Home} />
        },
        {
            path: "login",
            exact: true,
            auth: false,
            element: <Login title="Arbitrage Bot - Login" />
        },
    ]
}

export default routes