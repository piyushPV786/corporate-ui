/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/corporate',
  trailingSlash: true,
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  swcMinify: true,
  experimental: {
    esmExternals: false,
    typedRoutes: true
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/enrolment',
        basePath: false,
        permanent: false
      }
    ]
  },
  webpack: config => {
    config.cache = {
      type: 'filesystem'
    }
    config.resolve.alias = {
      ...config.resolve.alias
    }
    // config.optimization.splitChunks = {
    //   chunks: 'all',
    //   minSize: 20000,
    //   maxSize: 70000
    // }

    // Add this block to fix the issue with watchOptions
    if (config.watchOptions) {
      config.watchOptions.ignored = config.watchOptions.ignored || []
    }

    return config
  },
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL
  }
}

module.exports = nextConfig
