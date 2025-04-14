<template>
	<view class="container">
		<!-- 余额卡片 -->
		<view class="balance-card">
			<view class="balance-title">当前余额</view>
			<view class="balance-amount">¥{{balance}}</view>
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
	</view>
</template>

<script>
import { getRecords, saveRecords, calculateMonthlyStats } from '@/utils/storage.js'

export default {
	data() {
		return {
			balance: 0,
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
		getRecords() {
			this.records = getRecords()
			this.monthlyStats = calculateMonthlyStats()
			this.calculateBalance()
		},
		// 计算余额
		calculateBalance() {
			const initialBalance = 10000 // 初始余额
			this.balance = initialBalance + this.monthlyStats.income - this.monthlyStats.expense
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
		}
	},
	onLoad() {
		this.getRecords()
	},
	onShow() {
		this.getRecords()
	}
}
</script>

<style>
	.container {
		padding: 20rpx;
	}

	.balance-card {
		background: linear-gradient(135deg, #4CAF50, #45a049);
		padding: 30rpx;
		border-radius: 20rpx;
		color: #fff;
		margin-bottom: 20rpx;
	}

	.balance-title {
		font-size: 28rpx;
		margin-bottom: 10rpx;
	}

	.balance-amount {
		font-size: 48rpx;
		font-weight: bold;
	}

	.statistics {
		display: flex;
		justify-content: space-between;
		margin-bottom: 20rpx;
	}

	.stat-item {
		background: #fff;
		padding: 20rpx;
		border-radius: 10rpx;
		flex: 1;
		margin: 0 10rpx;
	}

	.stat-label {
		font-size: 24rpx;
		color: #666;
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
		background: #fff;
		border-radius: 10rpx;
		padding: 20rpx;
	}

	.list-title {
		font-size: 28rpx;
		font-weight: bold;
		margin-bottom: 20rpx;
	}

	.record-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx;
		background-color: #fff;
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

	.delete-btn {
		width: 60rpx;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		background-color: #ff4d4f;
		color: #fff;
		font-size: 40rpx;
	}
</style>
