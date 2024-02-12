import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

const cracoConfig = {
    style: {
        postcss: {
            plugins: [tailwindcss, autoprefixer],
        },
    },
};

export default cracoConfig;
