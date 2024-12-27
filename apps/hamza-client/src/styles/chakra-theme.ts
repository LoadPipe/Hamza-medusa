'use client';
import { extendTheme } from '@chakra-ui/react';
import { Sora } from 'next/font/google';

const sora = Sora({ weight: ['400', '600', '700'], subsets: ['latin'] });

const colors = {
    primary: {
        indigo: {
            900: '#7B61FF', // darkest
            800: '#8C7AFF',
            700: '#9D93FF',
            600: '#AEACFF',
            500: '#BFC5FF', // midpoint
            400: '#D0DEFF',
            300: '#E1F7FF',
            200: '#F2F9FF',
            100: '#F9FBFF',
            50: '#FFFFFF', // lightest
        },
        green: {
            900: '#94D42A', // darkest
            800: '#A0DA4A',
            700: '#ACDF69',
            600: '#B8E589',
            500: '#C4EBA9', // midpoint
            400: '#D0F1C9',
            300: '#DCF7E9',
            200: '#E8FDF9',
            100: '#F4FEF4',
            50: '#FFFFFF', // lightest
        },
        yellow: {
            900: '#FABE06', // darkest
            800: '#FBCC2C',
            700: '#FCD852',
            600: '#FDE378',
            500: '#FDEF9E', // midpoint
            400: '#FEFAC4',
            300: '#FEFCEA',
            200: '#FFFEF5',
            100: '#FFFFFA',
            50: '#FFFFFF', // lightest
        },
        baltic: {
            900: '#2C272D', // darkest
            800: '#443D44',
            700: '#5D545A',
            600: '#756A71',
            500: '#8E8188', // midpoint
            //400: '#A6979F',
            300: '#BFADB6',
            400: '#D7C4CD',
            200: '#F0DAE4',
            100: '#F9EFF2',
            50: '#FFF4F7', // lightest
        },
        moss: {
            900: '#020202', // darkest
            800: '#1A1A1A',
            700: '#333333',
            600: '#4D4D4D',
            500: '#666666', // midpoint
            400: '#808080',
            300: '#999999',
            200: '#B3B3B3',
            100: '#CCCCCC',
            50: '#E6E6E6', // lightest
        },
    },
    secondary: {
        onyx: {
            900: '#121212', // darkest
            800: '#262626',
            700: '#3A3A3A',
            600: '#4E4E4E',
            500: '#626262', // midpoint
            400: '#767676',
            300: '#8A8A8A',
            200: '#9E9E9E',
            100: '#B3B3B3',
            50: '#C7C7C7', // lightest
        },
        davy: {
            900: '#555555', // darkest
            800: '#6A6A6A',
            700: '#7F7F7F',
            600: '#949494',
            500: '#A9A9A9', // midpoint
            400: '#BEBEBE',
            300: '#D3D3D3',
            200: '#E8E8E8',
            100: '#FDFDFD',
            50: '#FFFFFF', // lightest
        },
        charcoal: {
            900: '#3E3E3E', // darkest
            90: '#161B23', // Promotion Banner
            800: '#525252',
            700: '#666666',
            600: '#7A7A7A',
            500: '#8E8E8E', // midpoint
            400: '#A2A2A2',
            300: '#B6B6B6',
            200: '#CACACA',
            100: '#DEDEDE',
            50: '#F2F2F2', // lightest
        },
    },
    switchBackground: {
        500: '#4b5669', // switch background color
    },
};

const disabledStyles = {
    backgroundColor: 'gray.100',
    borderColor: 'gray.100',
    color: 'gray.500',
};

const theme = extendTheme({
    colors,
    fonts: {
        body: sora.style.fontFamily,
    },
    components: {
        Button: {
            variants: {
                _disabled: {
                    ...disabledStyles,
                },
                _hover: {
                    ...disabledStyles,
                },
            },
        },
        Heading: {
            sizes: {
                h1: {
                    fontSize: '2rem',
                },
                h2: {
                    fontSize: '1.5rem',
                },
                h3: {
                    fontSize: '1.125rem',
                },
                h4: {
                    fontSize: '1rem',
                },
                h5: { fontSize: '0.625rem' },
                h6: {
                    fontSize: '0.625rem',
                },
            },
            variant: {
                regular: {
                    fontWeight: 'normal', // 400
                },
                semibold: {
                    fontWeight: 'semibold', // 600
                },
                bold: {
                    fontWeight: 'bold', // 700
                },
            },
            defaultProps: {
                size: 'h2',
                variant: 'bold',
            },
        },
    },
});

export default theme;
