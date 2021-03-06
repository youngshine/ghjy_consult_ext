// 分班排课
Ext.define('Youngshine.view.classes.Pk' ,{
    //extend: 'Ext.grid.Panel',
	extend: 'Ext.window.Window',
    alias : 'widget.classes-pk',

	closable: true,
	modal: true,
    autoShow: true,
	//resizable: false,
	width: 750,
	height: 550,
	maximizable: true,
	//maximized: true,
	layout: 'fit',

    title : '分班排课',

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
						kclistID = field.up('window').down('combo[itemId=kclist]').getValue();
					field.up('window').onFilter(kclistID,studentName); 
				}	
			}
		}
	},{		
		xtype: 'combo',
		width: 150,
		itemId: 'kclist',
		store: 'Kclist',
		valueField: 'kclistID',
		displayField: 'title',
		emptyText: '课程',
		editable: false,
		//padding: '5 0',
		listeners: {
			change: function(cb,newValue){
				var kclistID = newValue,
					studentName = this.up('window').down('textfield[itemId=search]').getValue().trim();
				this.up('window').onFilter(kclistID,studentName); 
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
			text: '学生姓名',
			width: 100,
			sortable: true,
			menuDisabled: true,
			dataIndex: 'studentName'
		},{	
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
				tooltip: '分班',
				handler: function(grid, rowIndex, colIndex) {
					grid.getSelectionModel().select(rowIndex); // 高亮当前选择行？？？不是自动？
					var rec = grid.getStore().getAt(rowIndex);
					//Ext.Msg.alert('Sell', 'Sell ' + rec.get('company'));
					//me.fireEvent('adminEdit');
					grid.up('window').onClasses(rec); 
				}	
			}]	

	    }], 
		
		listeners: {
			itemclick: function( grid, record, item, index, e, eOpts ){
				grid.up('window').onClasses(record);
			}
		}    
	}],

	onClasses: function(rec){ 
		if (rec.data.consultID != localStorage.consultID){
			Ext.Msg.alert('提示','非班级创建人，不能分班！');
			//return;
		}
		this.fireEvent('classes',rec);
	},
	
	onFilter: function(kclistID,studentName){
		var me = this;
		var studentName = new RegExp("/*" + studentName); // 正则表达式
		var store = this.down('grid').getStore();
		store.clearFilter(); // filter is additive
		if(kclistID != null )
			store.filter([
				{property: "kclistID", value: kclistID},
				{property: "studentName", value: studentName}, // 姓名模糊查找？？
			]);
		if(kclistID == null )
			store.filter("studentName", studentName);
	}
});