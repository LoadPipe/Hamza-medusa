<Text
textAlign={'center'}
maxW={'746px'}
fontSize={{ base: '14px', md: '16px' }}
>
Please verify your account by clicking the link sent to your
email, or by logging in with your Google, X (formerly Twitter),
or Discord account. This will ensure full access to your account
and features. If you didn’t receive the email, check your spam
folder or resend the link.
</Text>

<Flex
w={'100%'}
maxW={'468px'}
flexDir={'column'}
mt="0.5rem"
gap="1rem"
>
{/* Input Email Address */}
<Input
    name="email"
    placeholder="Your email address"
    value={email}
    type="email"
    width={'100%'}
    borderColor={'#555555'}
    backgroundColor={'black'}
    borderRadius={'12px'}
    height={'50px'}
    _placeholder={{ color: '#555555' }}
    onChange={(e) => {
        setEmail(e.target.value.toLowerCase());
    }}
/>

<Flex
    flexDir={'row'}
    my={{ base: '0px', md: '0.5rem' }}
    alignItems={'center'}
>
    <Divider />
    <Text mx="1rem">OR</Text>
    <Divider />
</Flex>

{/* Google Auth */}
<a href={getGoogleOAuthURL(authParams)}>
    <Button
        leftIcon={<IoLogoGoogle size={24} />}
        borderWidth={'1px'}
        borderColor={'#555555'}
        borderRadius={'12px'}
        backgroundColor={'black'}
        color={'white'}
        height={'56px'}
        width={'100%'}
        justifyContent={'center'}
    >
        <Flex maxW={'157px'} width={'100%'}>
            <Text mr="auto"> Verify with Google</Text>
        </Flex>
    </Button>
</a>

{/* Twitter Auth */}
<a href={getTwitterOauthUrl(authParams)}>
    <Button
        leftIcon={<FaXTwitter size={24} />}
        borderWidth={'1px'}
        borderColor={'#555555'}
        borderRadius={'12px'}
        backgroundColor={'black'}
        color={'white'}
        height={'56px'}
        width={'100%'}
        justifyContent={'center'}
    >
        <Flex maxW={'157px'} width={'100%'}>
            <Text mr="auto">Verify with X</Text>
        </Flex>
    </Button>
</a>

{/* Discord Auth */}
<a
    href={`https://discord.com/oauth2/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_DISCORD_ACCESS_KEY}&scope=identify+email&state=123456&redirect_uri=${process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URL}&prompt=consent`}
>
    <Button
        leftIcon={<BsDiscord size={24} color="white" />}
        borderWidth={'1px'}
        borderColor={'#555555'}
        borderRadius={'12px'}
        backgroundColor={'black'}
        color={'white'}
        height={'56px'}
        width={'100%'}
    >
        <Flex maxW={'157px'} width={'100%'}>
            <Text mr="auto"> Verify with Discord</Text>
        </Flex>
    </Button>
</a>
</Flex>
<Button
isLoading={loading}
onClick={() => {
    console.log('Button Clicked!');
    emailVerificationHandler();
}}
mt="auto"
borderRadius={'full'}
backgroundColor={'primary.green.900'}
height={'44px'}
maxW={'468px'}
width={'100%'}
>
Verify Account
</Button>