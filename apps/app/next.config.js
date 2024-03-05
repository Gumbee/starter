const path = require('path');
const TauriResolver = require('./webpack/TauriResolver');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.NEXT_PUBLIC_TAURI === `true` ? 'export' : 'export',
  reactStrictMode: true,
  transpilePackages: ['@forge/*'],
  experimental: {
    optimizePackageImports: ['@phosphor-icons/react'],
  },
  webpack: (config, { isServer }) => {
    // dynamically rewrite some .tauri and .web imports to reduce bundle size
    config.resolve.plugins.push(new TauriResolver());

    // don't cache because when switching between dev:web and dev:desktop
    // cached files will be used and the wrong components get rendered (TauriResolver dynamically overrides component import paths
    // depending on the environment)
    config.cache = false;

    return config;
  },
};

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = process.env.NODE_ENV === 'development' ? withBundleAnalyzer(nextConfig) : nextConfig;
