// 分校区
Ext.define('Youngshine.model.Schoolsub', {
    extend: 'Ext.data.Model',
    //idProperty: 'admin_id',
    fields: [
		{name: 'schoolsubID'}, 
		{name: 'fullname'},
		{name: 'addr'}, 
		{name: 'phone'}, // 电话
		{name: 'contact'}, // 俩你人
		{name: 'schoolID'}, // 联盟学校
		{name: 'schoolName'},
    ]
});