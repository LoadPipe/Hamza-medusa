import { useFormState } from 'react-dom';

import { LOGIN_VIEW } from '@modules/account/templates/login-template';
import Input from '@modules/common/components/input';
import { logCustomerIn } from '@modules/account/actions';
import ErrorMessage from '@modules/checkout/components/error-message';
import { SubmitButton } from '@modules/checkout/components/submit-button';

type Props = {
    setCurrentView: (view: LOGIN_VIEW) => void;
};

const Login = ({ setCurrentView }: Props) => {
    const [message, formAction] = useFormState(logCustomerIn, undefined);

    return (
        <div className="max-w-sm w-full flex flex-col items-center">
            <h1 className="text-large-semi uppercase mb-6">Welcome back</h1>
            <p className="text-center text-base-regular text-ui-fg-base mb-8">
                Connect your wallet to sign in.
            </p>
        </div>
    );
};

export default Login;
