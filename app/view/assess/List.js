Ext.define('Youngshine.view.assess.List' ,{
	extend: 'Ext.window.Window',
    alias : 'widget.assess-list',
	
    requires:[
		'Youngshine.view.assess.New',
    ],

	closable: true,
	modal: true,
    autoShow: true,
	//resizable: false,
	maximizable: true,
	width: 600,
	height: 550,
	layout: 'fit',

    title : '学生测评',

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
		text: '＋新增',
		tooltip: '添加测评',
		//disabled: true,
		//scale: 'medium',
		width: 55,
		handler: function(btn){
			btn.up('window').onNew(); //onAdd是系统保留reserved word
		}
	},{	
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
		store: 'Assess',
	    columns: [{
			xtype: 'rownumberer',
			width: 30
		},{	
			 text: '姓名',
	         flex: 1,
	         sortable: true,
			 menuDisabled: true,
	         dataIndex: 'studentName'
/*	     }, {
	         text: '年级',
	         width: 60,
			 menuDisabled: true,
	         dataIndex: 'grade'	 */
	     }, {
	         text: '测评学科',
	         width: 80,
	         //sortable: false,
			 menuDisabled: true,
	         dataIndex: 'subjectName'
	     }, {
	         text: '学科年级',
	         width: 80,
			 menuDisabled: true,
	         dataIndex: 'gradeName', //来自测评学科
	     }, {
	         text: '学期',
	         width: 80,
			 menuDisabled: true,
	         dataIndex: 'semester', // 要测评的学期：上下
	     }, {
	         text: '测评时间',
	         width: 70,
			 menuDisabled: true,
	         dataIndex: 'created',
			 renderer : function(val) {
                 return '<span style="color:' + '#73b51e' + ';">' + val.substr(2,8) + '</span>';
                 return val;
             }, 	
		},{	 
			menuDisabled: true,
			sortable: false,
			xtype: 'actioncolumn',
			width: 30,
			items: [{
				//iconCls: 'add',
				icon: 'resources/images/my_delete_icon.png',
				tooltip: '删除',
				handler: function(grid, rowIndex, colIndex) {
					grid.getSelectionModel().select(rowIndex); // 高亮
					var rec = grid.getStore().getAt(rowIndex);
					grid.up('window').onDelete(rec); 
				}	
			}]	
		},{	 
			menuDisabled: true,
			sortable: false,
			xtype: 'actioncolumn',
			width: 30,
			items: [{
				//iconCls: 'add',
				icon: 'resources/images/my_right_icon.png',
				tooltip: '测评内容',
				handler: function(grid, rowIndex, colIndex) {
					grid.getSelectionModel().select(rowIndex); // 高亮
					var rec = grid.getStore().getAt(rowIndex);
					grid.up('window').onTopic(rec); 
				}	
			}]			 		 
	     }], 
		 
   	 	listeners: {
   	 		itemdblclick: function (view, record, row, i, e) {
   	 			this.up('window').onTopic(record);
   	 		},
   	 	},      
	}],
	
	onNew: function(){ 
		this.down('grid').getSelectionModel().deselectAll();
		this.fireEvent('addnew');
	},
	onDelete: function(rec){
		var me = this;
		console.log(rec);
		Ext.Msg.confirm('提示','是否删除当前行？',function(btn){
			if(btn == 'yes'){
				me.fireEvent('del',rec);
			}
		});
	},
	
	// 测评的知识点及其题目、成绩
	onTopic: function(rec){ 
		this.fireEvent('topic',rec);
	},
	
	onFilter: function(grade,student){
		var me = this;
		var student = new RegExp("/*" + student); // 正则表达式
		var store = this.down('grid').getStore();
		store.clearFilter(); // filter is additive
		if(grade != '全部年级' )
			store.filter([
				{property: "gradeName", value: grade},
				{property: "studentName", value: student}, // 姓名模糊查找？？
			]);
		if(grade == '全部年级' )
			store.filter("studentName", student);
	}
});