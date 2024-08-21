import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';  // Ensure this path is correct

const useUser = () => {
    const { user, fetchUser, isAuthenticated, logout, setUser } = useContext(AuthContext);
    return { user, fetchUser, isAuthenticated, logout, setUser };
};

export default useUser;
