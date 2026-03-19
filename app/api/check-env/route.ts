import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  // 检查所有可能的环境变量名（帮助调试）
  const envVars = {
    DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY ? "已设置" : "未设置",
    DEEPSEEK_API_KEY_LENGTH: process.env.DEEPSEEK_API_KEY?.length || 0,
    // 检查常见拼写错误
    DEEP_SEEK_API_KEY: process.env.DEEP_SEEK_API_KEY ? "已设置" : "未设置",
    Deepseek_API_KEY: process.env.Deepseek_API_KEY ? "已设置" : "未设置",
    deepseek_api_key: process.env.deepseek_api_key ? "已设置" : "未设置",
    // Node 环境
    NODE_ENV: process.env.NODE_ENV,
    // Vercel 环境
    VERCEL: process.env.VERCEL,
    VERCEL_ENV: process.env.VERCEL_ENV,
  };

  return NextResponse.json({
    message: "环境变量检查",
    envVars,
    allEnvKeys: Object.keys(process.env).filter(key => 
      key.toLowerCase().includes('deep') || 
      key.toLowerCase().includes('api') ||
      key.toLowerCase().includes('key')
    ),
  });
}
