"use strict";const e=require("../../common/vendor.js"),t=require("../../utils/storage.js"),o={data(){return{type:"expense",amount:"",categoryIndex:0,categories:[],date:this.getCurrentDate()}},methods:{getCurrentDate(){const e=new Date;return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}-${String(e.getDate()).padStart(2,"0")}`},onCategoryChange(e){this.categoryIndex=e.detail.value},onDateChange(e){this.date=e.detail.value},submitRecord(){if(!this.amount||!this.categories[this.categoryIndex]||!this.date)return void e.index.showToast({title:"请填写完整信息",icon:"none"});const o={id:Date.now(),type:this.type,amount:parseFloat(this.amount),category:this.categories[this.categoryIndex],date:this.date};console.log("新记录：",o);const a=t.getRecords();console.log("现有记录：",a),a.unshift(o),console.log("更新后的记录：",a);const n=t.saveRecords(a);console.log("保存结果：",n),n?(e.index.showToast({title:"保存成功",icon:"success"}),setTimeout((()=>{e.index.navigateBack()}),1500)):e.index.showToast({title:"保存失败",icon:"error"})},loadCategories(){const e=t.getCategories();this.categories="income"===this.type?e.income:e.expense}},watch:{type(){this.loadCategories(),this.categoryIndex=0}},onLoad(){this.loadCategories()}};const a=e._export_sfc(o,[["render",function(t,o,a,n,s,i){return{a:"income"===s.type?1:"",b:e.o((e=>s.type="income")),c:"expense"===s.type?1:"",d:e.o((e=>s.type="expense")),e:s.amount,f:e.o((e=>s.amount=e.detail.value)),g:e.t(s.categories[s.categoryIndex]),h:s.categories,i:s.categoryIndex,j:e.o(((...e)=>i.onCategoryChange&&i.onCategoryChange(...e))),k:e.t(s.date),l:s.date,m:e.o(((...e)=>i.onDateChange&&i.onDateChange(...e))),n:e.o(((...e)=>i.submitRecord&&i.submitRecord(...e)))}}]]);wx.createPage(a);
