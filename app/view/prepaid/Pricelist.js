Ext.define('Youngshine.view.prepaid.Pricelist' ,{
    //extend: 'Ext.grid.Panel',
	extend: 'Ext.window.Window',
    alias : 'widget.pricelist',

	closable: true,
	modal: true,
    autoShow: true,
	//resizable: false,
	width: 500,
	height: 350,
	layout: 'fit',

    title : '课程价格表',
	
	fbar: [
		'->',
	{
		xtype: 'button',
		text: '＋添加',
		width: 65,
		disabled: true,
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
		store: 'Pricelist',
	    columns: [{
			xtype: 'rownumberer'
		},{	
			 text: '课程名称',
			flex: 1,
	         sortable: true,
			 menuDisabled: true,
	         dataIndex: 'title'
	     }, {
	         text: '课时',
	         width: 50,
	         //sortable: false,
			 menuDisabled: true,
	         dataIndex: 'hour',
			  align: 'right'
	     }, {
	         text: '金额',
	         width: 50,
	         //sortable: false,
			 menuDisabled: true,
	         dataIndex: 'unitprice',
			 align: 'right'
	     }, {
	         text: '校区',
	         width: 100,
	         //sortable: false,
			 menuDisabled: true,
	         dataIndex: 'schoolName'
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
					grid.up('window').onDelete(rec); 
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
		//this.fireEvent('addnew');
	},
	onEdit: function(rec){ 
		//this.fireEvent('edit',rec);
	},
	onDelete: function(rec){
		var me = this;
		console.log(rec);
		Ext.Msg.confirm('提示','是否删除当前行？',function(btn){
			if(btn == 'yes'){
				//me.fireEvent('del',rec);
			}
		});
	}
});