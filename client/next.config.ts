import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
    reactStrictMode: true,
    webpack: (config) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            '@components': path.resolve(__dirname, './components'),
        };
        return config;
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    output: 'standalone',
};

export default nextConfig;
