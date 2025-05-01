import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthC } from './components/Auth/AuthProviderx';
import Loading from './components/HomePage/Loading';

const PrivateRoute = () => {
    const { user, loading } = useContext(AuthC);

    if (loading) {
        return <Loading></Loading>
    }

    return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;