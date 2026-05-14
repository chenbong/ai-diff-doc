export const SAMPLE_DOC_A = `# 用户管理系统 — 产品需求文档 (PRD)

## 1. 用户注册
- 支持手机号注册，验证码有效期 5 分钟
- 用户名长度 4-20 个字符，仅允许字母、数字、下划线
- 密码长度至少 8 位，必须包含大小写字母和数字
- 注册成功后自动登录并跳转到个人主页

## 2. 用户登录
- 支持手机号 + 密码登录
- 支持手机号 + 验证码登录
- 连续输错密码 5 次锁定账号 30 分钟
- 登录状态保持 7 天

## 3. 个人信息
- 用户可修改头像、昵称、个人简介
- 手机号修改需要验证新旧手机号
- 每次修改昵称间隔至少 30 天

## 4. 权限管理
- 普通用户：查看和编辑自己的信息
- 管理员：可查看所有用户信息，可禁用用户账号
- 超级管理员：可以管理管理员权限
- 删除用户需要二次确认，数据保留 90 天后彻底删除`;

export const SAMPLE_DOC_B = `# 用户管理系统 — 技术方案

## 1. 注册模块
- 使用 Redis 存储验证码，TTL 设为 10 分钟
- 用户名规则：3-16 个字符，支持中文、字母、数字
- 密码使用 bcrypt 加密，最低 6 位
- 注册后返回 token，前端跳转到首页

## 2. 登录模块
- JWT Token 认证，有效期 24 小时
- 密码错误 3 次后需要图形验证码，5 次锁定 15 分钟
- 仅支持账号密码登录，验证码登录排到二期

## 3. 个人信息模块
- 头像上传至 OSS，限制 2MB
- 昵称修改无频率限制
- 手机号换绑只需验证新手机号

## 4. 权限设计
- RBAC 模型：user / admin 两种角色
- 管理员可以删除用户，删除后数据立即清除
- 无超级管理员角色，管理员权限通过数据库直接授予`;

export const SEVERITY_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  critical: { bg: 'bg-red-50', border: 'border-red-500', text: 'text-red-700' },
  warning: { bg: 'bg-amber-50', border: 'border-amber-500', text: 'text-amber-700' },
  info: { bg: 'bg-blue-50', border: 'border-blue-500', text: 'text-blue-700' },
};

export const ISSUE_TYPE_LABELS: Record<string, string> = {
  CONTRADICTION: '矛盾',
  OMISSION: '遗漏',
  INCONSISTENCY: '不一致',
  AMBIGUITY: '模糊',
};
