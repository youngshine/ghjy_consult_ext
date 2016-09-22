Ext.define('Youngshine.view.teacher.List' ,{
    //extend: 'Ext.grid.Panel',
	extend: 'Ext.window.Window',
    alias : 'widget.teacher-list',
	
    requires:[
		'Youngshine.view.teacher.New',
		'Youngshine.view.teacher.Edit',
    ],

	closable: true,
	modal: true,
    autoShow: true,
	//resizable: false,
	width: 550,
	height: 350,
	layout: 'fit',

    title : '教师列表',
	
	fbar: [
		'->',
	{
		xtype: 'button',
		text: '＋添加',
		width: 65,
	    handler: function(btn){
			btn.up('window').onNew(); //onAdd是系统保留reserved word
	    }
	},{
		
		xtype: 'button',
		text: '关闭',
		width: 65,
	    handler: function(btn){
			btn.up('window').close();
	    }
	}],

	items: [{
		xtype: 'grid',
		stripeRows: true,
		store: 'Teacher',
	    columns: [{
			xtype: 'rownumberer'
		},{	
			 text: '姓名',
	         width: 100,
	         sortable: true,
			 menuDisabled: true,
	         dataIndex: 'teacherName'
	     }, {
	         text: '学科',
	         width: 50,
	         //sortable: false,
			 menuDisabled: true,
	         dataIndex: 'subjectName'
	     }, {
	         text: '校区',
	         width: 100,
	         //sortable: false,
			 menuDisabled: true,
	         dataIndex: 'schoolName'
	     }, {
	         text: '备注',
	         flex: 1,
	         sortable: false,
			 menuDisabled: true,
	         dataIndex: 'note'
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
					//var me = this;
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
					//var me = this;
					var rec = grid.getStore().getAt(rowIndex);
					//Ext.Msg.alert('Sell', 'Sell ' + rec.get('company'));
					//Ext.Msg.confirm('提示','是否当前操作员？',function(btn){
					//	if(btn == 'yes'){
							//me.fireEvent('adminDelete');
							grid.up('window').onDelete(rec); 
					//	}
					//});
				}	
			}]				 		 
	     }],     
	}],
	
	listeners: {
		itemdblclick: function (view, record, row, i, e) {
			//this.up('mysearch').onItemdblclick(view, record, row, i, e);
			//this.fireEvent('editUser',view,record);
			this.onItemdblclick(view,record);
		},
		selectionchange: function(selModel, selections){
			this.onSelect(selModel, selections)
		}
	},

	onNew: function(){ 
		this.fireEvent('addnew');
	},
	onEdit: function(rec){ 
		this.fireEvent('edit',rec);
	},
	/* 
	onItemdblclick: function(view,record){
		this.fireEvent('editUser',view,record);
	},
	onSelect: function(selModel, selections){
		//this.fireEvent('selectUser',selModel, selections);
		var delBut = this.down('button[action=delete]');
        delBut.setDisabled(false);
	}, */

	onDelete: function(rec){
		var me = this;
		console.log(rec);
		Ext.Msg.confirm('提示','是否删除当前行？',function(btn){
			if(btn == 'yes'){
				me.fireEvent('del',rec);
			}
		});
	}
});