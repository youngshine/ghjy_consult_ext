Ext.define('Youngshine.model.Student', {
    extend: 'Ext.data.Model',
    //idProperty: 'admin_id',
    fields: [
		{name: 'studentID'}, 
		{name: 'studentName'}, 
		{name: 'gender'}, 
		{name: 'born'}, 
		{name: 'addr'}, 
		{name: 'phone'}, 
		{name: 'grade'}, 
		{name: 'school'}, 
		{name: 'enrolled'}, //web注册后，正式到校报名，打钩
		{name: 'note'}, 
		{name: 'wxID'}, // 代金券
		{name: 'consultID'}, //所属咨询师，可能为0 ，尚未分配咨询师
		{name: 'schoolsubID'}, //分校区
		{name: 'schoolsub'}, // fullname
		
		{name: 'current'}, // 禁用
		{name: 'created'}, // 录入时间，排序用

		// 组合字段，搜索过滤用, 中间间隔空格， 避免...
		{ name: 'fullStudent', convert: function(value, record){
				//var date = record.get('drive_date');
				return record.get('studentName') + ' ' + record.get('phone'); 
			} 
		},			
    ]
});