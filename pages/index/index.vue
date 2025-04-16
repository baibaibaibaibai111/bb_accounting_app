<template>
	<view class="container">
		<!-- Tab 切换 -->
		<view class="tab-container">
			<view 
				class="tab-item" 
				:class="{ active: currentTab === 'list' }"
				@click="currentTab = 'list'"
			>
				收支视图
			</view>
			<view 
				class="tab-item" 
				:class="{ active: currentTab === 'calendar' }"
				@click="currentTab = 'calendar'"
			>
				日历视图
			</view>
		</view>
		
		<!-- 收支视图 -->
		<view v-if="currentTab === 'list'">
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
				<view class="stat-item">
					<text class="stat-label">本月结余</text>
					<text class="stat-value" :class="monthlyStats.balance >= 0 ? 'income' : 'expense'">
						{{monthlyStats.balance >= 0 ? '+' : ''}}¥{{monthlyStats.balance}}
					</text>
				</view>
			</view>
		</view>
		
		<!-- 日历视图 -->
		<view v-else class="calendar-container">
			<view class="calendar-header">
				<view class="calendar-title">
					<text class="month-switch" @click="prevMonth">◀</text>
					{{currentYear}}年{{currentMonth + 1}}月
					<text class="month-switch" @click="nextMonth">▶</text>
				</view>
				<view class="calendar-weekdays">
					<view class="weekday" v-for="day in weekdays" :key="day">{{day}}</view>
				</view>
			</view>
			<view class="calendar-body">
				<view 
					class="calendar-day" 
					v-for="(day, index) in calendarDays" 
					:key="index"
					:class="{
						'other-month': !day.isCurrentMonth,
						'has-record': day.hasRecord
					}"
					@click="showDayRecords(day)"
				>
					<text class="day-number">{{day.day}}</text>
					<view class="day-amount" v-if="day.hasRecord">
						<text class="income" v-if="day.income > 0">+{{day.income}}</text>
						<text class="expense" v-if="day.expense > 0">-{{day.expense}}</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 收支记录列表 -->
		<view class="record-list">
			<view class="list-title">收支记录</view>
			<uni-swipe-action>
				<view v-for="(group, date) in groupedRecords" :key="date" class="date-group">
					<view class="date-title">{{date}}</view>
					<uni-swipe-action-item v-for="(item, index) in group" :key="index" :right-options="options" @click="deleteRecord(item, index)">
						<view class="record-item">
							<view class="record-left">
								<text class="record-category">{{item.category}}</text>
								<text class="record-time">{{item.date.split(' ')[1]}}</text>
							</view>
							<view class="record-right">
								<text :class="['record-amount', item.type === 'income' ? 'income' : 'expense']">
									{{item.type === 'income' ? '+' : '-'}}¥{{item.amount}}
								</text>
							</view>
						</view>
					</uni-swipe-action-item>
				</view>
			</uni-swipe-action>
		</view>
		
		<!-- 编辑余额弹窗 -->
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
			currentTab: 'list',
			weekdays: ['日', '一', '二', '三', '四', '五', '六'],
			currentYear: new Date().getFullYear(),
			currentMonth: new Date().getMonth(),
			calendarDays: [],
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
				expense: 0,
				balance: 0
			},
			records: [],
			groupedRecords: {},
			options: [{
				text: '删除',
				style: {
					backgroundColor: '#ff3b30'
				}
			}]
		}
	},
	methods: {
		loadRecords() {
			this.records = getRecords()
			console.log('原始记录：', this.records)
			
			// 按日期分组
			this.groupedRecords = {}
			this.records.forEach(record => {
				const date = record.date.split(' ')[0]
				if (!this.groupedRecords[date]) {
					this.groupedRecords[date] = []
				}
				this.groupedRecords[date].push(record)
			})
			
			console.log('分组后的记录：', this.groupedRecords)
			
			// 计算本月收支和结余
			const now = new Date()
			const currentMonth = now.getMonth()
			const currentYear = now.getFullYear()
			
			this.monthlyStats.income = 0
			this.monthlyStats.expense = 0
			
			this.records.forEach(record => {
				const recordDate = new Date(record.date)
				if (recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear) {
					if (record.type === 'income') {
						this.monthlyStats.income += Number(record.amount)
					} else {
						this.monthlyStats.expense += Number(record.amount)
					}
				}
			})
			
			// 计算本月结余
			this.monthlyStats.balance = this.monthlyStats.income - this.monthlyStats.expense
		},
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
				title: '提示',
				content: '确定要删除该记录吗？',
				success: (res) => {
					if (res.confirm) {
						this.records.splice(index, 1)
						saveRecords(this.records)
						this.loadRecords()
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
		},
		// 生成日历数据
		generateCalendar() {
			const days = []
			const firstDay = new Date(this.currentYear, this.currentMonth, 1)
			const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0)
			const firstDayWeek = firstDay.getDay()
			const lastDayDate = lastDay.getDate()
			
			// 添加上个月的日期
			for (let i = firstDayWeek - 1; i >= 0; i--) {
				const date = new Date(this.currentYear, this.currentMonth, -i)
				days.push({
					day: date.getDate(),
					isCurrentMonth: false,
					hasRecord: false
				})
			}
			
			// 添加本月的日期
			for (let i = 1; i <= lastDayDate; i++) {
				const date = new Date(this.currentYear, this.currentMonth, i)
				const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
				const dayRecords = this.records.filter(record => record.date.startsWith(dateStr))
				
				days.push({
					day: i,
					isCurrentMonth: true,
					hasRecord: dayRecords.length > 0,
					income: dayRecords.filter(r => r.type === 'income').reduce((sum, r) => sum + r.amount, 0),
					expense: dayRecords.filter(r => r.type === 'expense').reduce((sum, r) => sum + r.amount, 0)
				})
			}
			
			// 添加下个月的日期
			const remainingDays = 42 - days.length // 6行7列
			for (let i = 1; i <= remainingDays; i++) {
				const date = new Date(this.currentYear, this.currentMonth + 1, i)
				days.push({
					day: date.getDate(),
					isCurrentMonth: false,
					hasRecord: false
				})
			}
			
			this.calendarDays = days
		},
		
		// 显示某天的记录
		showDayRecords(day) {
			if (!day.hasRecord) return
			
			const date = new Date(this.currentYear, this.currentMonth, day.day)
			const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
			const dayRecords = this.records.filter(record => record.date.startsWith(dateStr))
			
			uni.showModal({
				title: `${this.currentMonth + 1}月${day.day}日收支`,
				content: `收入：+${day.income}\n支出：-${day.expense}`,
				showCancel: false
			})
		},
		
		// 切换到上个月
		prevMonth() {
			if (this.currentMonth === 0) {
				this.currentYear--
				this.currentMonth = 11
			} else {
				this.currentMonth--
			}
			this.generateCalendar()
		},
		
		// 切换到下个月
		nextMonth() {
			if (this.currentMonth === 11) {
				this.currentYear++
				this.currentMonth = 0
			} else {
				this.currentMonth++
			}
			this.generateCalendar()
		}
	},
	watch: {
		currentMonth() {
			this.generateCalendar()
		}
	},
	onLoad() {
		this.loadBalance()
		this.loadRecords()
		this.generateCalendar()
	},
	onShow() {
		this.loadBalance()
		this.loadRecords()
		this.generateCalendar()
		}
	}
