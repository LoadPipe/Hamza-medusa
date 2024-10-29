import { MedusaResponse } from '@medusajs/medusa';

export function redirectToOauthLandingPage(
    res: MedusaResponse,
    type: 'google' | 'discord' | 'twitter',
    verify: boolean = true,
    errorMessage?: string
): any {
    let redirectUrl = `http://localhost:8000/account/verify?type=${type}&verify=${verify ? 'true' : 'false'}`;

    if (errorMessage?.length) redirectUrl += `&message=${errorMessage}`;

    return res.redirect(redirectUrl);
}
