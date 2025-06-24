import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // 允许开发环境下的跨域请求
  allowedDevOrigins: [
    '192.168.31.189',
    '*.local',
    'localhost'
  ],
};

export default nextConfig;
