import { Navigate } from "react-router-dom";
import Home from "../pages/Home"
import Login from "../pages/Login"
import History from "../pages/History"
import Master from "../pages/Master";
import Currency from "../pages/Currency";

// const PublicRoute = ({ component: Component, title }) => {
//     const isLogin = localStorage.getItem("accessToken") || false;

//     useEffect(() => {
//         document.title = title;
//     }, [title]);

//     return !isLogin ? <>
//     <Component />
//     </> :  <Navigate to="/login" />
// }

const PrivateRoute = ({ component: Component, title }) => {
    const isLogin = localStorage.getItem("accessToken") || false;
    return isLogin ? <Master ptitle={title}>
        <Component />
    </Master> : <Navigate to="/login" />
}


const routes = () => {
    return [
        {
            path: "home/:id/:currency",
            exact: true,
            auth: true,
            element: <PrivateRoute title="Arbitrage Bot" component={Home} />
        },
        {
            path: "history",
            exact: true,
            auth: true,
            element: <History title="Arbitrage Bot - History" />
        },
        {
            path: "login",
            exact: true,
            auth: false,
            element: <Login title="Arbitrage Bot - Login" />
        },
        {
            path: "currency-table",
            exact: true,
            auth: false,
            element: <Currency title="Arbitrage Bot - Currency" />
        },
    ]
}

export default routes