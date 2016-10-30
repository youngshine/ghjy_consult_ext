// 分班排课
Ext.define('Youngshine.view.one2n.Pk' ,{
    //extend: 'Ext.grid.Panel',
	extend: 'Ext.window.Window',
    alias : 'widget.one2n-pk',

	closable: true,
	modal: true,
    autoShow: true,
	//resizable: false,
	width: 750,
	height: 550,
	maximizable: true,
	//maximized: true,
	layout: 'fit',

    title : '一对N排课',

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
					var title = field.value,
						isClassed = field.up('window').down('combo[itemId=isClassed]').getValue();
					field.up('window').onFilter(title,isClassed); 
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
			// non-modal window
		}
	}],
	
	items: [{
		xtype: 'grid',
		stripeRows: true,
		//allowDeselect: true,
		//selType: 'cellmodel',
		store: 'AccntDetail',
	    columns: [{
			xtype: 'rownumberer',
			width: 35
		}, {
			text: '课程名称',
			flex: 1,
			//sortable: false,
			menuDisabled: true,
			dataIndex: 'title'
		},{	
			text: '课时',
			width: 40,
			sortable: true,
			menuDisabled: true,
			dataIndex: 'hour',
			align: 'center'
		},{	
			text: '学生姓名',
			width: 100,
			sortable: true,
			menuDisabled: true,
			dataIndex: 'studentName'
		},{	
			text: '购买日期',
			width: 100,
			sortable: true,
			menuDisabled: true,
			dataIndex: 'accntDate'			 
		},{	 
			menuDisabled: true,
			sortable: false,
			xtype: 'actioncolumn',
			width: 30,
			items: [{
				//iconCls: 'add',
				icon: 'resources/images/my_right_icon.png',
				tooltip: '排课',
				handler: function(grid, rowIndex, colIndex) {
					grid.getSelectionModel().select(rowIndex); // 高亮当前选择行？？？不是自动？
					var rec = grid.getStore().getAt(rowIndex);
					//Ext.Msg.alert('Sell', 'Sell ' + rec.get('company'));
					//me.fireEvent('adminEdit');
					grid.up('window').onTeacher(rec); 
				}	
			}]	

	    }],
		
		listeners: {
			itemclick: function( grid, record, item, index, e, eOpts ){
				grid.up('window').onTeacher(record);
			}
		}       
	}],

	onTeacher: function(rec){ 
		console.log(rec.data.consultID,localStorage.consultID)
		if (rec.data.consultID != localStorage.consultID){
			Ext.Msg.alert('提示','非创建人，不能修改！');
			return;
		}
		this.fireEvent('teacher',rec);
	},
	
	onFilter: function(val){
		var me = this; 
		var title = new RegExp("/*" + val); // 正则表达式
		var store = this.down('grid').getStore();
		store.clearFilter(); // filter is additive
		store.filter("title", title);
	}
});