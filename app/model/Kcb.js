// 周几某个时间段 学科教师 上课情况（知识点及人数）
Ext.define('Youngshine.model.Kcb', {
    extend: 'Ext.data.Model',
    //idProperty: 'admin_id',
    fields: [
		{name: 'teacherID'}, 
		{name: 'teacherName'}, // 教师
		{name: 'zsdID'}, 
		{name: 'zsdName'}, // 补习知识点
		{name: 'persons'}, //上课学生数量		
    ]
});