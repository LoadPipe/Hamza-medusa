import React from 'react';

type WishlistIconProps = { props?: any; fill: boolean };

const WishlistIcon = (props: WishlistIconProps) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1rem"
            height="1rem"
            viewBox="0 0 256 256"
            {...props.props}
        >
            {!props.fill ? (
                <path
                    fill="currentColor"
                    d="M128 220.2a13.6 13.6 0 0 1-9.9-4.1L35 133a58 58 0 0 1 2.2-84.2a56.5 56.5 0 0 1 41.6-14a62.8 62.8 0 0 1 40.3 18.3L128 62l11-11a57.9 57.9 0 0 1 84.1 2.2a56.2 56.2 0 0 1 14.1 41.6a62.8 62.8 0 0 1-18.3 40.3l-81 81a13.6 13.6 0 0 1-9.9 4.1Zm5.6-8.3ZM75 46.7a44 44 0 0 0-29.7 11.1a45.8 45.8 0 0 0-1.8 66.7l83.1 83.1a1.9 1.9 0 0 0 2.8 0l81-81c18.2-18.2 19.9-47.5 3.8-65.3a45.8 45.8 0 0 0-66.7-1.8l-15.3 15.2a6.1 6.1 0 0 1-8.5 0l-13.1-13.1A50.3 50.3 0 0 0 75 46.7Z"
                ></path>
            ) : (
                <path
                    fill="currentColor"
                    d="m220.3 136.5l-81 81a15.9 15.9 0 0 1-22.6 0l-83.1-83.1a59.9 59.9 0 0 1 2.3-87c23.3-21.1 61.3-19.1 84.6 4.3l7.5 7.4l9.6-9.5A60.4 60.4 0 0 1 181.5 32a59.8 59.8 0 0 1 43.1 19.9c21 23.3 19.1 61.3-4.3 84.6Z"
                ></path>
            )}
        </svg>
    );
};

export default WishlistIcon;
