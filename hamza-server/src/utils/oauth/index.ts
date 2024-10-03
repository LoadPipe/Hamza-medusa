import { MedusaResponse } from "@medusajs/medusa";

export function redirectToOauthLandingPage(
    res: MedusaResponse,
    type: 'google' | 'discord' | 'twitter',
    verify: boolean = true,
    errorMessage?: string
): any {
    let redirectUrl =
        `${process.env.STORE_URL}${process.env.OAUTH_LANDING_PAGE}?type=${type}&verify=${verify ? 'true' : 'false'}`;

    if (errorMessage?.length)
        redirectUrl += `&error=true&message=${errorMessage}`;
    else if (!verify)
        redirectUrl += '&error=true';

    return res.redirect(redirectUrl);
}

