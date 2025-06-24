import { NextRequest, NextResponse } from 'next/server';
import { Tweet } from '@/modules/twitter/types';

export async function GET(req: NextRequest) {
    const bearerToken = process.env.TWITTER_BEARER_TOKEN;

    if (!bearerToken) {
        return NextResponse.json(
            { error: 'TWITTER_BEARER_TOKEN is not set' },
            { status: 500 }
        );
    }

    try {
        const response = await fetch(
            'https://api.twitter.com/2/users/50258765/mentions?max_results=10&expansions=author_id&user.fields=profile_image_url,username,name',
            {
                headers: {
                    Authorization: `Bearer ${bearerToken}`,
                },
            }
        );

        let data;

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Error fetching tweets from Twitter API:', errorData);
            data = {
                data: [
                    {
                        id: '1936042718297497884',
                        edit_history_tweet_ids: ['1936042718297497884'],
                        text: 'See you guys!! @hamzadecom1 @9CATGROUP \nThe Alt Season is soon?! https://t.co/speigyF1e7',
                        author_id: '1730378088419414016',
                    },
                    {
                        id: '1934206571795333386',
                        edit_history_tweet_ids: ['1934206571795333386'],
                        text: '@hamzadecom1 transaction costs are legit killing adoption rn... smart to tackle that bottleneck 🚀',
                        author_id: '3074388191',
                    },
                    {
                        id: '1933805155775828247',
                        edit_history_tweet_ids: ['1933805155775828247'],
                        text: '@annedotHNS @hamzadecom1 $MYRO \n\nI can only update this so many times before it fully plays out. Targets off screen . Way off screen. Like $FLOKI &amp; $DOGE shown below from previous cycles\n#buy #hold #crypto',
                        author_id: '1845500412838752260',
                    },
                    {
                        id: '1933799742800376252',
                        edit_history_tweet_ids: ['1933799742800376252'],
                        text: "@annedotHNS @hamzadecom1 Let's keep rocking it",
                        author_id: '16166740',
                    },
                    {
                        id: '1933798552095817954',
                        edit_history_tweet_ids: ['1933798552095817954'],
                        text: "If you believe in decentralization like I do—&amp; you're running or starting an #ecomm biz—why not accept #crypto &amp; stablecoins? ⛵\n\nI'd love to onboard you to https://t.co/XwHX0acXBE (no platform fee!)\n\nDM me or @hamzadecom1 to start. #decom https://t.co/kpgE78HUYe",
                        author_id: '2315333474',
                    },
                    {
                        id: '1933326414369206500',
                        edit_history_tweet_ids: ['1933326414369206500'],
                        text: '🔥 The BIGGЕST #Сryрtо #РUMР Telegram channel is here! \n\n 🚀 Jоin the actiоn! ➡️ https://t.co/V5BCoi9xWa $ETH \n\n@BallersCultureX @AAANJE555 @TkdfQsKJrUi5nJ9 @MollieM51221995 @hamzadecom1 @Martin10218326 @thefruit016 @umairsuzozai447 @lexayxdd @failsicon q8tWGk',
                        author_id: '1933218547972382721',
                    },
                    {
                        id: '1930220399498846620',
                        edit_history_tweet_ids: ['1930220399498846620'],
                        text: '@hamzadecom1 sounds like a fantastic merge of innovation. 💡',
                        author_id: '2379624572',
                    },
                    {
                        id: '1930053376848605321',
                        edit_history_tweet_ids: ['1930053376848605321'],
                        text: "🚨 💎 You're one of the selected! Grab your chance for rewards!\n\n🌀 Visit link: https://t.co/adF02NzYOd\n\n🫂 Participants:\n@Johancityx\n\n@BlakeTourdner\n\n@UncleOldFax\n\n@hamzadecom1\n\n@IDevourNehari\n\n@palmwinepappi__\n4XATS P8FOE",
                        author_id: '1920273201285693440',
                    },
                    {
                        id: '1929861872549052629',
                        edit_history_tweet_ids: ['1929861872549052629'],
                        text: '@hamzadecom1 Loving these',
                        author_id: '16166740',
                    },
                    {
                        id: '1928588379345600779',
                        edit_history_tweet_ids: ['1928588379345600779'],
                        text: '🚨 YOU IN RANDOM LIST: Tesla cryptocurrency giveaway!\n\n1️⃣ See more: https://t.co/PAYC6wkSKf\n\n👥 Invited users: \n@h7705290433309\n\n@Shehrozkha93481\n\n@MolgeriaMo\n\n@skledelegator\n\n@jean28258\n\n@hamzadecom1\nEXV2A',
                        author_id: '1917934546684682240',
                    },
                ],
                includes: {
                    users: [
                        {
                            id: '1730378088419414016',
                            username: 'Donat3Live',
                            profile_image_url:
                                'https://pbs.twimg.com/profile_images/1730379048017383424/FqYi64df_normal.jpg',
                            name: 'Donat3.live',
                        },
                        {
                            id: '3074388191',
                            username: 'PsyTrading',
                            profile_image_url:
                                'https://pbs.twimg.com/profile_images/1923819934213144576/LLr9msaC_normal.jpg',
                            name: 'PsyTrading',
                        },
                        {
                            id: '1845500412838752260',
                            username: 'ItsMalik046',
                            profile_image_url:
                                'https://pbs.twimg.com/profile_images/1861295591885602816/8qa4XcMx_normal.jpg',
                            name: 'minall malik',
                        },
                        {
                            id: '16166740',
                            username: 'michelini',
                            profile_image_url:
                                'https://pbs.twimg.com/profile_images/1621045456804659201/B4VgIB1l_normal.jpg',
                            name: 'Michael.Michelini/',
                        },
                        {
                            id: '2315333474',
                            username: 'annedotHNS',
                            profile_image_url:
                                'https://pbs.twimg.com/profile_images/1642089683181260802/wMYjlR-V_normal.jpg',
                            name: 'anne/🤝',
                        },
                        {
                            id: '1933218547972382721',
                            username: 'Kurukitis175896',
                            profile_image_url:
                                'https://pbs.twimg.com/profile_images/1933219384006201345/G1BT8GTJ_normal.png',
                            name: 'Kurukitis',
                        },
                        {
                            id: '2379624572',
                            username: 'BlockchainEdu',
                            profile_image_url:
                                'https://pbs.twimg.com/profile_images/1805769748635869184/gueKkCk6_normal.jpg',
                            name: 'BEN',
                        },
                        {
                            id: '1920273201285693440',
                            username: 'baldwin_cog',
                            profile_image_url:
                                'https://pbs.twimg.com/profile_images/1930048783838261248/AjaDhpJz_normal.png',
                            name: '𝐓𝐞𝐬𝐥𝐚 Notification',
                        },
                        {
                            id: '1917934546684682240',
                            username: 'TranterAllk',
                            profile_image_url:
                                'https://pbs.twimg.com/profile_images/1923445222790324224/Po0lAr-__normal.jpg',
                            name: 'Allison Tranter',
                        },
                    ],
                },
                meta: {
                    result_count: 10,
                    newest_id: '1936042718297497884',
                    oldest_id: '1928588379345600779',
                    next_token: '7140dibdnow9c7btw4e0hvw122ahn741vs82sv47vy1ix',
                },
            };
        } else {
            data = await response.json();
        }
        return NextResponse.json(data);
    } catch (error) {
        console.error('Failed to fetch tweets', error);
        return NextResponse.json(
            { error: 'Failed to fetch tweets' },
            { status: 500 }
        );
    }
}
