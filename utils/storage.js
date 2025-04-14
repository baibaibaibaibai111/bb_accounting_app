// 存储键名
const STORAGE_KEYS = {
	RECORDS: 'accounting_records',
	CATEGORIES: 'accounting_categories',
	BUDGET: 'accounting_budget',
	BALANCE: 'accounting_balance'
}

// 获取记录列表
export function getRecords() {
	try {
		const records = uni.getStorageSync(STORAGE_KEYS.RECORDS)
		return records ? JSON.parse(records) : []
	} catch (e) {
		console.error('获取记录失败：', e)
		return []
	}
}

// 保存记录
export function saveRecords(records) {
	try {
		uni.setStorageSync(STORAGE_KEYS.RECORDS, JSON.stringify(records))
		return true
	} catch (e) {
		console.error('保存记录失败：', e)
		return false
	}
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
	try {
		const budgetStr = uni.getStorageSync(STORAGE_KEYS.BUDGET);
		if (budgetStr) {
			return JSON.parse(budgetStr);
		}
	} catch (e) {
		console.error('获取预算失败', e);
	}
	// 返回默认预算结构
	return {
		total: 0,
		categories: {}
	};
}

// 保存预算
export function saveBudget(budget) {
	try {
		// 确保total是所有分类预算的总和
		budget.total = Object.values(budget.categories).reduce((sum, amount) => sum + Number(amount), 0);
		uni.setStorageSync(STORAGE_KEYS.BUDGET, JSON.stringify(budget));
		return true;
	} catch (e) {
		console.error('保存预算失败', e);
		return false;
	}
}

// 获取余额设置
export function getBalance() {
	const balance = uni.getStorageSync(STORAGE_KEYS.BALANCE)
	return balance ? JSON.parse(balance) : {
		total: 0,
		alipay: 0,
		wechat: 0
	}
}

// 保存余额设置
export function saveBalance(balance) {
	try {
		uni.setStorageSync(STORAGE_KEYS.BALANCE, JSON.stringify(balance))
		return true
	} catch (e) {
		console.error('保存余额失败：', e)
		return false
	}
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
			categoryStats[record.category]) {
			if (record.type === 'expense') {
				categoryStats[record.category].used += record.amount
			} else if (record.type === 'income') {
				categoryStats[record.category].used -= record.amount
			}
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

// 清除所有数据
export function clearAllData() {
	try {
		// 清除记录数据
		uni.removeStorageSync(STORAGE_KEYS.RECORDS)
		// 清除分类数据
		uni.removeStorageSync(STORAGE_KEYS.CATEGORIES)
		// 清除预算数据
		uni.removeStorageSync(STORAGE_KEYS.BUDGET)
		return true
	} catch (e) {
		console.error('清除数据失败：', e)
		return false
	}
} 