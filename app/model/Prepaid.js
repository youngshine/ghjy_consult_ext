// 学生的缴费历史
Ext.define('Youngshine.model.Prepaid', {
    extend: 'Ext.data.Model',
    //idProperty: 'prepaidID',
    fields: [
		{name: 'prepaidID'}, 
		{name: 'studentID'}, 
		{name: 'studentName'}, 
		{name: 'gender'}, 
		{name: 'grade'}, 
		{name: 'study_list'}, // 报读课程列表
		{name: 'payment'},
		{name: 'subtotal'}, 
		{name: 'taocan'}, // 套餐
		{name: 'sectionID'}, // 学段
		{name: 'amt'}, //价格
		{name: 'coupon'}, //代金券抵扣
		{name: 'amount'}, //实际金额：价格－抵扣
		{name: 'times'}, //购买小时数：10、20、30
		{name: 'times_study'}, //已经使用的课时（添加知识点）
		{name: 'OrderID'}, //刷卡的话，交易单	
		{name: 'consultID'}, //所属咨询师 
		{name: 'created'},
    ]
});