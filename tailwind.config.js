module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                iron: '#1f1f22',
                charcoal: '#101016',
                inputText: '#7D7D89',
                lilac: '#506385',
                glow: '#00A8EC',
                bad: '#bada55',
            },
            fontFamily: {
                display: ['Bebas Neue'],
            },
            boxShadow: {
                focus: [
                    '0 1px 1px rgba(0, 0, 0, 0.075) inset',
                    '0 0 8px rgba(82, 168, 236, 0.6)',
                ],
            },
        },
    },
    plugins: [],
};
