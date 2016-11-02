// 一对多学生，可以转班删除
Ext.define('Youngshine.model.One2nStudent', {
    extend: 'Ext.data.Model',
    //idProperty: 'admin_id',

    fields: [
		{name: 'one2nstudentID'}, 
		//{name: 'hour'}, // 该学生报读课时不同一，有的会少报
		//{name: 'amount'}, 
		//{name: 'note'}, 
		//{name: 'current'}, //禁用，不参加点名，因为退费或提前报读
		{name: 'studentID'}, 
		{name: 'studentName'},
		{name: 'gender'},
		
		{name: 'timely_list'}, // 一对多的上课时间
		
		{name: 'accntdetailID'}, //报读记录，方便更改待排班状态isClassed

    ]
});