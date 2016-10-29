Ext.define('Youngshine.model.Teacher', {
    extend: 'Ext.data.Model',
    //idProperty: 'admin_id',
    fields: [
		{name: 'teacherID'}, 
		{name: 'teacherName'}, 
		{name: 'gender'}, 
		{name: 'phone'}, 	
		{name: 'note'},	
		{name: 'timely_list_one2n'}, //一对N的上课时间列表，先设定好	
		{name: 'subjectID'}, 
		{name: 'subjectName'}, 
		{name: 'schoolID'}, 
		{name: 'schoolName'},
    ]
});