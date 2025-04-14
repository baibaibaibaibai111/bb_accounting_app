<template>
	<view class="container">
		<!-- 收入分类 -->
		<view class="category-section">
			<view class="section-title">收入分类</view>
			<view class="category-list">
				<view class="category-item" v-for="(item, index) in incomeCategories" :key="index">
					<text class="category-name">{{item}}</text>
					<view class="category-actions">
						<text class="action-btn" @click="editCategory('income', index)">编辑</text>
						<text class="action-btn delete" @click="deleteCategory('income', index)">删除</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 支出分类 -->
		<view class="category-section">
			<view class="section-title">支出分类</view>
			<view class="category-list">
				<view class="category-item" v-for="(item, index) in expenseCategories" :key="index">
					<text class="category-name">{{item}}</text>
					<view class="category-actions">
						<text class="action-btn" @click="editCategory('expense', index)">编辑</text>
						<text class="action-btn delete" @click="deleteCategory('expense', index)">删除</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 添加分类按钮 -->
		<view class="add-category">
			<button class="add-btn" @click="showAddModal">添加分类</button>
		</view>
		
		<!-- 添加/编辑分类弹窗 -->
		<uni-popup ref="popup" type="center">
			<view class="popup-content">
				<view class="popup-title">{{isEdit ? '编辑分类' : '添加分类'}}</view>
				<view class="popup-form">
					<view class="form-group">
						<view class="form-title">分类类型</view>
						<view class="type-selector">
							<view 
								class="type-item" 
								:class="{ active: newCategoryType === 'income' }"
								@click="newCategoryType = 'income'"
							>
								收入
							</view>
							<view 
								class="type-item" 
								:class="{ active: newCategoryType === 'expense' }"
								@click="newCategoryType = 'expense'"
							>
								支出
							</view>
						</view>
					</view>
					<view class="form-group">
						<view class="form-title">分类名称</view>
						<input 
							type="text" 
							v-model="newCategoryName" 
							placeholder="请输入分类名称"
							class="category-input"
						/>
					</view>
				</view>
				<view class="popup-buttons">
					<button class="cancel-btn" @click="closePopup">取消</button>
					<button class="confirm-btn" @click="saveCategory">确定</button>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import { getCategories, saveCategories } from '@/utils/storage.js'

export default {
	data() {
		return {
			incomeCategories: [],
			expenseCategories: [],
			isEdit: false,
			editIndex: -1,
			newCategoryType: 'expense',
			newCategoryName: ''
		}
	},
	methods: {
		loadCategories() {
			const categories = getCategories()
			this.incomeCategories = categories.income
			this.expenseCategories = categories.expense
		},
		showAddModal() {
			this.isEdit = false
			this.newCategoryName = ''
			this.$refs.popup.open()
		},
		editCategory(type, index) {
			this.isEdit = true
			this.editIndex = index
			this.newCategoryType = type
			this.newCategoryName = type === 'income' ? this.incomeCategories[index] : this.expenseCategories[index]
			this.$refs.popup.open()
		},
		deleteCategory(type, index) {
			uni.showModal({
				title: '提示',
				content: '确定要删除该分类吗？',
				success: (res) => {
					if (res.confirm) {
						if (type === 'income') {
							this.incomeCategories.splice(index, 1)
						} else {
							this.expenseCategories.splice(index, 1)
						}
						this.saveCategories()
					}
				}
			})
		},
		closePopup() {
			this.$refs.popup.close()
		},
		saveCategory() {
			if (!this.newCategoryName) {
				uni.showToast({
					title: '请输入分类名称',
					icon: 'none'
				})
				return
			}
			
			if (this.isEdit) {
				if (this.newCategoryType === 'income') {
					this.incomeCategories[this.editIndex] = this.newCategoryName
				} else {
					this.expenseCategories[this.editIndex] = this.newCategoryName
				}
			} else {
				if (this.newCategoryType === 'income') {
					this.incomeCategories.push(this.newCategoryName)
				} else {
					this.expenseCategories.push(this.newCategoryName)
				}
			}
			
			this.saveCategories()
			this.closePopup()
			uni.showToast({
				title: '保存成功',
				icon: 'success'
			})
		},
		saveCategories() {
			saveCategories({
				income: this.incomeCategories,
				expense: this.expenseCategories
			})
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

.category-section {
	margin-bottom: 30rpx;
	background-color: #fff;
	border-radius: 16rpx;
	padding: 30rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	margin-bottom: 25rpx;
	color: #333;
	border-bottom: 1rpx solid #f0f0f0;
	padding-bottom: 15rpx;
}

.category-list {
	background: #fff;
	border-radius: 10rpx;
}

.category-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 25rpx 15rpx;
	border-bottom: 1rpx solid #f0f0f0;
	border-radius: 10rpx;
	margin-bottom: 10rpx;
	background-color: #fafafa;
}

.category-name {
	font-size: 30rpx;
	color: #333;
}

.category-actions {
	display: flex;
}

.action-btn {
	font-size: 24rpx;
	margin-left: 20rpx;
	padding: 8rpx 16rpx;
	border-radius: 20rpx;
}

.action-btn {
	color: #007aff;
	background-color: rgba(0, 122, 255, 0.1);
}

.action-btn.delete {
	color: #ff3b30;
	background-color: rgba(255, 59, 48, 0.1);
}

.add-category {
	margin-top: 40rpx;
}

.add-btn {
	background: #3cc51f;
	color: #fff;
	font-size: 32rpx;
	border-radius: 12rpx;
	height: 90rpx;
	line-height: 90rpx;
	box-shadow: 0 6rpx 15rpx rgba(60, 197, 31, 0.2);
	letter-spacing: 4rpx;
	font-weight: 500;
}

.popup-content {
	background: #fff;
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

.popup-form {
	margin-bottom: 30rpx;
}

.form-group {
	margin-bottom: 25rpx;
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

.category-input {
	background: #f9f9f9;
	padding: 25rpx;
	border-radius: 12rpx;
	font-size: 30rpx;
	border: 1rpx solid #eee;
}

.popup-buttons {
	display: flex;
	justify-content: space-between;
	margin-top: 40rpx;
}

.popup-buttons button {
	flex: 1;
	margin: 0 10rpx;
	height: 80rpx;
	line-height: 80rpx;
	text-align: center;
	border-radius: 12rpx;
	font-size: 30rpx;
	transition: all 0.3s ease;
}

.cancel-btn {
	background: #f5f5f5;
	color: #666;
	border: 1rpx solid #e0e0e0;
}

.confirm-btn {
	background: #3cc51f;
	color: #fff;
	border: none;
}
</style> 