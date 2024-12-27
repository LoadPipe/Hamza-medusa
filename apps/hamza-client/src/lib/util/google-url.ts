function getGoogleOAuthURL(querystring?: string) {
    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';

    const options = {
        redirect_uri:
            `${process.env.NEXT_PUBLIC_GOOGLE_OAUTH_REDIRECT_URL}` as string,
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
        access_type: 'offline',
        response_type: 'code',
        prompt: 'consent',
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
        ].join(' '),
    };

    const qs = new URLSearchParams(options);

    let url = `${rootUrl}?${qs.toString()}`;
    if (querystring) url += `&${querystring}`;
    return url;
}

export default getGoogleOAuthURL;
