<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */

	/* 全局样式 */
	page {
		background-color: #f8f9fa;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
	}

	/* 主题色 */
	:root {
		--primary-color: #4a6cf7;
		--primary-light: #e8edff;
		--success-color: #10b981;
		--danger-color: #ef4444;
		--warning-color: #f59e0b;
		--text-primary: #1f2937;
		--text-secondary: #6b7280;
		--text-light: #9ca3af;
		--border-color: #e5e7eb;
		--card-bg: #ffffff;
		--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
		--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
		--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
	}

	/* 通用卡片样式 */
	.card {
		background-color: var(--card-bg);
		border-radius: 16rpx;
		box-shadow: var(--shadow-sm);
		padding: 30rpx;
		margin-bottom: 25rpx;
	}

	/* 通用按钮样式 */
	.btn {
		padding: 20rpx 40rpx;
		border-radius: 12rpx;
		font-size: 28rpx;
		font-weight: 500;
		transition: all 0.2s;
	}

	.btn-primary {
		background-color: var(--primary-color);
		color: #ffffff;
	}

	.btn-primary:active {
		opacity: 0.9;
		transform: scale(0.98);
	}

	/* 通用输入框样式 */
	.input {
		padding: 20rpx;
		border: 2rpx solid var(--border-color);
		border-radius: 12rpx;
		font-size: 28rpx;
		background-color: #ffffff;
	}

	.input:focus {
		border-color: var(--primary-color);
		outline: none;
	}

	/* 通用标签样式 */
	.label {
		font-size: 26rpx;
		color: var(--text-secondary);
		margin-bottom: 10rpx;
	}

	/* 通用标题样式 */
	.title {
		font-size: 32rpx;
		font-weight: 600;
		color: var(--text-primary);
		margin-bottom: 20rpx;
	}

	/* 通用副标题样式 */
	.subtitle {
		font-size: 28rpx;
		color: var(--text-secondary);
		margin-bottom: 15rpx;
	}

	/* 通用金额样式 */
	.amount {
		font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
		font-weight: 600;
	}

	.amount.income {
		color: var(--success-color);
	}

	.amount.expense {
		color: var(--danger-color);
	}

	/* 通用分割线 */
	.divider {
		height: 2rpx;
		background-color: var(--border-color);
		margin: 20rpx 0;
	}

	/* 通用动画 */
	.fade-enter-active,
	.fade-leave-active {
		transition: opacity 0.3s ease;
	}

	.fade-enter-from,
	.fade-leave-to {
		opacity: 0;
	}

	/* 通用滚动条样式 */
	::-webkit-scrollbar {
		width: 6rpx;
		height: 6rpx;
	}

	::-webkit-scrollbar-track {
		background: #f1f1f1;
		border-radius: 3rpx;
	}

	::-webkit-scrollbar-thumb {
		background: #c1c1c1;
		border-radius: 3rpx;
	}

	::-webkit-scrollbar-thumb:hover {
		background: #a8a8a8;
	}
</style>
