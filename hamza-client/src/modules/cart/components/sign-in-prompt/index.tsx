import { Button, Heading, Text } from '@medusajs/ui';
import LocalizedClientLink from '@modules/common/components/localized-client-link';

const SignInPrompt = () => {
    return (
        // <div className="flex items-center justify-between bg-black">
        //     <div>
        //         <Heading level="h2" className="txt-xlarge text-white">
        //             Already have an account?
        //         </Heading>
        //         <Text className="txt-medium text-ui-fg-subtle text-white">
        //             Sign in for a better experience.
        //         </Text>
        //     </div>
        //     <div>
        //         <LocalizedClientLink href="/cart">
        //             <Button variant="secondary" className="h-10">
        //                 Sign in
        //             </Button>
        //         </LocalizedClientLink>
        //     </div>
        // </div>
        <div>Connect your wallet to sign in</div>
    );
};

export default SignInPrompt;
