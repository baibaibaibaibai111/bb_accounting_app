<template>
	<view class="settings">
		<view class="header">
			<text class="title">设置</text>
		</view>
		
		<view class="section">
			<view class="section-title">数据管理</view>
			<view class="item" @click="clearData">
				<text class="item-label">清除所有数据</text>
				<text class="item-value danger">清除</text>
			</view>
		</view>
		
		<view class="section">
			<view class="section-title">关于</view>
			<view class="item">
				<text class="item-label">版本</text>
				<text class="item-value">1.0.0</text>
			</view>
		</view>
	</view>
</template>

<script>
import { clearAllData } from '@/utils/storage.js'

export default {
	data() {
		return {}
	},
	methods: {
		clearData() {
			uni.showModal({
				title: '警告',
				content: '确定要清除所有数据吗？此操作不可恢复！',
				success: (res) => {
					if (res.confirm) {
						const success = clearAllData()
						if (success) {
							uni.showToast({
								title: '数据已清除',
								icon: 'success'
							})
							// 清除后跳转到首页
							setTimeout(() => {
								uni.reLaunch({
									url: '/pages/index/index'
								})
							}, 1500)
						} else {
							uni.showToast({
								title: '清除失败',
								icon: 'error'
							})
						}
					}
				}
			})
		}
	}
}
</script>

<style>
.settings {
	padding: 20rpx;
}

.header {
	padding: 20rpx 0;
}

.title {
	font-size: 36rpx;
	font-weight: bold;
}

.section {
	margin-top: 30rpx;
	background-color: #fff;
	border-radius: 12rpx;
	padding: 20rpx;
}

.section-title {
	font-size: 28rpx;
	color: #999;
	margin-bottom: 20rpx;
}

.item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #eee;
}

.item:last-child {
	border-bottom: none;
}

.item-label {
	font-size: 32rpx;
	color: #333;
}

.item-value {
	font-size: 32rpx;
	color: #666;
}

.danger {
	color: #ff4d4f;
}
</style> 