</script>

<style>
	.container {
		padding: 30rpx;
		background-color: #f5f7fa;
		min-height: 100vh;
	}

	.tab-container {
		display: flex;
		background-color: #fff;
		border-radius: 16rpx;
		padding: 20rpx;
		margin-bottom: 25rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	}

	.tab-item {
		flex: 1;
		text-align: center;
		padding: 20rpx;
		font-size: 30rpx;
		color: #666;
		position: relative;
	}

	.tab-item.active {
		color: #3cc51f;
		font-weight: 500;
	}

	.tab-item.active::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 40rpx;
		height: 4rpx;
		background-color: #3cc51f;
		border-radius: 2rpx;
	}

	.calendar-container {
		background-color: #fff;
		border-radius: 16rpx;
		padding: 30rpx;
		margin-bottom: 25rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	}

	.calendar-header {
		margin-bottom: 20rpx;
	}

	.calendar-title {
		font-size: 32rpx;
		font-weight: bold;
		color: #333;
		text-align: center;
		margin-bottom: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.month-switch {
		font-size: 28rpx;
		color: #666;
		margin: 0 30rpx;
		padding: 10rpx;
	}

	.month-switch:active {
		opacity: 0.7;
	}

	.calendar-weekdays {
		display: flex;
		justify-content: space-between;
		margin-bottom: 15rpx;
	}

	.weekday {
		width: 14.28%;
		text-align: center;
		font-size: 26rpx;
		color: #666;
	}

	.calendar-body {
		display: flex;
		flex-wrap: wrap;
	}

	.calendar-day {
		width: 14.28%;
		height: 100rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	.calendar-day.other-month {
		opacity: 0.3;
	}

	.calendar-day.has-record {
		background-color: rgba(60, 197, 31, 0.1);
		border-radius: 8rpx;
	}

	.day-number {
		font-size: 28rpx;
		color: #333;
		margin-bottom: 4rpx;
	}

	.day-amount {
		display: flex;
		flex-direction: column;
		align-items: center;
		font-size: 20rpx;
	}

	.day-amount .income {
		color: #3cc51f;
	}

	.day-amount .expense {
		color: #ff3b30;
	}

	.balance-card {
		background-color: #fff;
		border-radius: 16rpx;
		padding: 35rpx;
		margin-bottom: 25rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	}

	.balance-title {
		font-size: 28rpx;
		color: #666;
		margin-bottom: 20rpx;
	}

	.balance-amount {
		font-size: 52rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 30rpx;
	}

	.balance-detail {
		display: flex;
		justify-content: space-between;
		background-color: #f9f9f9;
		border-radius: 12rpx;
		padding: 20rpx;
		margin: 10rpx 0 25rpx;
	}

	.balance-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 10rpx;
		flex: 1;
	}

	.balance-item .label {
		font-size: 26rpx;
		color: #666;
		margin-bottom: 10rpx;
	}

	.balance-item .amount {
		font-size: 34rpx;
		color: #333;
		font-weight: 500;
	}

	.balance-edit {
		text-align: right;
		color: #3cc51f;
		font-size: 26rpx;
		padding: 10rpx 20rpx;
		display: inline-block;
		margin-left: auto;
		background-color: rgba(60, 197, 31, 0.1);
		border-radius: 20rpx;
	}

	.statistics {
		display: flex;
		justify-content: space-between;
		background-color: #fff;
		border-radius: 16rpx;
		padding: 30rpx;
		margin-bottom: 25rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	}

	.stat-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1;
		padding: 10rpx;
	}

	.stat-label {
		font-size: 26rpx;
		color: #666;
		margin-bottom: 15rpx;
	}

	.stat-value {
		font-size: 36rpx;
		font-weight: bold;
	}

	.income {
		color: #3cc51f;
	}

	.expense {
		color: #ff3b30;
	}

	.record-list {
		background-color: #fff;
		border-radius: 16rpx;
		padding: 30rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
	}

	.list-title {
		font-size: 30rpx;
		font-weight: 500;
		color: #333;
		margin-bottom: 25rpx;
		border-bottom: 1rpx solid #f0f0f0;
		padding-bottom: 15rpx;
	}

	.record-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 25rpx 15rpx;
		background-color: #fafafa;
		margin-bottom: 15rpx;
		border-radius: 12rpx;
	}

	.record-left {
		display: flex;
		flex-direction: column;
	}

	.record-category {
		font-size: 30rpx;
		font-weight: 500;
		color: #333;
		margin-bottom: 8rpx;
	}

	.record-time {
		font-size: 24rpx;
		color: #999;
		margin-top: 4rpx;
	}

	.record-right {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}

	.record-amount {
		font-size: 32rpx;
		font-weight: 500;
	}

	.balance-edit-popup {
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

	.form-item input {
		width: 100%;
		height: 80rpx;
		border: 1rpx solid #e0e0e0;
		border-radius: 12rpx;
		padding: 0 20rpx;
		font-size: 28rpx;
		background-color: #f9f9f9;
		box-sizing: border-box;
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

	.date-group {
		margin-bottom: 20rpx;
		background-color: #fff;
		border-radius: 16rpx;
		overflow: hidden;
	}

	.date-title {
		padding: 20rpx 30rpx;
		font-size: 28rpx;
		color: #666;
		background-color: #f9f9f9;
		border-bottom: 1rpx solid #f0f0f0;
	}
</style>
