'use client';

import { useFormState } from 'react-dom';
import { LOGIN_VIEW } from '@modules/account/templates/login-template';
import { signUp } from '@modules/account/actions';

type Props = {
    setCurrentView: (view: LOGIN_VIEW) => void;
};

const Register = ({ setCurrentView }: Props) => {
    const [message, formAction] = useFormState(signUp, null);

    return <div>Connect your wallet to sign in</div>;
};

export default Register;
