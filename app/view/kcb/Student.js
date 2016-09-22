// 待排课的学生列表：就是尚未分配教师teacherID? 无相应study-kcb记录？
Ext.define('Youngshine.view.kcb.Student' ,{
    //extend: 'Ext.grid.Panel',
	extend: 'Ext.window.Window',
    alias : 'widget.student-kcb',
	
    requires:[
		'Youngshine.view.kcb.Kcb',//收费单
    ],

	closable: true,
	modal: true,
    autoShow: true,
	//resizable: false,
	width: 700,
	height: 500,
	layout: 'fit',

    title : '待排课的学生',

	fbar: [{
		xtype: 'combo',
		width: 100,
		itemId: 'grade',
		store: {
			fields: ['value'],
			data : [
				{"value":"全部年段"},
				{"value":"初一"},
				{"value":"初二"},
				{"value":"初三"},
				{"value":"高一"},
				{"value":"高二"},
				{"value":"高三"},
			]
		},
		valueField: 'value',
		displayField: 'value',
		value: '全部年段',
		editable: false,
		padding: '5 0',
		listeners: {
			change: function(cb,newValue){
				var grade = newValue,
					studentName = this.up('window').down('textfield[itemId=search]').getValue().trim();
				this.up('window').onFilter(grade,studentName); 
			}
		}
	},{
		xtype: 'splitter'
	},{
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
 		},{	 
 			menuDisabled: true,
 			sortable: false,
 			xtype: 'actioncolumn',
 			width: 30,
 			items: [{
 				//iconCls: 'add',
 				icon: 'resources/images/my_right_icon.png',
 				tooltip: '收费',
 				handler: function(grid, rowIndex, colIndex) {
 					grid.getSelectionModel().select(rowIndex); // 高粱当前选择行？？？不是自动？
 					var rec = grid.getStore().getAt(rowIndex);
 					grid.up('window').onKcb(rec); 
 				}	
 			}]					 		 
	     }],
		 
 	 	listeners: {
 	 		itemdblclick: function (view, record, row, i, e) {
 	 			//this.up('mysearch').onItemdblclick(view, record, row, i, e);
 	 			//this.fireEvent('editUser',view,record);
 	 			this.up('window').onKcb(record);
 	 		},
 	 		selectionchange: function(selModel, selections){
 	 			//this.up('window').onSelect(selModel, selections)
 	 		}
 	 	},      
	}],
	
	// 尚未排课的课程（知识点）
	onKcb: function(rec){ 
		this.fireEvent('kcb', rec);
	},
	
	onFilter: function(grade,studentName){
		var me = this;
		var studentName = new RegExp("/*" + studentName); // 正则表达式
		var store = this.down('grid').getStore();
		store.clearFilter(); // filter is additive
		if(grade != '全部年段' )
			store.filter([
				{property: "grade", value: grade},
				{property: "studentName", value: studentName}, // 姓名模糊查找？？
			]);
		if(grade == '全部年段' )
			store.filter("studentName", studentName);
	}
});