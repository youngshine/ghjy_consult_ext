// 学生的联系沟通记录
Ext.define('Youngshine.model.Followup', {
    extend: 'Ext.data.Model',
    //idProperty: 'admin_id',
    fields: [
		{name: 'studentfollowID'}, 
		{name: 'studentID'}, // 学生
		{name: 'studentName'},
		{name: 'content'}, // 沟通内容
		{name: 'consultID'}, 
		{name: 'created'},

    ]
});