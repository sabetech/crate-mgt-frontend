import { useAuthHeader } from "react-auth-kit";

const LoanList: React.FC = () => {
    const authHeader = useAuthHeader();


    return (
        <div>
            Loan List
        </div>
    );
}

export default LoanList