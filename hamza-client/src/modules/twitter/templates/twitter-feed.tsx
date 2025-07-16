'use client';

import { Tweet } from '@/modules/twitter/types';
import Image from 'next/image';
import Link from 'next/link';
import TwitterX from '@/modules/common/icons/twitter-x';
import { useQuery } from '@tanstack/react-query';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';

const TweetCard = ({ tweet }: { tweet: Tweet }) => {
    return (
        <div className="flex-shrink-0 w-80 bg-[#E8E8E8] rounded-2xl p-4 text-black font-inter mr-4">
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
                                href={`https://twitter.com/${word.startsWith('@')
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
    const [isPaused, setIsPaused] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState(0);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [animationOffset, setAnimationOffset] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const animationRef = useRef<number>();
    const lastUpdateTime = useRef<number>(0);

    const {
        data: tweets,
        isLoading,
        error,
    } = useQuery<Tweet[] | null>({
        queryKey: ['twitter-mentions'],
        queryFn: async () => {
            const response = await fetch('/api/twitter');

            if (!response.ok) {
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

    const cardWidth = useMemo(() => 320 + 16, []); // 320px card + 16px margin
    const totalWidth = useMemo(() => {
        return tweets ? tweets.length * cardWidth : 0;
    }, [tweets, cardWidth]);

    useEffect(() => {
        if (!isPaused && !isDragging && tweets && tweets.length > 0) {
            const animate = (currentTime: number) => {
                if (currentTime - lastUpdateTime.current > 33) {
                    setAnimationOffset(prev => {
                        const newOffset = (prev + 1) % totalWidth;
                        return newOffset;
                    });
                    lastUpdateTime.current = currentTime;
                }
                animationRef.current = requestAnimationFrame(animate);
            };
            animationRef.current = requestAnimationFrame(animate);
        }

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isPaused, isDragging, tweets, totalWidth]);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        setIsDragging(true);
        setDragStart(e.clientX);
        e.preventDefault();
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!isDragging) return;
        const diff = e.clientX - dragStart;
        setScrollPosition(diff);
    }, [isDragging, dragStart]);

    const handleMouseUp = useCallback(() => {
        if (!isDragging) return;
        setIsDragging(false);

        // Commit the dragged distance to the animation offset
        setAnimationOffset(prev => {
            const newOffset = (prev - scrollPosition) % totalWidth;
            return newOffset < 0 ? newOffset + totalWidth : newOffset;
        });
        setScrollPosition(0);
    }, [isDragging, scrollPosition, totalWidth]);

    const handleMouseLeave = useCallback(() => {
        if (isDragging) {
            // Commit the dragged distance if we were dragging
            setAnimationOffset(prev => {
                const newOffset = (prev - scrollPosition) % totalWidth;
                return newOffset < 0 ? newOffset + totalWidth : newOffset;
            });
        }
        setIsDragging(false);
        setScrollPosition(0);
        setIsPaused(false);
    }, [isDragging, scrollPosition, totalWidth]);

    // Touch events for mobile
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        setIsDragging(true);
        setDragStart(e.touches[0].clientX);
        e.preventDefault();
    }, []);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        if (!isDragging) return;
        const diff = e.touches[0].clientX - dragStart;
        setScrollPosition(diff);
    }, [isDragging, dragStart]);

    const handleTouchEnd = useCallback(() => {
        if (!isDragging) return;

        // Commit the dragged distance to the animation offset
        setAnimationOffset(prev => {
            const newOffset = (prev - scrollPosition) % totalWidth;
            return newOffset < 0 ? newOffset + totalWidth : newOffset;
        });
        setIsDragging(false);
        setScrollPosition(0);
    }, [isDragging, scrollPosition, totalWidth]);

    // Memoize duplicated tweets to avoid recalculating
    const duplicatedTweets = useMemo(() => {
        if (!tweets) return [];
        return [...tweets, ...tweets, ...tweets];
    }, [tweets]);

    if (isLoading || error || !tweets || tweets.length === 0) {
        return null;
    }

    const totalTranslate = -animationOffset + scrollPosition;

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
                <div className="relative overflow-hidden">
                    <div
                        ref={containerRef}
                        className={`flex cursor-grab ${isDragging ? 'cursor-grabbing' : ''} transition-none`}
                        style={{
                            transform: `translateX(${totalTranslate}px)`,
                            willChange: 'transform',
                        }}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseLeave}
                        onMouseEnter={() => setIsPaused(true)}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        {duplicatedTweets.map((tweet, index) => (
                            <TweetCard key={`${tweet.id}-${index}`} tweet={tweet} />
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