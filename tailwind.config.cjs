/**** Tailwind CSS Config (manually created) ****/
module.exports = {
    content: [
        './src/**/*.{html,ts,scss}',
        './src/**/*.scss',
        './src/lib/**/*.{html,ts,scss}',
    ],
    safelist: [
        // dynamic theme utility colors or state classes used via bindings
        'bg-[var(--ds-bg-elevated)]', 'text-[var(--ds-color-text-primary)]',
        'hover:bg-[var(--ds-bg-subtle)]', 'focus:bg-[var(--ds-bg-subtle)]'
    ],
    theme: {
        extend: {},
    },
    plugins: [],
};
