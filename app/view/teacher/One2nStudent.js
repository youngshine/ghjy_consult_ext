// 某个教师的一对N学生
Ext.define('Youngshine.view.teacher.One2nStudent' ,{
    //extend: 'Ext.grid.Panel',
	extend: 'Ext.window.Window',
    alias : 'widget.one2n-student',

	closable: true,
	modal: true,
    autoShow: true,
	resizable: false,
	width: 400,
	height: 400,
	//maximizable: true,
	//maximized: true,
	layout: 'fit',

    title : '一对N学生',
	
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
		store: 'One2nStudent',
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
			text: '上课时间',
			width: 180,
			sortable: true,
			menuDisabled: true,
			dataIndex: 'timely_list'
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
			Ext.Msg.alert('提示','咨询主管权限');
			//return;
		}
		
		Ext.Msg.confirm('提示','是否把学生移出一对多（重新排课或退费）？',function(btn){
			if(btn == 'yes'){
				me.fireEvent('del',rec,me);
			}
		});
	},

});