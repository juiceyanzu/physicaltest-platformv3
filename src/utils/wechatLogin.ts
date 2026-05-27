import type { Student, Teacher, Admin } from '@/types'

const WECHAT_CONFIG = {
  appId: 'YOUR_WECHAT_APPID',
  appSecret: 'YOUR_WECHAT_APPSECRET',
  redirectUri: encodeURIComponent('http://localhost:5173/api/wechat/callback'),
  scope: 'snsapi_login',
  state: 'STATE'
}

export const generateWechatQRCodeUrl = (role: 'student' | 'teacher' | 'admin') => {
  const state = `${WECHAT_CONFIG.state}_${role}`
  return `https://open.weixin.qq.com/connect/qrconnect?appid=${WECHAT_CONFIG.appId}&redirect_uri=${WECHAT_CONFIG.redirectUri}&response_type=code&scope=${WECHAT_CONFIG.scope}&state=${state}#wechat_redirect`
}

export const getWechatUserInfo = async (code: string) => {
  await new Promise(resolve => setTimeout(resolve, 800))
  
  return {
    openid: `openid_${Date.now()}`,
    nickname: `微信用户${Math.floor(Math.random() * 10000)}`,
    sex: 1,
    language: 'zh_CN',
    city: '北京',
    province: '北京',
    country: '中国',
    headimgurl: 'https://thirdwx.qlogo.cn/mmopen/vi_32/placeholder/132'
  }
}

export type ScanStatus = 'waiting' | 'scanned' | 'success' | 'failed' | 'timeout'

export interface WechatLoginState {
  status: ScanStatus
  message: string
  userInfo?: {
    openid: string
    nickname: string
    headimgurl: string
  }
}

export const checkScanStatus = async (scanId: string): Promise<WechatLoginState> => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const random = Math.random()
  if (random < 0.3) {
    return {
      status: 'waiting',
      message: '请使用微信扫码'
    }
  } else if (random < 0.6) {
    return {
      status: 'scanned',
      message: '扫码成功，请在手机上确认'
    }
  } else {
    return {
      status: 'success',
      message: '授权成功',
      userInfo: {
        openid: `openid_${Date.now()}`,
        nickname: `微信用户${Math.floor(Math.random() * 10000)}`,
        headimgurl: 'https://thirdwx.qlogo.cn/mmopen/vi_32/placeholder/132'
      }
    }
  }
}

export const bindWechatToAccount = async (
  openid: string,
  role: 'student' | 'teacher' | 'admin',
  accountId: string
): Promise<{ success: boolean; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const wechatBindings = JSON.parse(localStorage.getItem('wechatBindings') || '{}')
  wechatBindings[openid] = { role, accountId, boundAt: new Date().toISOString() }
  localStorage.setItem('wechatBindings', JSON.stringify(wechatBindings))
  
  return { success: true, message: '微信账号绑定成功' }
}

export const findAccountByWechat = async (
  openid: string,
  role: 'student' | 'teacher' | 'admin'
): Promise<{ success: boolean; accountId?: string; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const wechatBindings = JSON.parse(localStorage.getItem('wechatBindings') || '{}')
  const binding = wechatBindings[openid]
  
  if (binding && binding.role === role) {
    return { success: true, accountId: binding.accountId, message: '找到绑定的账号' }
  }
  
  return { success: false, message: '未找到绑定的账号，请先绑定' }
}

export const generateQRCodeDataUrl = (scanId: string): string => {
  const canvas = document.createElement('canvas')
  canvas.width = 200
  canvas.height = 200
  const ctx = canvas.getContext('2d')
  
  if (ctx) {
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, 200, 200)
    ctx.fillStyle = '#000000'
    
    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 20; j++) {
        if (Math.random() > 0.5) {
          ctx.fillRect(i * 10, j * 10, 10, 10)
        }
      }
    }
    
    ctx.strokeStyle = '#07c160'
    ctx.lineWidth = 4
    ctx.strokeRect(10, 10, 180, 180)
  }
  
  return canvas.toDataURL('image/png')
}

export const logWechatLogin = (action: string, data?: any) => {
  const logs = JSON.parse(localStorage.getItem('wechatLoginLogs') || '[]')
  logs.push({
    action,
    data,
    timestamp: new Date().toISOString()
  })
  localStorage.setItem('wechatLoginLogs', JSON.stringify(logs.slice(-100)))
}
