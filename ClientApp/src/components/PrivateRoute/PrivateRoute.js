import { Outlet, Navigate } from "react-router-dom";

const useAuth = () => {
    const token = sessionStorage.getItem('token') === null ? false : true
    return token;
}

const PrivateRoute = () => {
    const isAuth = useAuth();
    return isAuth ? <Outlet /> : <Navigate to="/" />;
}

export default PrivateRoute;