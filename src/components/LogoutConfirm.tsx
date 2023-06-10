import { useEffect } from "react";
import { useSignOut } from "react-auth-kit";

const LogoutConfirm = () => {
    const logout = useSignOut();
    useEffect(() => {
        logout();
    }, []);
    
    return (
        <>
        </>
    );
}

export default LogoutConfirm;