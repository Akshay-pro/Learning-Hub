/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
            },
            {
                protocol: "http", // Allow HTTP as well
                hostname: "res.cloudinary.com",
            },
        ],
    },
};

export default nextConfig;
