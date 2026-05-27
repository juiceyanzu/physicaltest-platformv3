<template>
  <div class="wechat-login-container">
    <a-divider>
      <span class="divider-text">其他登录方式</span>
    </a-divider>
    
    <div class="wechat-login-btn" @click="showWechatModal">
      <div class="wechat-icon">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z"/>
        </svg>
      </div>
      <span class="wechat-text">微信扫码登录</span>
    </div>

    <a-modal
      :open="modalVisible"
      title="微信扫码登录"
      :footer="null"
      :width="400"
      @cancel="handleCancel"
      class="wechat-modal"
    >
      <div class="qrcode-container">
        <div v-if="scanStatus === 'waiting'" class="qrcode-wrapper">
          <img :src="qrCodeUrl" alt="微信扫码" class="qrcode-image" />
          <p class="qrcode-tip">请使用微信扫一扫登录</p>
        </div>
        
        <div v-else-if="scanStatus === 'scanned'" class="status-wrapper">
          <div class="status-icon scanned">
            <check-circle-outlined />
          </div>
          <p class="status-text">扫码成功</p>
          <p class="status-subtext">请在手机上确认登录</p>
        </div>
        
        <div v-else-if="scanStatus === 'success'" class="status-wrapper">
          <div class="status-icon success">
            <check-circle-filled />
          </div>
          <p class="status-text">授权成功</p>
          <p class="status-subtext">正在登录...</p>
        </div>
        
        <div v-else-if="scanStatus === 'failed'" class="status-wrapper">
          <div class="status-icon failed">
            <close-circle-filled />
          </div>
          <p class="status-text">授权失败</p>
          <p class="status-subtext">请重新扫码</p>
          <a-button type="primary" @click="resetScan" class="retry-btn">
            重新扫码
          </a-button>
        </div>
        
        <div v-else-if="scanStatus === 'timeout'" class="status-wrapper">
          <div class="status-icon timeout">
            <clock-circle-outlined />
          </div>
          <p class="status-text">二维码已过期</p>
          <p class="status-subtext">请重新获取</p>
          <a-button type="primary" @click="resetScan" class="retry-btn">
            刷新二维码
          </a-button>
        </div>
      </div>
      
      <div class="wechat-login-tips">
        <p>提示：首次使用微信登录需要绑定账号</p>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { message } from 'ant-design-vue'
import {
  CheckCircleOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  ClockCircleOutlined
} from '@ant-design/icons-vue'
import {
  generateQRCodeDataUrl,
  checkScanStatus,
  findAccountByWechat,
  bindWechatToAccount,
  logWechatLogin,
  type ScanStatus
} from '@/utils/wechatLogin'

interface Props {
  role: 'student' | 'teacher' | 'admin'
  onSuccess: (userInfo: any) => void
}

const props = defineProps<Props>()

const modalVisible = ref(false)
const scanStatus = ref<ScanStatus>('waiting')
const qrCodeUrl = ref('')
const scanId = ref('')
const userInfo = ref<any>(null)
let scanTimer: NodeJS.Timeout | null = null
let timeoutTimer: NodeJS.Timeout | null = null

const showWechatModal = () => {
  modalVisible.value = true
  startScan()
}

const startScan = () => {
  scanStatus.value = 'waiting'
  scanId.value = `scan_${Date.now()}`
  qrCodeUrl.value = generateQRCodeDataUrl(scanId.value)
  
  logWechatLogin('scan_started', { scanId: scanId.value, role: props.role })
  
  timeoutTimer = setTimeout(() => {
    if (scanStatus.value === 'waiting') {
      scanStatus.value = 'timeout'
      logWechatLogin('scan_timeout', { scanId: scanId.value })
    }
  }, 300000)
  
  startPolling()
}

const startPolling = () => {
  scanTimer = setInterval(async () => {
    if (!modalVisible.value || scanStatus.value === 'success' || scanStatus.value === 'failed' || scanStatus.value === 'timeout') {
      return
    }
    
    try {
      const result = await checkScanStatus(scanId.value)
      scanStatus.value = result.status
      
      if (result.userInfo) {
        userInfo.value = result.userInfo
        logWechatLogin('scan_success', { scanId: scanId.value, openid: result.userInfo.openid })
        
        const accountResult = await findAccountByWechat(result.userInfo.openid, props.role)
        
        if (accountResult.success && accountResult.accountId) {
          message.success('登录成功')
          props.onSuccess({
            ...result.userInfo,
            accountId: accountResult.accountId,
            loginType: 'wechat'
          })
          setTimeout(() => {
            modalVisible.value = false
            resetScan()
          }, 1500)
        } else {
          message.info('首次登录，请先绑定账号')
          setTimeout(() => {
            resetScan()
          }, 2000)
        }
      }
    } catch (error) {
      logWechatLogin('scan_error', { scanId: scanId.value, error })
      scanStatus.value = 'failed'
    }
  }, 2000)
}

const handleCancel = () => {
  resetScan()
  modalVisible.value = false
}

const resetScan = () => {
  if (scanTimer) {
    clearInterval(scanTimer)
    scanTimer = null
  }
  if (timeoutTimer) {
    clearTimeout(timeoutTimer)
    timeoutTimer = null
  }
  scanStatus.value = 'waiting'
  userInfo.value = null
  startScan()
}

onUnmounted(() => {
  if (scanTimer) {
    clearInterval(scanTimer)
  }
  if (timeoutTimer) {
    clearTimeout(timeoutTimer)
  }
})
</script>

<style scoped>
.wechat-login-container {
  margin-top: 24px;
}

.divider-text {
  color: #8c8c8c;
  font-size: 14px;
}

.wechat-login-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.wechat-login-btn:hover {
  border-color: #07c160;
  background-color: #f6ffed;
}

.wechat-icon {
  width: 28px;
  height: 28px;
  color: #07c160;
}

.wechat-icon svg {
  width: 100%;
  height: 100%;
}

.wechat-text {
  font-size: 14px;
  color: #595959;
}

.wechat-login-btn:hover .wechat-text {
  color: #07c160;
}

.qrcode-container {
  text-align: center;
  padding: 20px 0;
}

.qrcode-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.qrcode-image {
  width: 200px;
  height: 200px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
}

.qrcode-tip {
  margin-top: 16px;
  font-size: 14px;
  color: #8c8c8c;
}

.status-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0;
}

.status-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.status-icon.scanned {
  color: #1890ff;
}

.status-icon.success {
  color: #07c160;
}

.status-icon.failed {
  color: #ff4d4f;
}

.status-icon.timeout {
  color: #faad14;
}

.status-text {
  font-size: 20px;
  font-weight: 500;
  color: #262626;
  margin-bottom: 8px;
}

.status-subtext {
  font-size: 14px;
  color: #8c8c8c;
}

.retry-btn {
  margin-top: 20px;
}

.wechat-login-tips {
  margin-top: 20px;
  padding: 12px;
  background: #fafafa;
  border-radius: 4px;
  text-align: center;
}

.wechat-login-tips p {
  margin: 0;
  font-size: 12px;
  color: #8c8c8c;
}

:deep(.wechat-modal .ant-modal-header) {
  text-align: center;
}

:deep(.wechat-modal .ant-modal-title) {
  font-size: 18px;
  font-weight: 500;
}
</style>
