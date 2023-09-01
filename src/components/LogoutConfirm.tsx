import { useEffect } from "react";
import { useSignOut } from "react-auth-kit";
import { useNavigate } from "react-router-dom";

const LogoutConfirm = () => {
    const logout = useSignOut();
    const navigate = useNavigate();
    useEffect(() => {
        logout();
        navigate("/")
    }, []);
    
    return (
        <>
        </>
    );
}

export default LogoutConfirm;