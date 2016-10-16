// 缴费 update  `ghjy_accnt`  set schoolsubID=6  WHERE consultID=27
Ext.define('Youngshine.model.Accnt', {
    extend: 'Ext.data.Model',
    //idProperty: 'admin_id',
    fields: [
		{name: 'accntID'}, 
		{name: 'accntDate'}, 
		{name: 'accntType'}, // 大小班，一对一，退费
		//{name: 'payment'}, // 学生
		{name: 'note'},
		{name: 'amount'}, 
		{name: 'amount_ys'}, //应收
		//{name: 'discount'}, //优惠
		//{name: 'amount_owe'}, //当天欠费，可以补交
		//{name: 'balance'}, //欠费：折后实收金额－fee收费记录
		{name: 'amount_done'}, //已经缴款合计，来自fee表

		{name: 'current'}, //作废单
		{name: 'created'},
		
		{name: 'studentID'}, // 学生
		{name: 'studentName'},
		
		{name: 'consultID'},//所属的录入咨询师
		{name: 'consultName'},
		
		{name: 'consultID_owe'},//业绩归属咨询师
		{name: 'consultName_owe'},
		
		{name: 'schoolsubID'}, //分校区
		{name: 'schoolsub'},
		
		{name: 'schoolID'},
		
		//  优惠折扣
		{ name: 'discount', convert: function(value, record){
				return parseInt(record.get('amount_ys')) - parseInt(record.get('amount')); 
			} 
		},
		//  欠费
		{ name: 'balance', convert: function(value, record){
				var amount_done = record.get('amount_done')
				if (amount_done==null) amount_done = 0
				return parseInt(record.get('amount')) - parseInt(amount_done); 
			} 
		},
    ]
});