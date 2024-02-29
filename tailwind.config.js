/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}', './node_modules/flowbite/**/*.js'],
    theme: {
        extend: {
            colors: {
                iron: '#1f1f22',
                charcoal: '#101016',
                inputText: '#7D7D89',
                lilac: '#462e8a',
                glow: '#00A8EC',
                lime: '#bada55',
                blue: '#083749',
                orange: '#f2651d',
                failure: '#e56962',
                success: '#0bc144',
            },
            fontFamily: {
                display: ['Bebas Neue'],
            },
            fontSize: {
                xxs: '.5rem',
            },
            boxShadow: {
                focus: [
                    '0 1px 1px rgba(0, 0, 0, 0.075) inset',
                    '0 0 8px rgba(82, 168, 236, 0.6)',
                ],
            },
            keyframes: {
                'fade-in-down': {
                    from: {
                        opacity: '0',
                        transform: 'translateY(-10px)',
                    },
                    to: {
                        opacity: '1',
                        transform: 'translateY(0)',
                    },
                },
                'fade-out-up': {
                    from: {
                        opacity: '1',
                        transform: 'translateY(0px)',
                    },
                    to: {
                        opacity: '0',
                        transform: 'translateY(-10px)',
                    },
                },
                'backdrop-fade-in': {
                    from: { opacity: '0' },
                    to: { opacity: '.9' },
                },
                'backdrop-fade-out': {
                    from: { opacity: '.9' },
                    to: { opacity: '0' },
                },
                'bounce-left-right': {
                    '0%': { left: '0' },
                    '50%': { left: '10px' },
                    '100%': { left: '0' },
                },
            },
            animation: {
                'fade-in-down': 'fade-in-down 0.5s ease-out forwards',
                'fade-out-up': 'fade-out-up 0.5s ease-out forwards',
                'backdrop-fade-in': 'backdrop-fade-in .5s ease-out forwards',
                'backdrop-fade-out': 'backdrop-fade-out .5s ease-out forwards',
                'bounce-left-right':
                    'bounce-left-right 3s ease-in-out infinite',
            },
        },
    },
    plugins: [require('flowbite/plugin')],
};
