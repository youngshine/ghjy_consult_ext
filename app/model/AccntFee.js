// 缴费明细
Ext.define('Youngshine.model.AccntFee', {
    extend: 'Ext.data.Model',
    //idProperty: 'admin_id',
    fields: [
		{name: 'accntfeeID'}, 
		{name: 'accntID'}, 
		{name: 'feeDate'}, 
		{name: 'amount'}, // 金额
		{name: 'payment'},
		
		{name: 'consultID_owe'}, //业绩归属咨询师
		{name: 'consultName_owe'}, 
		
		{name: 'studentID'}, 
		{name: 'studentName'},
		
		{name: 'schoolID'},  // 学校
		{name: 'schoolsub'}, //分校区
		
    ]
});