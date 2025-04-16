<template>
	<view class="container">
		<view class="form-group">
			<view class="form-title">记录类型</view>
			<view class="type-selector">
				<view 
					class="type-item" 
					:class="{ active: type === 'income' }"
					@click="type = 'income'"
				>
					收入
				</view>
				<view 
					class="type-item" 
					:class="{ active: type === 'expense' }"
					@click="type = 'expense'"
				>
					支出
				</view>
			</view>
		</view>
		
		<view class="form-group">
			<view class="form-title">金额</view>
			<input 
				type="digit" 
				v-model="amount" 
				placeholder="请输入金额"
				class="amount-input"
			/>
		</view>
		
		<view class="form-group">
			<view class="form-title">分类</view>
			<picker 
				:range="categories" 
				:value="categoryIndex"
				@change="onCategoryChange"
			>
				<view class="picker">
					{{categories[categoryIndex]}}
				</view>
			</picker>
		</view>
		
		<view class="form-group">
			<view class="form-title">日期</view>
			<picker 
				mode="date" 
				:value="date"
				@change="onDateChange"
			>
				<view class="picker">
					{{date}}
				</view>
			</picker>
		</view>
		
		<button class="submit-btn" @click="submitRecord">保存</button>
	</view>
</template>

<script>
import { getCategories, saveCategories, getRecords, saveRecords } from '@/utils/storage.js'

export default {
	data() {
		return {
			type: 'expense',
			amount: '',
			categoryIndex: 0,
			categories: [],
			date: this.getCurrentDate()
		}
	},
	methods: {
		getCurrentDate() {
			const date = new Date()
			return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
		},
		onCategoryChange(e) {
			this.categoryIndex = e.detail.value
		},
		onDateChange(e) {
			this.date = e.detail.value
		},
		submitRecord() {
			if (!this.amount || !this.categories[this.categoryIndex] || !this.date) {
				uni.showToast({
					title: '请填写完整信息',
					icon: 'none'
				})
				return
			}
			
			const record = {
				id: Date.now(),
				type: this.type,
				amount: parseFloat(this.amount),
				category: this.categories[this.categoryIndex],
				date: this.date
			}
			
			console.log('新记录：', record)
			
			const records = getRecords()
			console.log('现有记录：', records)
			
			records.unshift(record)
			console.log('更新后的记录：', records)
			
			const success = saveRecords(records)
			console.log('保存结果：', success)
			
			if (success) {
				uni.showToast({
					title: '保存成功',
					icon: 'success'
				})
				
				setTimeout(() => {
					uni.navigateBack()
				}, 1500)
			} else {
				uni.showToast({
					title: '保存失败',
					icon: 'error'
				})
			}
		},
		loadCategories() {
			const categories = getCategories()
			this.categories = this.type === 'income' ? categories.income : categories.expense
		}
	},
	watch: {
		type() {
			this.loadCategories()
			this.categoryIndex = 0
		}
	},
	onLoad() {
		this.loadCategories()
	}
}
</script>

<style>
.container {
	padding: 30rpx;
	background-color: #f5f7fa;
	min-height: 100vh;
}

.form-group {
	margin-bottom: 25rpx;
	background-color: #fff;
	border-radius: 16rpx;
	padding: 30rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.form-title {
	font-size: 28rpx;
	color: #333;
	margin-bottom: 15rpx;
	font-weight: 500;
}

.type-selector {
	display: flex;
	background: #f9f9f9;
	border-radius: 12rpx;
	overflow: hidden;
	border: 1rpx solid #eee;
	margin-top: 10rpx;
}

.type-item {
	flex: 1;
	text-align: center;
	padding: 25rpx;
	font-size: 30rpx;
	color: #666;
	transition: all 0.3s ease;
}

.type-item.active {
	background: #3cc51f;
	color: #fff;
	font-weight: 500;
}

.amount-input, .picker {
	background: #f9f9f9;
	padding: 25rpx;
	border-radius: 12rpx;
	font-size: 30rpx;
	border: 1rpx solid #eee;
}

.submit-btn {
	background: #3cc51f;
	color: #fff;
	font-size: 32rpx;
	border-radius: 12rpx;
	height: 90rpx;
	line-height: 90rpx;
	margin-top: 40rpx;
	box-shadow: 0 6rpx 15rpx rgba(60, 197, 31, 0.2);
	letter-spacing: 4rpx;
	font-weight: 500;
}
</style> 