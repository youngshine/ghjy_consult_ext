// 加盟学校
Ext.define('Youngshine.model.School', {
    extend: 'Ext.data.Model',
    //idProperty: 'admin_id',
    fields: [
		{name: 'schoolID'}, 
		{name: 'schoolName'}, 
		{name: 'district'}, //加盟学校所在县市区
		{name: 'price_list'}, //课时单价：小初高110,120,130
		{name: 'note'},
	]
});