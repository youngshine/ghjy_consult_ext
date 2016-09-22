// 学生测评知识点
Ext.define('Youngshine.model.Assess', {
    extend: 'Ext.data.Model',
    //idProperty: 'admin_id',
    fields: [
		{name: 'assessID'}, 
		{name: 'studentID'}, // 学生
		{name: 'studentName'},
		{name: 'grade'}, 
		{name: 'level_list'}, //学生注册时候的水平：低1中2高3，对应学科

		{name: 'subjectID'}, // 要测评学科
		{name: 'subjectName'}, // 学科名称
		{name: 'gradeID'}, // 学科的年级
		{name: 'gradeName'},
		{name: 'semester'}, // 上下学期

		{name: 'created'},
		
		{name: 'consultID'},//所属的咨询师
/*		
		{ name: 'fullLevel', convert: function(value, record){
				var level = record.get('level');
				if(level==1)
					return '低';
				if(level==2)
					return '中';
				if(level==3)
					return '高';
			} 
		}, */
    ]
});