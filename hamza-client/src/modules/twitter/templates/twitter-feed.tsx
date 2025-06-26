'use client';

import { Tweet } from '@/modules/twitter/types';
import Image from 'next/image';
import Link from 'next/link';
import TwitterX from '@/modules/common/icons/twitter-x';
import { useQuery } from '@tanstack/react-query';

const TweetCard = ({ tweet }: { tweet: Tweet }) => {
    return (
        <div className="flex-shrink-0 w-80 bg-[#E8E8E8] rounded-2xl p-4 text-black font-inter">
            <div className="flex justify-between items-start">
                <div className="flex items-start">
                    <Image
                        src={tweet.author.profile_image_url}
                        alt={tweet.author.name}
                        width={48}
                        height={48}
                        className="rounded-full"
                    />
                    <div className="ml-3">
                        <p className="font-bold">{tweet.author.name}</p>
                        <p className="text-sm text-gray-500">
                            @{tweet.author.username}
                        </p>
                    </div>
                </div>
                <Link
                    href={`https://twitter.com/${tweet.author.username}/status/${tweet.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <TwitterX />
                </Link>
            </div>
            <div className="mt-4">
                <p className="text-sm">
                    {tweet.text.split(' ').map((word, index) =>
                        word.startsWith('@') || word.startsWith('#') ? (
                            <Link
                                key={index}
                                href={`https://twitter.com/${
                                    word.startsWith('@')
                                        ? word.substring(1)
                                        : `hashtag/${word.substring(1)}`
                                }`}
                                className="text-purple-600"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {word}{' '}
                            </Link>
                        ) : (
                            word + ' '
                        )
                    )}
                </p>
            </div>
        </div>
    );
};

const TwitterFeed = () => {
    const {
        data: tweets,
        isLoading,
        error,
    } = useQuery<Tweet[] | null>({
        queryKey: ['twitter-mentions'],
        queryFn: async () => {
            const response = await fetch('/api/twitter');

            if (!response.ok) {
                // When the API fails, we can use the fallback logic.
                // For now, just throwing an error is fine.
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            if (!data.data || !data.includes || !data.includes.users) {
                return [];
            }

            const users = data.includes.users;
            return data.data.reduce((acc: Tweet[], tweet: any) => {
                const author = users.find(
                    (user: any) => user.id === tweet.author_id
                );
                if (author) {
                    acc.push({
                        id: tweet.id,
                        text: tweet.text,
                        author: {
                            name: author.name,
                            username: author.username,
                            profile_image_url: author.profile_image_url.replace(
                                '_normal',
                                ''
                            ),
                        },
                    });
                }
                return acc;
            }, []);
        },
        staleTime: 60 * 60 * 1000, // 1 hour
        refetchOnWindowFocus: false,
    });

    if (isLoading) {
        // You can return a loading skeleton here if you want
        return null;
    }

    if (error) {
        // You can return an error message here
        return null;
    }

    if (!tweets || tweets.length === 0) {
        return null;
    }

    return (
        <div className="py-12">
            <div
                className="container mx-auto"
                style={{
                    maxWidth: '1230px',
                }}
            >
                <h2 className="text-3xl font-bold mb-8 text-white">
                    Trusted Worldwide
                </h2>
                <div className="relative">
                    <div className="flex space-x-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-[#020202] [&::-webkit-scrollbar-thumb]:bg-[#6b7280] [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#9ca3af]">
                        {tweets.map((tweet) => (
                            <TweetCard key={tweet.id} tweet={tweet} />
                        ))}
                    </div>
                    <div className="absolute top-0 right-0 h-full w-16 bg-gradient-to-l from-[#2C272D] to-transparent pointer-events-none" />
                    <div className="absolute top-0 left-0 h-full w-16 bg-gradient-to-r from-[#2C272D] to-transparent pointer-events-none" />
                </div>
            </div>
        </div>
    );
};

export default TwitterFeed;
