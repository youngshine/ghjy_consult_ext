// 待排课课程（学生知识点）
Ext.define('Youngshine.view.kcb.List' ,{
	extend: 'Ext.window.Window',
    alias : 'widget.kcb-list',
	
    requires:[
		//'Youngshine.view.study.Zsd',
    ],

	autoShow: true,
	closable: true,
	modal: true,
	//resizable: false,
	width: 700,
	height: 500,
	layout: 'fit',

    title : '待排课的',
	
	//record: null, // 父表参数传递，该学生信息

	fbar: [{	
		xtype: 'textfield',
		itemId : 'search',
		width: 150,
		//fieldLabel: '筛选',
		//labelWidth: 30,
		//labelAlign: 'right',
		emptyText: '搜索...',
		enableKeyEvents: true,
		listeners: {
			keypress: function(field,e){
				console.log(e.getKey())
				if(e.getKey()=='13'){ //按Enter
					var studentName = field.value,
						grade = field.up('window').down('combo[itemId=grade]').getValue();
					field.up('window').onFilter(grade,studentName); 
				}	
			}
		}
	},'->',{
		xtype: 'button',
		text: '关闭',
		//scale: 'medium',
		width: 55,
		style: {
			//background: 'transparent',
			border: 1 //'1px solid #fff'
		},
		handler: function(btn){
			btn.up('window').close()
		}
	}],
	
	items: [{
		xtype: 'grid',
		stripeRows: true,
		store: 'Study',
	    columns: [{
			xtype: 'rownumberer',
		},{	
	         text: '学生',
	         width: 80,
	         //sortable: false,
			 menuDisabled: true,
	         dataIndex: 'studentName'
	     }, {
			 text: '知识点',
	         flex: 1,
	         sortable: true,
			 menuDisabled: true,
	         dataIndex: 'zsdName'
	     }, {
	         text: '学科',
	         width: 50,
	         //sortable: false,
			 menuDisabled: true,
	         dataIndex: 'subjectName'
	     }, {
	         text: '年段',
	         width: 50,
	         //sortable: false,
			 menuDisabled: true,
	         dataIndex: 'grade'	  
	     }, {
	         text: '报读时间',
	         width: 80,
	         //sortable: false,
			 menuDisabled: true,
	         dataIndex: 'created'
	     }, {
	         text: '上课日',
	         width: 50,
	         //sortable: false,
			 menuDisabled: true,
	         dataIndex: 'teach_weekday'	 
	     }, {
	         text: '时间段',
	         width: 50,
	         //sortable: false,
			 menuDisabled: true,
	         dataIndex: 'teach_timespan'
	     }, {
	         text: '授课教师',
	         width: 60,
			 menuDisabled: true,
	         dataIndex: 'teacherName' 
		},{	 
			menuDisabled: true,
			sortable: false,
			xtype: 'actioncolumn',
			width: 30,
			items: [{
				//iconCls: 'add',
				icon: 'resources/images/my_input_icon.png',
				tooltip: '排课',
				handler: function(grid, rowIndex, colIndex) {
					grid.getSelectionModel().select(rowIndex); // 高粱
					var rec = grid.getStore().getAt(rowIndex);
					grid.up('window').onStudyKcb(rec); 
				}	
			}]				 		 
	     }],     
	}],
	
	onStudyKcb: function(rec){
		console.log(rec)
		var win = Ext.create("Youngshine.view.study.Study-kcb",{record: rec})
		win.down('form').loadRecord(rec) // form绑定记录
	},
});