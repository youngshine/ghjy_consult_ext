// 学生列表：报读知识点
Ext.define('Youngshine.view.study.List' ,{
    //extend: 'Ext.grid.Panel',
	extend: 'Ext.window.Window',
    alias : 'widget.student-study',
	
    requires:[
		//'Youngshine.view.study.Study',//报读课程
    ],

	closable: true,
	modal: true,
    autoShow: true,
	//resizable: false,
	width: 600,
	height: 500,
	layout: 'fit',

    title : '学生列表',

	fbar: [{
		xtype: 'textfield',
		itemId : 'search',
		width: 100,
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
	},{
		xtype: 'combo',
		width: 100,
		itemId: 'grade',
		store: {
			fields: ['value'],
			data : [
				{"value":"全部年级"},
				{"value":"一年级"},
				{"value":"二年级"},
				{"value":"三年级"},
				{"value":"四年级"},
				{"value":"五年级"},
				{"value":"六年级"},
				{"value":"七年级"},
				{"value":"八年级"},
				{"value":"九年级"},
			]
		},
		valueField: 'value',
		displayField: 'value',
		value: '全部年级',
		editable: false,
		//padding: '5 0',
		listeners: {
			change: function(cb,newValue){
				var grade = newValue,
					studentName = this.up('window').down('textfield[itemId=search]').getValue().trim();
				this.up('window').onFilter(grade,studentName); 
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
		store: 'Student',
	    columns: [{
			xtype: 'rownumberer',
			width: 45
		},{	
			 text: '姓名',
	         width: 100,
	         sortable: true,
			 menuDisabled: true,
	         dataIndex: 'studentName'
	     }, {
	         text: '性别',
	         width: 40,
	         //sortable: false,
			 menuDisabled: true,
	         dataIndex: 'gender'
	     }, {
	         text: '年段',
	         width: 80,
	         //sortable: false,
			 menuDisabled: true,
	         dataIndex: 'grade'	 
	     }, {
	         text: '学校',
	         flex: 1,
	         //sortable: false,
			 menuDisabled: true,
	         dataIndex: 'school',
	         //align: 'right',
	         //renderer: Ext.util.Format.usMoney
	     }, {
	         text: '联系电话',
	         width: 100,
	         //sortable: false,
			 menuDisabled: true,
	         dataIndex: 'phone'		
	     }, {
	         text: '报名注册',
	         width: 60,
			 menuDisabled: true,
	         dataIndex: 'created',
			 renderer : function(val) {
                 return '<span style="color:' + '#cf4c35' + ';">' + val.substr(2,8) + '</span>';
                 return val;
             }, 
 		},{	 
 			menuDisabled: true,
 			sortable: false,
 			xtype: 'actioncolumn',
 			width: 30,
 			items: [{
 				//iconCls: 'add',
 				icon: 'resources/images/my_right_icon.png',
 				tooltip: '报读课程',
 				handler: function(grid, rowIndex, colIndex) {
 					grid.getSelectionModel().select(rowIndex); // 高粱当前选择行？？？不是自动？
 					var rec = grid.getStore().getAt(rowIndex);
 					grid.up('window').onStudy(rec); 
 				}	
 			}]					 		 
	     }],  
  	 	listeners: {
  	 		itemdblclick: function (view, record, row, i, e) {
  	 			this.up('window').onStudy(record);
  	 		},
  	 	},    
	}],
	
	// 报读知识点
	onStudy: function(rec){ 
		this.fireEvent('study', rec);
	},
	
	onFilter: function(grade,studentName){
		var me = this;
		var studentName = new RegExp("/*" + studentName); // 正则表达式
		var store = this.down('grid').getStore();
		store.clearFilter(); // filter is additive
		if(grade != '全部年级' )
			store.filter([
				{property: "grade", value: grade},
				{property: "studentName", value: studentName}, // 姓名模糊查找？？
			]);
		if(grade == '全部年级' )
			store.filter("studentName", studentName);
	}
});