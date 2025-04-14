<template>
	<view class="container">
		<!-- 月度预算设置 -->
		<view class="budget-section">
			<view class="section-title">月度预算设置</view>
			<view class="budget-form">
				<view class="form-group">
					<view class="form-title">预算金额</view>
					<input 
						type="digit" 
						v-model="monthlyBudget" 
						placeholder="请输入月度预算金额"
						class="budget-input"
					/>
				</view>
				<button class="save-btn" @click="saveBudget">保存预算</button>
			</view>
		</view>
		
		<!-- 预算使用情况 -->
		<view class="budget-section">
			<view class="section-title">预算使用情况</view>
			<view class="budget-progress">
				<view class="progress-info">
					<text class="progress-label">已使用</text>
					<text class="progress-value">{{budgetUsed}}/{{monthlyBudget}}</text>
				</view>
				<view class="progress-bar">
					<view 
						class="progress-inner" 
						:style="{ width: budgetPercentage + '%' }"
						:class="{ 'warning': budgetPercentage >= 80 }"
					></view>
				</view>
				<text class="progress-percentage">{{budgetPercentage}}%</text>
			</view>
			
			<!-- 分类预算使用情况 -->
			<view class="category-budget">
				<view class="category-item" v-for="(item, index) in categoryBudgets" :key="index">
					<view class="category-info">
						<text class="category-name">{{item.category}}</text>
						<text class="category-amount">{{item.used}}/{{item.budget}}</text>
					</view>
					<view class="category-progress">
						<view 
							class="progress-inner" 
							:style="{ width: item.percentage + '%' }"
							:class="{ 'warning': item.percentage >= 80 }"
						></view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { getBudget, saveBudget, calculateCategoryBudgets } from '@/utils/storage.js'

export default {
	data() {
		return {
			monthlyBudget: 0,
			budgetUsed: 0,
			categoryBudgets: []
		}
	},
	computed: {
		budgetPercentage() {
			return Math.round((this.budgetUsed / this.monthlyBudget) * 100)
		}
	},
	methods: {
		loadBudget() {
			const budget = getBudget()
			this.monthlyBudget = budget.monthly
			this.categoryBudgets = calculateCategoryBudgets()
			this.calculateBudgetUsed()
		},
		calculateBudgetUsed() {
			this.budgetUsed = this.categoryBudgets.reduce((total, item) => total + item.used, 0)
		},
		saveBudget() {
			if (!this.monthlyBudget) {
				uni.showToast({
					title: '请输入预算金额',
					icon: 'none'
				})
				return
			}
			
			saveBudget({
				monthly: this.monthlyBudget,
				categories: this.categoryBudgets.reduce((obj, item) => {
					obj[item.category] = item.budget
					return obj
				}, {})
			})
			
			uni.showToast({
				title: '保存成功',
				icon: 'success'
			})
		}
	},
	onLoad() {
		this.loadBudget()
	},
	onShow() {
		this.loadBudget()
	}
}
</script>

<style>
.container {
	padding: 20rpx;
}

.budget-section {
	margin-bottom: 40rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	margin-bottom: 20rpx;
}

.budget-form {
	background: #fff;
	padding: 20rpx;
	border-radius: 10rpx;
}

.form-group {
	margin-bottom: 20rpx;
}

.form-title {
	font-size: 28rpx;
	color: #666;
	margin-bottom: 10rpx;
}

.budget-input {
	background: #f5f5f5;
	padding: 20rpx;
	border-radius: 10rpx;
	font-size: 32rpx;
}

.save-btn {
	background: #4CAF50;
	color: #fff;
	margin-top: 20rpx;
}

.budget-progress {
	background: #fff;
	padding: 20rpx;
	border-radius: 10rpx;
}

.progress-info {
	display: flex;
	justify-content: space-between;
	margin-bottom: 10rpx;
}

.progress-label {
	font-size: 28rpx;
	color: #666;
}

.progress-value {
	font-size: 28rpx;
	font-weight: bold;
}

.progress-bar {
	height: 20rpx;
	background: #f5f5f5;
	border-radius: 10rpx;
	overflow: hidden;
	margin: 10rpx 0;
}

.progress-inner {
	height: 100%;
	background: #4CAF50;
	border-radius: 10rpx;
	transition: width 0.3s;
}

.progress-inner.warning {
	background: #f44336;
}

.progress-percentage {
	font-size: 24rpx;
	color: #999;
	text-align: right;
}

.category-budget {
	margin-top: 20rpx;
}

.category-item {
	margin-bottom: 20rpx;
}

.category-info {
	display: flex;
	justify-content: space-between;
	margin-bottom: 10rpx;
}

.category-name {
	font-size: 28rpx;
}

.category-amount {
	font-size: 28rpx;
	font-weight: bold;
}

.category-progress {
	height: 10rpx;
	background: #f5f5f5;
	border-radius: 5rpx;
	overflow: hidden;
}

.category-progress .progress-inner {
	height: 100%;
	background: #4CAF50;
	border-radius: 5rpx;
	transition: width 0.3s;
}

.category-progress .progress-inner.warning {
	background: #f44336;
}
</style> 