/** @type {import('next').NextConfig} */
const nextConfig = () => {
  const isDev = process.env.NODE_ENV === 'development';

  return {
    output: 'export',
    basePath: isDev ? '' : '/gitlab-confetti',
  };
};

export default nextConfig;
