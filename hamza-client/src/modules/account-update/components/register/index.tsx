'use client';

import { useFormState } from 'react-dom';

import Input from '@modules/common/components/input';
import { LOGIN_VIEW } from '@modules/account/templates/login-template';
import { signUp } from '@modules/account/actions';
import ErrorMessage from '@modules/checkout/components/error-message';
import { SubmitButton } from '@modules/checkout/components/submit-button';
import LocalizedClientLink from '@modules/common/components/localized-client-link';

type Props = {
    setCurrentView: (view: LOGIN_VIEW) => void;
};

const Register = ({ setCurrentView }: Props) => {
    const [message, formAction] = useFormState(signUp, null);

    return <div>Connect your wallet to sign in</div>;
};

export default Register;
