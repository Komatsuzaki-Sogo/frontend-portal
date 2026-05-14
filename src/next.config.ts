import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export', // 静的HTMLとして書き出す設定
  trailingSlash: true, // /category/ のようにスラッシュを付ける（静的ホスティングで推奨）
  sassOptions: {
    silenceDeprecations: ['import'], // これで「@import は古い」という警告を消す
  },
};

export default nextConfig;
