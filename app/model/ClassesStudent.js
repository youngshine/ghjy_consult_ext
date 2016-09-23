// 班级学生，可以转班删除
Ext.define('Youngshine.model.ClassesStudent', {
    extend: 'Ext.data.Model',
    //idProperty: 'admin_id',

    fields: [
		{name: 'classstudentID'}, 
		{name: 'classID'},
		//{name: 'hour'}, // 该学生报读课时不同一，有的会少报
		//{name: 'amount'}, 
		{name: 'note'}, 
		{name: 'current'}, //禁用，不参加点名，因为退费或提前报读
		{name: 'studentID'}, 
		{name: 'studentName'},
		{name: 'gender'},
		
		{name: 'accntdetailID'}, //报读记录，方便更改待排班状态isClassed

    ]
});