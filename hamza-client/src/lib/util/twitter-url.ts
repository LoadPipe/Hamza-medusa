function getTwitterOauthUrl(querystring?: string) {
    const rootUrl = 'https://twitter.com/i/oauth2/authorize';
    const options = {
        redirect_uri: process.env.NEXT_PUBLIC_TWITTER_OAUTH_REDIRECT_URL!, // client url cannot be http://localhost:3000/ or http://127.0.0.1:3000/
        client_id: process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID!,
        state: 'state',
        response_type: 'code',
        code_challenge: 'y_SfRG4BmOES02uqWeIkIgLQAlTBggyf_G7uKT51ku8',
        code_challenge_method: 'S256',
        scope: [
            'users.read',
            'tweet.read',
            'follows.read',
            'follows.write',
        ].join(' '),
    };

    const qs = new URLSearchParams(options).toString();

    let url = `${rootUrl}?${qs.toString()}`;
    if (querystring) url += `&${querystring}`;
    return url;
}

export default getTwitterOauthUrl;
