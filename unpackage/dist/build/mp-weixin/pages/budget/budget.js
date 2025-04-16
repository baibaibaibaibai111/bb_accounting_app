"use strict";const e=require("../../common/vendor.js"),t=require("../../utils/storage.js"),o={data:()=>({budget:{total:0,categories:{}},editCategoryName:"",editCategoryBudget:0,selectedCategoryIndex:-1,selectedCategoryName:"",newCategoryBudget:0,categoryUsed:{},totalUsed:0,totalRemaining:0,availableCategories:[]}),methods:{loadBudget(){this.budget=t.getBudget();const e=t.getCategories();console.log("支出分类:",e.expense),this.availableCategories=Array.isArray(e.expense)?e.expense:Object.keys(e.expense),this.calculateTotalBudget(),this.calculateUsedAmount()},calculateTotalBudget(){this.budget.total=Object.values(this.budget.categories).reduce(((e,t)=>e+Number(t)),0)},calculateUsedAmount(){const e=new Date,o=e.getFullYear(),a=e.getMonth()+1,s=t.getRecords().filter((e=>{const t=new Date(e.date);return t.getFullYear()===o&&t.getMonth()+1===a&&"expense"===e.type}));this.categoryUsed={},s.forEach((e=>{this.categoryUsed[e.category]||(this.categoryUsed[e.category]=0),this.categoryUsed[e.category]+=Number(e.amount)})),this.totalUsed=Object.values(this.categoryUsed).reduce(((e,t)=>e+t),0),this.totalRemaining=this.budget.total-this.totalUsed},clearAllBudget(){e.index.showModal({title:"提示",content:"确定要清空所有预算分类吗？",success:o=>{o.confirm&&(this.budget={total:0,categories:{}},t.saveBudget(this.budget),this.calculateUsedAmount(),e.index.showToast({title:"已清空所有预算",icon:"success"}))}})},showAddCategoryPopup(){this.selectedCategoryIndex=-1,this.selectedCategoryName="",this.newCategoryBudget=0,this.$refs.addCategoryPopup.open()},showCategorySelector(){this.$refs.categorySelectorPopup.open()},closeCategorySelector(){this.$refs.categorySelectorPopup.close()},selectCategory(e){this.selectedCategoryIndex=e,this.selectedCategoryName=this.availableCategories[e],this.$refs.categorySelectorPopup.close()},cancelAddCategory(){this.$refs.addCategoryPopup.close()},saveNewCategory(){-1!==this.selectedCategoryIndex?this.newCategoryBudget<=0?e.index.showToast({title:"请输入有效的预算金额",icon:"none"}):this.budget.categories[this.selectedCategoryName]?e.index.showToast({title:"该分类已存在预算",icon:"none"}):(this.budget.categories[this.selectedCategoryName]=Number(this.newCategoryBudget),this.calculateTotalBudget(),this.calculateUsedAmount(),t.saveBudget(this.budget),this.$refs.addCategoryPopup.close(),e.index.showToast({title:"添加成功",icon:"success"})):e.index.showToast({title:"请选择分类",icon:"none"})},showCategoryBudgetEdit(e){this.editCategoryName=e,this.editCategoryBudget=this.budget.categories[e],this.$refs.categoryBudgetPopup.open()},cancelCategoryBudgetEdit(){this.$refs.categoryBudgetPopup.close()},saveCategoryBudget(){this.editCategoryBudget<=0?e.index.showToast({title:"请输入有效的预算金额",icon:"none"}):(this.budget.categories[this.editCategoryName]=Number(this.editCategoryBudget),this.calculateTotalBudget(),this.calculateUsedAmount(),t.saveBudget(this.budget),this.$refs.categoryBudgetPopup.close(),e.index.showToast({title:"保存成功",icon:"success"}))},deleteCategoryBudget(o){e.index.showModal({title:"提示",content:"确定要删除该分类预算吗？",success:a=>{a.confirm&&(delete this.budget.categories[o],this.calculateTotalBudget(),this.calculateUsedAmount(),t.saveBudget(this.budget),e.index.showToast({title:"删除成功",icon:"success"}))}})}},onLoad(){this.loadBudget()},onShow(){this.loadBudget()}};if(!Array){e.resolveComponent("uni-popup")()}Math;const a=e._export_sfc(o,[["render",function(t,o,a,s,g,d){return e.e({a:e.t(g.budget.total),b:e.t(g.totalUsed),c:e.t(g.totalRemaining),d:e.o(((...e)=>d.showAddCategoryPopup&&d.showAddCategoryPopup(...e))),e:Object.keys(g.budget.categories).length>0},Object.keys(g.budget.categories).length>0?{f:e.o(((...e)=>d.clearAllBudget&&d.clearAllBudget(...e)))}:{},{g:0===Object.keys(g.budget.categories).length},(Object.keys(g.budget.categories).length,{}),{h:e.f(g.budget.categories,((t,o,a)=>({a:e.t(o),b:e.t(t),c:e.t(g.categoryUsed[o]||0),d:e.t(t-(g.categoryUsed[o]||0)),e:e.o((e=>d.showCategoryBudgetEdit(o)),o),f:e.o((e=>d.deleteCategoryBudget(o)),o),g:o}))),i:e.t(g.selectedCategoryName||"请选择分类"),j:e.o(((...e)=>d.showCategorySelector&&d.showCategorySelector(...e))),k:g.newCategoryBudget,l:e.o((e=>g.newCategoryBudget=e.detail.value)),m:e.o(((...e)=>d.cancelAddCategory&&d.cancelAddCategory(...e))),n:e.o(((...e)=>d.saveNewCategory&&d.saveNewCategory(...e))),o:e.sr("addCategoryPopup","0709eb04-0"),p:e.p({type:"center"}),q:e.o(((...e)=>d.closeCategorySelector&&d.closeCategorySelector(...e))),r:e.f(g.availableCategories,((t,o,a)=>e.e({a:e.t(t),b:g.selectedCategoryIndex===o},(g.selectedCategoryIndex,{}),{c:o,d:e.o((e=>d.selectCategory(o)),o)}))),s:e.sr("categorySelectorPopup","0709eb04-1"),t:e.p({type:"center"}),v:e.t(g.editCategoryName),w:g.editCategoryBudget,x:e.o((e=>g.editCategoryBudget=e.detail.value)),y:e.o(((...e)=>d.cancelCategoryBudgetEdit&&d.cancelCategoryBudgetEdit(...e))),z:e.o(((...e)=>d.saveCategoryBudget&&d.saveCategoryBudget(...e))),A:e.sr("categoryBudgetPopup","0709eb04-2"),B:e.p({type:"center"})})}]]);wx.createPage(a);
