// 班级的学生
Ext.define('Youngshine.view.classes.Student' ,{
    //extend: 'Ext.grid.Panel',
	extend: 'Ext.window.Window',
    alias : 'widget.classes-student',

	closable: true,
	modal: true,
    autoShow: true,
	resizable: false,
	width: 400,
	height: 400,
	//maximizable: true,
	//maximized: true,
	layout: 'fit',

    title : '班级学生',
	
	parentRecord: null, //父表参数

	fbar: ['->',{	
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
		store: 'ClassesStudent',
	    columns: [{
			xtype: 'rownumberer',
		},{	
			text: '学生姓名',
			flex: 1,
			sortable: true,
			menuDisabled: true,
			dataIndex: 'studentName'
		},{	
			text: '性别',
			width: 40,
			sortable: true,
			menuDisabled: true,
			dataIndex: 'gender'
		},{	 
			menuDisabled: true,
			sortable: false,
			xtype: 'actioncolumn',
			width: 30,
			items: [{
				//iconCls: 'add',
				icon: 'resources/images/my_delete_icon.png',
				tooltip: '退转班',
				handler: function(grid, rowIndex, colIndex) {
					grid.getSelectionModel().select(rowIndex); // 高亮
					var rec = grid.getStore().getAt(rowIndex);
					grid.up('window').onDelete(rec); 
				}	
			}]	
 		 
	     }],     
	}],

	onDelete: function(rec){
		var me = this; console.log(rec)
		if (me.parentRecord.data.consultID != localStorage.consultID){
			Ext.Msg.alert('提示','非班级创建人，不能操作！');
			return;
		}
		
		Ext.Msg.confirm('提示','是否移出当前学生（退班）？',function(btn){
			if(btn == 'yes'){
				me.fireEvent('del',rec,me);
			}
		});
	},

});