<template>
	<view class="container">
		<view class="form-group">
			<view class="form-title">记录类型</view>
			<view class="type-selector">
				<view 
					class="type-item" 
					:class="{ active: recordType === 'income' }"
					@click="recordType = 'income'"
				>
					收入
				</view>
				<view 
					class="type-item" 
					:class="{ active: recordType === 'expense' }"
					@click="recordType = 'expense'"
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
		
		<view class="form-group">
			<view class="form-title">备注</view>
			<input 
				type="text" 
				v-model="note" 
				placeholder="请输入备注"
				class="note-input"
			/>
		</view>
		
		<button class="submit-btn" @click="submitRecord">保存</button>
	</view>
</template>

<script>
import { saveRecord, getCategories } from '@/utils/storage.js'

export default {
	data() {
		return {
			recordType: 'expense',
			amount: '',
			categoryIndex: 0,
			categories: [],
			date: this.getCurrentDate(),
			note: ''
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
			if (!this.amount) {
				uni.showToast({
					title: '请输入金额',
					icon: 'none'
				})
				return
			}
			
			const record = {
				type: this.recordType,
				amount: parseFloat(this.amount),
				category: this.categories[this.categoryIndex],
				date: this.date,
				note: this.note
			}
			
			saveRecord(record)
			uni.showToast({
				title: '保存成功',
				icon: 'success'
			})
			
			// 重置表单
			this.amount = ''
			this.note = ''
		},
		loadCategories() {
			const categories = getCategories()
			this.categories = this.recordType === 'income' ? categories.income : categories.expense
		}
	},
	watch: {
		recordType() {
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
	padding: 20rpx;
}

.form-group {
	margin-bottom: 30rpx;
}

.form-title {
	font-size: 28rpx;
	color: #666;
	margin-bottom: 10rpx;
}

.type-selector {
	display: flex;
	background: #fff;
	border-radius: 10rpx;
	overflow: hidden;
}

.type-item {
	flex: 1;
	text-align: center;
	padding: 20rpx;
	font-size: 28rpx;
	background: #f5f5f5;
}

.type-item.active {
	background: #4CAF50;
	color: #fff;
}

.amount-input {
	background: #fff;
	padding: 20rpx;
	border-radius: 10rpx;
	font-size: 32rpx;
}

.picker {
	background: #fff;
	padding: 20rpx;
	border-radius: 10rpx;
	font-size: 28rpx;
}

.note-input {
	background: #fff;
	padding: 20rpx;
	border-radius: 10rpx;
	font-size: 28rpx;
}

.submit-btn {
	background: #4CAF50;
	color: #fff;
	margin-top: 40rpx;
}
</style> 