// 缴费明细
Ext.define('Youngshine.model.AccntDetail', {
    extend: 'Ext.data.Model',
    //idProperty: 'admin_id',
    fields: [
		{name: 'accntdetailID'}, 
		{name: 'accntID'}, 
		{name: 'title'}, 
		{name: 'kclistID'}, 
		{name: 'kcType'}, //课程分类：大小班、一对一
		{name: 'kmType'}, //学科分类
		{name: 'unitprice'},  // 一对一单价
		{name: 'hour'}, 
		{name: 'amount'}, // 金额
		
		{name: 'accntType'}, 
		{name: 'accntDate'}, 
		{name: 'studentID'}, 
		{name: 'studentName'},
    ]
});