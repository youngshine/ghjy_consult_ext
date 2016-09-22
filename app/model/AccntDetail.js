// 缴费明细
Ext.define('Youngshine.model.AccntDetail', {
    extend: 'Ext.data.Model',
    //idProperty: 'admin_id',
    fields: [
		{name: 'accntID'}, 
		{name: 'accntDate'}, 
		{name: 'accntType'}, // 大小班，一对一，退费
		{name: 'studentID'}, // 学生
		{name: 'studentName'},
		{name: 'amount'}, 
		{name: 'amount_ys'}, //应收

		//{name: 'created'},
		
		{name: 'consultID'},//所属的咨询师
		
		{name: 'schoolsubID'}, //分校区
		
		{name: 'schoolID'},
    ]
});