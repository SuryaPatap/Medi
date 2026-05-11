module.exports = {
    style: {
        postcss: {
            plugins: [
                require('tailwindcss'),
                require('autoprefixer'),
            ],
        },
    },
    webpack: {
        configure: {
            resolve: {
                fallback: {
                    "http": false,
                    "https": false,
                    "url": false,
                    "zlib": false,
                    "stream": false,
                    "assert": false,
                    "util": false
                }
            }
        }
    }
}
