Ext.define('Youngshine.model.Teacher', {
    extend: 'Ext.data.Model',
    //idProperty: 'admin_id',
    fields: [
		{name: 'teacherID'}, 
		{name: 'teacherName'}, 
		{name: 'subjectID'}, 
		{name: 'subjectName'}, 
		{name: 'schoolID'}, 
		{name: 'schoolName'},
		{name: 'gender'}, 
		{name: 'phone'}, 	
		{name: 'note'},	
    ]
});