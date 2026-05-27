<script>
export default {
  onLaunch: function () {
    console.log('App Launch')
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  }
}
</script>

<style>
page {
  background-color: #f5f5f5;
  font-size: 28rpx;
  color: #333;
}

.container {
  min-height: 100vh;
  padding: 20rpx;
}

.btn-primary {
  background-color: #1890ff;
  color: white;
  border-radius: 8rpx;
  padding: 24rpx 32rpx;
  font-size: 28rpx;
}

.btn-success {
  background-color: #52c41a;
  color: white;
  border-radius: 8rpx;
  padding: 24rpx 32rpx;
  font-size: 28rpx;
}

.btn-danger {
  background-color: #ff4d4f;
  color: white;
  border-radius: 8rpx;
  padding: 24rpx 32rpx;
  font-size: 28rpx;
}

.card {
  background-color: white;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
}

.form-item {
  margin-bottom: 32rpx;
}

.form-label {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 16rpx;
  display: block;
}

.form-input {
  width: 100%;
  height: 80rpx;
  border: 1rpx solid #d9d9d9;
  border-radius: 8rpx;
  padding: 0 24rpx;
  font-size: 28rpx;
  background-color: white;
}

.text-primary {
  color: #1890ff;
}

.text-success {
  color: #52c41a;
}

.text-danger {
  color: #ff4d4f;
}

.text-warning {
  color: #faad14;
}

.text-muted {
  color: #999;
}

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

.mt-20 {
  margin-top: 20rpx;
}

.mb-20 {
  margin-bottom: 20rpx;
}

.p-20 {
  padding: 20rpx;
}

.flex {
  display: flex;
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.flex-column {
  display: flex;
  flex-direction: column;
}
</style>