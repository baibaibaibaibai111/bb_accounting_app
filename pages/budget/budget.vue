<template>
	<view class="container">
		<!-- 总预算卡片 -->
		<view class="budget-card">
			<view class="budget-title">总预算</view>
			<view class="budget-amount">¥{{budget.total}}</view>
			<view class="budget-used">已使用：¥{{totalUsed}}</view>
			<view class="budget-remaining">剩余：¥{{totalRemaining}}</view>
		</view>
		
		<!-- 分类预算列表 -->
		<view class="category-list">
			<view class="list-header">
				<view class="list-title">分类预算</view>
				<view class="actions">
					<view class="add-category" @click="showAddCategoryPopup">添加分类</view>
					<view class="clear-all" @click="clearAllBudget" v-if="Object.keys(budget.categories).length > 0">清空</view>
				</view>
			</view>
			<view class="empty-tip" v-if="Object.keys(budget.categories).length === 0">
				暂无预算分类，请点击"添加分类"创建预算
			</view>
			<view class="category-item" v-for="(amount, category) in budget.categories" :key="category">
				<view class="category-info">
					<text class="category-name">{{category}}</text>
					<text class="category-amount">预算：¥{{amount}}</text>
					<text class="category-used">已使用：¥{{categoryUsed[category] || 0}}</text>
					<text class="category-remaining">剩余：¥{{amount - (categoryUsed[category] || 0)}}</text>
				</view>
				<view class="category-actions">
					<view class="category-edit" @click="showCategoryBudgetEdit(category)">编辑</view>
					<view class="category-delete" @click="deleteCategoryBudget(category)">删除</view>
				</view>
			</view>
		</view>
		
		<!-- 添加分类弹窗 -->
		<uni-popup ref="addCategoryPopup" type="center">
			<view class="budget-edit-popup">
				<view class="popup-title">添加分类预算</view>
				<view class="form-item">
					<text class="label">选择分类</text>
					<view class="picker-view" @click="showCategorySelector">
						<text>{{selectedCategoryName || '请选择分类'}}</text>
						<text class="picker-arrow">▼</text>
					</view>
				</view>
				<view class="form-item">
					<text class="label">预算金额</text>
					<input type="number" v-model="newCategoryBudget" placeholder="请输入预算金额" />
				</view>
				<view class="popup-buttons">
					<button class="cancel-btn" @click="cancelAddCategory">取消</button>
					<button class="confirm-btn" @click="saveNewCategory">保存</button>
				</view>
			</view>
		</uni-popup>
		
		<!-- 分类选择弹窗 -->
		<uni-popup ref="categorySelectorPopup" type="center">
			<view class="category-selector">
				<view class="selector-header">
					<view class="title">选择分类</view>
					<view class="close-btn" @click="closeCategorySelector">关闭</view>
				</view>
				<scroll-view scroll-y class="category-scroll">
					<view class="selector-item" 
						v-for="(category, index) in availableCategories" 
						:key="index"
						@click="selectCategory(index)">
						<text>{{category}}</text>
						<text v-if="selectedCategoryIndex === index" class="selected-icon">✓</text>
					</view>
				</scroll-view>
			</view>
		</uni-popup>
		
		<!-- 分类预算编辑弹窗 -->
		<uni-popup ref="categoryBudgetPopup" type="center">
			<view class="budget-edit-popup">
				<view class="popup-title">编辑分类预算</view>
				<view class="form-item">
					<text class="label">{{editCategoryName}}</text>
					<input type="number" v-model="editCategoryBudget" placeholder="请输入预算金额" />
				</view>
				<view class="popup-buttons">
					<button class="cancel-btn" @click="cancelCategoryBudgetEdit">取消</button>
					<button class="confirm-btn" @click="saveCategoryBudget">保存</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import { getBudget, saveBudget, getCategories, getRecords } from '@/utils/storage.js'

