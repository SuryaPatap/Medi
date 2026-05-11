/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/index.html"
    ],
    theme: {
        extend: {
            colors: {
                primary: "#2563EB", // Medical Blue
                secondary: "#F3F3F5", // Background
                success: "#10B981", // Teal/Green
                warning: "#FBBF24", // Alerts
                danger: "#D4183D", // Critical
                neutral: {
                    light: "#E9EBEF",
                    DEFAULT: "#ECECF0",
                    dark: "#717182"
                }
            },
            fontFamily: {
                sans: ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
            },
            borderRadius: {
                DEFAULT: "0.5rem", // 8px as per design
                md: "0.5rem",
                lg: "0.75rem",
                xl: "1rem"
            }
        },
    },
    plugins: [],
}
