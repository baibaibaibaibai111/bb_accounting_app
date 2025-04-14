// 存储键名
const STORAGE_KEYS = {
	RECORDS: 'accounting_records',
	CATEGORIES: 'accounting_categories',
	BUDGET: 'accounting_budget'
}

// 获取记录列表
export function getRecords() {
	const records = uni.getStorageSync(STORAGE_KEYS.RECORDS)
	return records ? JSON.parse(records) : []
}

// 保存记录
export function saveRecord(record) {
	const records = getRecords()
	records.unshift(record)
	uni.setStorageSync(STORAGE_KEYS.RECORDS, JSON.stringify(records))
}

// 获取分类列表
export function getCategories() {
	const categories = uni.getStorageSync(STORAGE_KEYS.CATEGORIES)
	return categories ? JSON.parse(categories) : {
		income: ['工资', '奖金', '兼职', '投资'],
		expense: ['餐饮', '交通', '购物', '娱乐', '住房', '医疗']
	}
}

// 保存分类
export function saveCategories(categories) {
	uni.setStorageSync(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories))
}

// 获取预算设置
export function getBudget() {
	const budget = uni.getStorageSync(STORAGE_KEYS.BUDGET)
	return budget ? JSON.parse(budget) : {
		monthly: 5000,
		categories: {
			'餐饮': 1000,
			'交通': 500,
			'购物': 2000,
			'娱乐': 500
		}
	}
}

// 保存预算
export function saveBudget(budget) {
	uni.setStorageSync(STORAGE_KEYS.BUDGET, JSON.stringify(budget))
}

// 计算月度收支统计
export function calculateMonthlyStats() {
	const records = getRecords()
	const now = new Date()
	const currentMonth = now.getMonth()
	const currentYear = now.getFullYear()
	
	let income = 0
	let expense = 0
	
	records.forEach(record => {
		const recordDate = new Date(record.date)
		if (recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear) {
			if (record.type === 'income') {
				income += record.amount
			} else {
				expense += record.amount
			}
		}
	})
	
	return {
		income,
		expense
	}
}

// 计算分类预算使用情况
export function calculateCategoryBudgets() {
	const records = getRecords()
	const budget = getBudget()
	const now = new Date()
	const currentMonth = now.getMonth()
	const currentYear = now.getFullYear()
	
	const categoryStats = {}
	
	// 初始化分类统计
	Object.keys(budget.categories).forEach(category => {
		categoryStats[category] = {
			budget: budget.categories[category],
			used: 0
		}
	})
	
	// 计算已使用金额
	records.forEach(record => {
		const recordDate = new Date(record.date)
		if (recordDate.getMonth() === currentMonth && 
			recordDate.getFullYear() === currentYear && 
			record.type === 'expense' &&
			categoryStats[record.category]) {
			categoryStats[record.category].used += record.amount
		}
	})
	
	// 转换为数组并计算百分比
	return Object.keys(categoryStats).map(category => ({
		category,
		budget: categoryStats[category].budget,
		used: categoryStats[category].used,
		percentage: Math.round((categoryStats[category].used / categoryStats[category].budget) * 100)
	}))
} 