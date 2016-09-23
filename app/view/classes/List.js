Ext.define('Youngshine.view.classes.List' ,{
    //extend: 'Ext.grid.Panel',
	extend: 'Ext.window.Window',
    alias : 'widget.classes',

	closable: true,
	modal: true,
    autoShow: true,
	//resizable: false,
	width: 850,
	height: 550,
	maximizable: true,
	//maximized: true,
	layout: 'fit',

    title : '大小班级',

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
						accntType = field.up('window').down('combo[itemId=accntType]').getValue();
					field.up('window').onFilter(accntType,studentName); 
				}	
			}
		}
	},{		
		xtype: 'combo',
		width: 100,
		itemId: 'schoolsub',
		store: 'Schoolsub',
		valueField: 'schoolsubID',
		displayField: 'schoolsubName',
		//value: '全部年级',
		//editable: false,
		//padding: '5 0',
		listeners: {
			change: function(cb,newValue){
				var accntType = newValue,
					studentName = this.up('window').down('textfield[itemId=search]').getValue().trim();
				this.up('window').onFilter(accntType,studentName); 
			}
		}

	},'->',{	
		xtype: 'button',
		text: '＋新增',
		tooltip: '添加班级',
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
			// non-modal window
		}
	}],
	
	items: [{
		xtype: 'grid',
		stripeRows: true,
		//allowDeselect: true,
		//selType: 'cellmodel',
		store: 'Classes',
	    columns: [{
			xtype: 'rownumberer',
			width: 35
		},{	
			 text: '班级名称',
			 flex: 1,
	         sortable: true,
			 menuDisabled: true,
	         dataIndex: 'title'
	     }, {
	         text: '课程',
	         width: 120,
	         //sortable: false,
			 menuDisabled: true,
	         dataIndex: 'kcTitle'
	     }, {
	         text: '开课日期',
	         width: 80,
			 menuDisabled: true,
	         dataIndex: 'beginDate'
	     }, {
	         text: '定员',
	         width: 40,
	         //sortable: false,
			 menuDisabled: true,
	         dataIndex: 'persons',
			 align: 'center'	
	     }, {
	         text: '现员',
	         width: 40,
	         //sortable: false,
			 menuDisabled: true,
	         dataIndex: 'enroll',
			 align: 'center' 
	     }, {
	         text: '上课时间',
	         width: 120,
	         //sortable: false,
			 menuDisabled: true,
	         dataIndex: 'timely_list',	
	     }, {
	         text: '任课教师',
	         width: 60,
			 menuDisabled: true,
	         dataIndex: 'teacherName',
	     }, {
	         text: '教师主管',
	         width: 60,
			 menuDisabled: true,
	         dataIndex: 'teacherName_chief',
	     }, {
	         text: '分校区',
	         width: 60,
			 menuDisabled: true,
	         dataIndex: 'fullname',
		},{	 
			menuDisabled: true,
			sortable: false,
			xtype: 'actioncolumn',
			width: 30,
			items: [{
				//iconCls: 'add',
				icon: 'resources/images/my_edit_icon.png',
				tooltip: '修改',
				handler: function(grid, rowIndex, colIndex) {
					grid.getSelectionModel().select(rowIndex); // 高亮当前选择行？？？不是自动？
					var rec = grid.getStore().getAt(rowIndex);
					//Ext.Msg.alert('Sell', 'Sell ' + rec.get('company'));
					//me.fireEvent('adminEdit');
					grid.up('window').onEdit(rec); 
				}	
			}]	
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
				tooltip: '班级学生',
				handler: function(grid, rowIndex, colIndex) {
					grid.getSelectionModel().select(rowIndex); // 高亮
					var rec = grid.getStore().getAt(rowIndex);
					grid.up('window').onStudent(rec); 
				}	
			}]	
 		 
	     }],     
	}],

	onStudent: function(rec){ 
		var me = this;
		this.fireEvent('student',rec,me);
	},	
	onNew: function(){ 
		this.down('grid').getSelectionModel().deselectAll();
		this.fireEvent('addnew');
	},
	onEdit: function(rec){ 
		if (rec.data.consultID != localStorage.consultID){
			Ext.Msg.alert('提示','非班级创建人，不能修改！');
			return;
		}
		this.fireEvent('edit',rec);
	},
	onDelete: function(rec){
		var me = this;
		if (rec.data.consultID != localStorage.consultID){
			Ext.Msg.alert('提示','非班级创建人，不能删除！');
			return;
		}
		
		Ext.Msg.confirm('提示','是否删除当前行？',function(btn){
			if(btn == 'yes'){
				me.fireEvent('del',rec);
			}
		});
	},
	
	onFilter: function(accntType,studentName){
		var me = this;
		var studentName = new RegExp("/*" + studentName); // 正则表达式
		var store = this.down('grid').getStore();
		store.clearFilter(); // filter is additive
		if(accntType != '' )
			store.filter([
				{property: "accntType", value: accntType},
				{property: "studentName", value: studentName}, // 姓名模糊查找？？
			]);
		if(accntType == '' )
			store.filter("studentName", studentName);
	}
});