export default {
	data() {
		return {
			budget: {
				total: 0,
				categories: {}
			},
			editCategoryName: '',
			editCategoryBudget: 0,
			selectedCategoryIndex: -1,
			selectedCategoryName: '',
			newCategoryBudget: 0,
			categoryUsed: {},
			totalUsed: 0,
			totalRemaining: 0,
			availableCategories: []
		}
	},
	methods: {
		loadBudget() {
			this.budget = getBudget()
			// 获取可用的支出分类
			const categories = getCategories()
			console.log('支出分类:', categories.expense)
			// 确保分类是字符串数组而不是对象键
			this.availableCategories = Array.isArray(categories.expense) 
				? categories.expense 
				: Object.keys(categories.expense)
			// 计算总预算
			this.calculateTotalBudget()
			// 计算已使用金额
			this.calculateUsedAmount()
		},
		calculateTotalBudget() {
			// 计算所有分类预算的总和
			this.budget.total = Object.values(this.budget.categories).reduce((sum, amount) => sum + Number(amount), 0)
		},
		calculateUsedAmount() {
			// 获取本月支出记录
			const now = new Date()
			const year = now.getFullYear()
			const month = now.getMonth() + 1
			const records = getRecords()
			const monthlyRecords = records.filter(record => {
				const recordDate = new Date(record.date)
				return recordDate.getFullYear() === year && 
					   recordDate.getMonth() + 1 === month &&
					   record.type === 'expense'
			})
			
			// 计算每个分类的已使用金额
			this.categoryUsed = {}
			monthlyRecords.forEach(record => {
				if (!this.categoryUsed[record.category]) {
					this.categoryUsed[record.category] = 0
				}
				this.categoryUsed[record.category] += Number(record.amount)
			})
			
			// 计算总已使用金额
			this.totalUsed = Object.values(this.categoryUsed).reduce((sum, amount) => sum + amount, 0)
			this.totalRemaining = this.budget.total - this.totalUsed
		},
		clearAllBudget() {
			uni.showModal({
				title: '提示',
				content: '确定要清空所有预算分类吗？',
				success: (res) => {
					if (res.confirm) {
						this.budget = {
							total: 0,
							categories: {}
						}
						saveBudget(this.budget)
						this.calculateUsedAmount()
						uni.showToast({
							title: '已清空所有预算',
							icon: 'success'
						})
					}
				}
			})
		},
		showAddCategoryPopup() {
			this.selectedCategoryIndex = -1
			this.selectedCategoryName = ''
			this.newCategoryBudget = 0
			this.$refs.addCategoryPopup.open()
		},
		showCategorySelector() {
			this.$refs.categorySelectorPopup.open()
		},
		closeCategorySelector() {
			this.$refs.categorySelectorPopup.close()
		},
		selectCategory(index) {
			this.selectedCategoryIndex = index
			this.selectedCategoryName = this.availableCategories[index]
			this.$refs.categorySelectorPopup.close()
		},
		cancelAddCategory() {
			this.$refs.addCategoryPopup.close()
		},
		saveNewCategory() {
			if (this.selectedCategoryIndex === -1) {
				uni.showToast({
					title: '请选择分类',
					icon: 'none'
				})
				return
			}
			if (this.newCategoryBudget <= 0) {
				uni.showToast({
					title: '请输入有效的预算金额',
					icon: 'none'
				})
				return
			}
			if (this.budget.categories[this.selectedCategoryName]) {
				uni.showToast({
					title: '该分类已存在预算',
					icon: 'none'
				})
				return
			}
			this.budget.categories[this.selectedCategoryName] = Number(this.newCategoryBudget)
			this.calculateTotalBudget()
			this.calculateUsedAmount()
			saveBudget(this.budget)
			this.$refs.addCategoryPopup.close()
			uni.showToast({
				title: '添加成功',
				icon: 'success'
			})
		},
		showCategoryBudgetEdit(category) {
			this.editCategoryName = category
			this.editCategoryBudget = this.budget.categories[category]
			this.$refs.categoryBudgetPopup.open()
		},
		cancelCategoryBudgetEdit() {
			this.$refs.categoryBudgetPopup.close()
		},
		saveCategoryBudget() {
			if (this.editCategoryBudget <= 0) {
				uni.showToast({
					title: '请输入有效的预算金额',
					icon: 'none'
				})
				return
			}
			this.budget.categories[this.editCategoryName] = Number(this.editCategoryBudget)
			this.calculateTotalBudget()
			this.calculateUsedAmount()
			saveBudget(this.budget)
			this.$refs.categoryBudgetPopup.close()
			uni.showToast({
				title: '保存成功',
				icon: 'success'
			})
		},
		deleteCategoryBudget(category) {
			uni.showModal({
				title: '提示',
				content: '确定要删除该分类预算吗？',
				success: (res) => {
					if (res.confirm) {
						delete this.budget.categories[category]
						this.calculateTotalBudget()
						this.calculateUsedAmount()
						saveBudget(this.budget)
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
		this.loadBudget()
	},
	onShow() {
		this.loadBudget()
	}
}
</script>

<style>
.container {
	padding: 30rpx;
	background-color: #f5f7fa;
	min-height: 100vh;
}

.budget-card {
	background-color: #fff;
	border-radius: 16rpx;
	padding: 30rpx;
	margin-bottom: 30rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.budget-title {
	font-size: 28rpx;
	color: #666;
	margin-bottom: 20rpx;
}

.budget-amount {
	font-size: 52rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 15rpx;
}

.budget-used, .budget-remaining {
	font-size: 26rpx;
	color: #666;
	margin-bottom: 5rpx;
}

.budget-remaining {
	color: #3cc51f;
	font-weight: 500;
}

.category-list {
	background-color: #fff;
	border-radius: 16rpx;
	padding: 30rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.list-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 25rpx;
}

.list-title {
	font-size: 30rpx;
	color: #333;
	font-weight: 500;
}

.actions {
	display: flex;
	align-items: center;
}

.add-category {
	color: #3cc51f;
	font-size: 26rpx;
	margin-right: 25rpx;
	background-color: rgba(60, 197, 31, 0.1);
	padding: 8rpx 16rpx;
	border-radius: 20rpx;
}

.clear-all {
	color: #ff3b30;
	font-size: 26rpx;
	background-color: rgba(255, 59, 48, 0.1);
	padding: 8rpx 16rpx;
	border-radius: 20rpx;
}

.empty-tip {
	text-align: center;
	color: #999;
	font-size: 28rpx;
	padding: 60rpx 0;
}

.category-item {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	padding: 25rpx 15rpx;
	border-bottom: 1rpx solid #f0f0f0;
	margin-bottom: 10rpx;
	background-color: #fafafa;
	border-radius: 12rpx;
}

.category-info {
	display: flex;
	flex-direction: column;
	flex: 1;
}

.category-name {
	font-size: 30rpx;
	font-weight: bold;
	margin-bottom: 8rpx;
	color: #333;
}

.category-amount {
	font-size: 26rpx;
	color: #666;
	margin-bottom: 8rpx;
}

.category-used {
	font-size: 26rpx;
	color: #ff9500;
	margin-bottom: 8rpx;
}

.category-remaining {
	font-size: 26rpx;
	color: #3cc51f;
	margin-bottom: 5rpx;
}

.category-actions {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
}

.category-edit, .category-delete {
	font-size: 24rpx;
	margin-bottom: 10rpx;
	padding: 6rpx 14rpx;
	border-radius: 20rpx;
}

.category-edit {
	color: #007aff;
	background-color: rgba(0, 122, 255, 0.1);
}

.category-delete {
	color: #ff3b30;
	background-color: rgba(255, 59, 48, 0.1);
}

.budget-edit-popup {
	background-color: #fff;
	border-radius: 16rpx;
	padding: 40rpx 30rpx;
	width: 600rpx;
	box-shadow: 0 10rpx 25rpx rgba(0, 0, 0, 0.1);
}

.popup-title {
	font-size: 34rpx;
	font-weight: bold;
	text-align: center;
	margin-bottom: 40rpx;
	color: #333;
}

.form-item {
	margin-bottom: 25rpx;
}

.form-item .label {
	font-size: 28rpx;
	color: #333;
	margin-bottom: 15rpx;
	display: block;
	font-weight: 500;
}

.form-item input, .picker, .picker-view {
	width: 90%;
	height: 80rpx;
	border: 1rpx solid #e0e0e0;
	border-radius: 12rpx;
	padding: 0 20rpx;
	font-size: 28rpx;
	line-height: 80rpx;
	background-color: #f9f9f9;
}

.picker-view {
	display: flex;
	justify-content: space-between;
	align-items: center;
	background-color: #f5f5f5;
}

.picker-arrow {
	color: #999;
	font-size: 24rpx;
}

.popup-buttons {
	display: flex;
	justify-content: space-between;
	margin-top: 40rpx;
}

.popup-buttons button {
	width: 45%;
	height: 80rpx;
	line-height: 80rpx;
	text-align: center;
	border-radius: 12rpx;
	font-size: 28rpx;
	transition: all 0.3s ease;
}

.cancel-btn {
	background-color: #f5f5f5;
	color: #666;
	border: 1rpx solid #e0e0e0;
}

.confirm-btn {
	background-color: #3cc51f;
	color: #fff;
	border: none;
}

.category-selector {
	background-color: #fff;
	border-radius: 16rpx;
	padding: 30rpx;
	width: 600rpx;
	max-height: 80vh;
	box-shadow: 0 10rpx 25rpx rgba(0, 0, 0, 0.1);
}

.selector-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
	padding-bottom: 20rpx;
	border-bottom: 1rpx solid #eee;
}

.title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.close-btn {
	color: #666;
	font-size: 28rpx;
	padding: 6rpx 14rpx;
	border-radius: 20rpx;
	background-color: #f5f5f5;
}

.category-scroll {
	height: 450rpx;
	overflow-view: scroll;
}

.selector-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 24rpx 20rpx;
	border-bottom: 1rpx solid #f0f0f0;
	font-size: 28rpx;
	border-radius: 8rpx;
	margin-bottom: 10rpx;
}

.selector-item:active {
	background-color: #f0f0f0;
}

.selected-icon {
	color: #3cc51f;
	font-size: 32rpx;
	font-weight: bold;
}
</style> 