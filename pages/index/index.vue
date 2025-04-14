<template>
	<view class="container">
		<!-- 余额卡片 -->
		<view class="balance-card">
			<view class="balance-title">当前余额</view>
			<view class="balance-amount">¥{{balance.total}}</view>
			<view class="balance-detail">
				<view class="balance-item">
					<text class="label">支付宝</text>
					<text class="amount">¥{{balance.alipay}}</text>
				</view>
				<view class="balance-item">
					<text class="label">微信</text>
					<text class="amount">¥{{balance.wechat}}</text>
				</view>
			</view>
			<view class="balance-edit" @click="showBalanceEdit">编辑余额</view>
		</view>
		
		<!-- 收支统计 -->
		<view class="statistics">
			<view class="stat-item">
				<text class="stat-label">本月收入</text>
				<text class="stat-value income">+¥{{monthlyStats.income}}</text>
			</view>
			<view class="stat-item">
				<text class="stat-label">本月支出</text>
				<text class="stat-value expense">-¥{{monthlyStats.expense}}</text>
			</view>
		</view>
		
		<!-- 收支记录列表 -->
		<view class="record-list">
			<view class="list-title">收支记录</view>
			<uni-swipe-action>
				<uni-swipe-action-item v-for="(item, index) in records" :key="index" :right-options="options" @click="deleteRecord(item, index)">
					<view class="record-item">
						<view class="record-left">
							<text class="record-category">{{item.category}}</text>
							<text class="record-date">{{item.date}}</text>
						</view>
						<view class="record-right">
							<text :class="['record-amount', item.type === 'income' ? 'income' : 'expense']">
								{{item.type === 'income' ? '+' : '-'}}¥{{item.amount}}
							</text>
						</view>
					</view>
				</uni-swipe-action-item>
			</uni-swipe-action>
		</view>
		
		<uni-popup ref="balancePopup" type="center">
			<view class="balance-edit-popup">
				<view class="popup-title">编辑余额</view>
				<view class="form-item">
					<text class="label">支付宝余额</text>
					<input type="number" v-model="editBalance.alipay" placeholder="请输入支付宝余额" />
				</view>
				<view class="form-item">
					<text class="label">微信余额</text>
					<input type="number" v-model="editBalance.wechat" placeholder="请输入微信余额" />
				</view>
				<view class="popup-buttons">
					<button class="cancel-btn" @click="cancelEdit">取消</button>
					<button class="confirm-btn" @click="saveBalance">保存</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import { getRecords, saveRecords, calculateMonthlyStats, getBalance, saveBalance } from '@/utils/storage.js'

export default {
	data() {
		return {
			balance: {
				total: 0,
				alipay: 0,
				wechat: 0
			},
			editBalance: {
				alipay: 0,
				wechat: 0
			},
			monthlyStats: {
				income: 0,
				expense: 0
			},
			records: [],
			options: [{
				text: '删除',
				style: {
					backgroundColor: '#ff4d4f'
				}
			}]
		}
	},
	methods: {
		// 获取收支记录
		loadRecords() {
			this.records = getRecords()
			this.monthlyStats = calculateMonthlyStats()
			this.loadBalance()
		},
		// 计算余额
		loadBalance() {
			const balance = getBalance()
			this.balance = balance
			// 计算包含收支记录的总余额
			const alipayBalance = Number(balance.alipay)
			const wechatBalance = Number(balance.wechat)
			const income = Number(this.monthlyStats.income)
			const expense = Number(this.monthlyStats.expense)
			this.balance.total = alipayBalance + wechatBalance + income - expense
		},
		deleteRecord(record, index) {
			uni.showModal({
				title: '确认删除',
				content: `确定要删除这条${record.type === 'income' ? '收入' : '支出'}记录吗？`,
				success: (res) => {
					if (res.confirm) {
						this.records.splice(index, 1)
						saveRecords(this.records)
						this.monthlyStats = calculateMonthlyStats()
						uni.showToast({
							title: '删除成功',
							icon: 'success'
						})
					}
				}
			})
		},
		showBalanceEdit() {
			this.editBalance = { ...this.balance }
			this.$refs.balancePopup.open()
		},
		cancelEdit() {
			this.$refs.balancePopup.close()
		},
		saveBalance() {
			const success = saveBalance(this.editBalance)
			if (success) {
				this.loadBalance()
				this.$refs.balancePopup.close()
				uni.showToast({
					title: '保存成功',
					icon: 'success'
				})
			} else {
				uni.showToast({
					title: '保存失败',
					icon: 'error'
				})
			}
		}
	},
	onLoad() {
		this.loadRecords()
	},
	onShow() {
		this.loadRecords()
	}
}
</script>

<style>
	.container {
		padding: 20rpx;
	}

	.balance-card {
		background-color: #fff;
		border-radius: 12rpx;
		padding: 30rpx;
		margin-bottom: 20rpx;
	}

	.balance-title {
		font-size: 28rpx;
		color: #999;
		margin-bottom: 20rpx;
	}

	.balance-amount {
		font-size: 48rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 30rpx;
	}

	.balance-detail {
		display: flex;
		justify-content: space-between;
	}

	.balance-item {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.balance-item .label {
		font-size: 24rpx;
		color: #999;
		margin-bottom: 10rpx;
	}

	.balance-item .amount {
		font-size: 32rpx;
		color: #333;
	}

	.balance-edit {
		text-align: right;
		color: #3cc51f;
		font-size: 24rpx;
		margin-top: 20rpx;
	}

	.statistics {
		display: flex;
		justify-content: space-between;
		background-color: #fff;
		border-radius: 12rpx;
		padding: 30rpx;
		margin-bottom: 20rpx;
	}

	.stat-item {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.stat-label {
		font-size: 24rpx;
		color: #999;
		margin-bottom: 10rpx;
	}

	.stat-value {
		font-size: 32rpx;
		font-weight: bold;
	}

	.income {
		color: #4CAF50;
	}

	.expense {
		color: #f44336;
	}

	.record-list {
		background-color: #fff;
		border-radius: 12rpx;
		padding: 30rpx;
	}

	.list-title {
		font-size: 28rpx;
		color: #999;
		margin-bottom: 20rpx;
	}

	.record-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx;
		border-bottom: 1rpx solid #eee;
	}

	.record-left {
		display: flex;
		flex-direction: column;
	}

	.record-category {
		font-size: 28rpx;
		font-weight: bold;
	}

	.record-date {
		font-size: 24rpx;
		color: #999;
	}

	.record-amount {
		font-size: 32rpx;
		font-weight: bold;
	}

	.balance-edit-popup {
		background-color: #fff;
		border-radius: 12rpx;
		padding: 30rpx;
		width: 600rpx;
	}

	.popup-title {
		font-size: 32rpx;
		font-weight: bold;
		text-align: center;
		margin-bottom: 30rpx;
	}

	.form-item {
		margin-bottom: 20rpx;
	}

	.form-item .label {
		font-size: 28rpx;
		color: #333;
		margin-bottom: 10rpx;
		display: block;
	}

	.form-item input {
		width: 100%;
		height: 80rpx;
		border: 1rpx solid #eee;
		border-radius: 8rpx;
		padding: 0 20rpx;
		font-size: 28rpx;
	}

	.popup-buttons {
		display: flex;
		justify-content: space-between;
		margin-top: 30rpx;
	}

	.popup-buttons button {
		width: 45%;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		border-radius: 8rpx;
		font-size: 28rpx;
	}

	.cancel-btn {
		background-color: #f5f5f5;
		color: #666;
	}

	.confirm-btn {
		background-color: #3cc51f;
		color: #fff;
	}
</style>
