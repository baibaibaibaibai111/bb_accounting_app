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
	padding: 20rpx;
}

.category-section {
	margin-bottom: 30rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	margin-bottom: 20rpx;
}

.category-list {
	background: #fff;
	border-radius: 10rpx;
}

.category-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx;
	border-bottom: 1rpx solid #eee;
}

.category-name {
	font-size: 28rpx;
}

.category-actions {
	display: flex;
}

.action-btn {
	font-size: 24rpx;
	color: #4CAF50;
	margin-left: 20rpx;
}

.action-btn.delete {
	color: #f44336;
}

.add-category {
	margin-top: 40rpx;
}

.add-btn {
	background: #4CAF50;
	color: #fff;
}

.popup-content {
	background: #fff;
	border-radius: 20rpx;
	padding: 30rpx;
	width: 600rpx;
}

.popup-title {
	font-size: 32rpx;
	font-weight: bold;
	text-align: center;
	margin-bottom: 30rpx;
}

.popup-form {
	margin-bottom: 30rpx;
}

.form-group {
	margin-bottom: 20rpx;
}

.form-title {
	font-size: 28rpx;
	color: #666;
	margin-bottom: 10rpx;
}

.type-selector {
	display: flex;
	background: #f5f5f5;
	border-radius: 10rpx;
	overflow: hidden;
}

.type-item {
	flex: 1;
	text-align: center;
	padding: 20rpx;
	font-size: 28rpx;
}

.type-item.active {
	background: #4CAF50;
	color: #fff;
}

.category-input {
	background: #f5f5f5;
	padding: 20rpx;
	border-radius: 10rpx;
	font-size: 28rpx;
}

.popup-buttons {
	display: flex;
	justify-content: space-between;
}

.cancel-btn, .confirm-btn {
	flex: 1;
	margin: 0 10rpx;
}

.cancel-btn {
	background: #f5f5f5;
	color: #666;
}

.confirm-btn {
	background: #4CAF50;
	color: #fff;
}
</style> 