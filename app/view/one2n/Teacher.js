// 一对N教师列表，有设定一对一上课时间的
Ext.define('Youngshine.view.one2n.Teacher' ,{
    //extend: 'Ext.grid.Panel',
	extend: 'Ext.window.Window',
    alias : 'widget.one2n-teacher',

	closable: true,
	modal: true,
    autoShow: true,
	resizable: false,
	width: 700,
	height: 400,
	//maximizable: true,
	//maximized: true,
	layout: 'fit',

    title : '一对N教师列表',
	
	parentRecord: null, //父表参数

	fbar: ['->',{	
		xtype: 'button',
		text: '确定',
		action: 'choose',
		disabled: true,
		handler: function(btn){
			var records = btn.up('window').down('grid').getSelectionModel().getSelection();
			console.log(records[0])
			btn.up('window').onSelection(records[0]);
		}
	},{
		xtype: 'button',
		text: '取消',
		action: 'close',	
		handler: function(btn){
			btn.up('window').destroy();
		}
	}],
	
	items: [{
		xtype: 'grid',
		stripeRows: true,
		//allowDeselect: true,
		//selType: 'cellmodel',
		store: 'Teacher',
	    columns: [{
			xtype: 'rownumberer',
		},{	
			text: '教师姓名',
			width: 80,
			sortable: true,
			menuDisabled: true,
			dataIndex: 'teacherName'
		},{	
			text: '性别',
			width: 30,
			sortable: true,
			menuDisabled: true,
			dataIndex: 'gender'
		},{	
			text: '学科',
			width: 40,
			sortable: true,
			menuDisabled: true,
			dataIndex: 'subjectName'
		},{	
			text: '一对N上课时间列表',
			flex: 1,
			sortable: true,
			menuDisabled: true,
			dataIndex: 'timely_list_one2n'	
		},{	 
			menuDisabled: true,
			sortable: false,
			xtype: 'actioncolumn',
			width: 30,
			items: [{
				//iconCls: 'add',
				icon: 'resources/images/my_edit_icon.png',
				tooltip: '调整上课时间',
				handler: function(grid, rowIndex, colIndex) {
					grid.getSelectionModel().select(rowIndex); // 高亮当前选择行？？？不是自动？
					var rec = grid.getStore().getAt(rowIndex);
					//Ext.Msg.alert('Sell', 'Sell ' + rec.get('company'));
					//me.fireEvent('adminEdit');
					grid.up('window').onTimely(rec); 
				}	
			}]	 
	    }],  
		 
 		listeners: {
 			selectionchange: function(selModel, selections){
 				this.up('window').onSelectionChange(selModel, selections);
 			}
 		}     
	}],

	// 和上面双击选中效果一样
	onSelection: function(rec){ 
		var me = this;
		this.chooseItem(rec);
	},
	
	onSelectionChange: function(selModel, selections){
		var btnChoose = this.down('button[action=choose]');
		btnChoose.setDisabled(false)
	},

	chooseItem: function(record){
		var me = this; console.log(record.data)

		var teacherName = record.data.teacherName,
			timely_list = record.data.timely_list_one2n.trim()
		if (timely_list == ''){	
			Ext.Msg.alert('提示','不能没有上课时间！');
			return;
		}

		Ext.Msg.confirm('询问','教师：'+teacherName + '<br>时间：' + timely_list + 
			'<hr>确认排课？',function(btn){
			if(btn == 'yes'){
				var obj = {
					teacherID: record.data.teacherID,
					timely_list: timely_list,
					studentID: me.parentRecord.data.studentID,
					accntdetailID: me.parentRecord.data.accntdetailID //更改状态
			    }
				console.log(obj)
				me.fireEvent('choose',obj,me.parentRecord,me);
			}
		});
		
	},
	
	// 调整上课时间，设定的列表，只能减少，不能增加
	onTimely: function(record){
		var me = this;
		var win = Ext.create('Youngshine.view.one2n.Kcb');
		//win.down('form').loadRecord(record); //binding data
		win.parentRecord = record // 传递参数
		win.parentView = me 
		
		// 上课周期列表数组，list.store
		var timely_list = record.data.timely_list_one2n.trim()
		if(timely_list == ''){
			return false
		}
		timely_list = record.data.timely_list_one2n.split(',')
		console.log(timely_list)
		var timely = [];
		for (var i = 0; i < timely_list.length; i++) {
			//timely.push( {"timely":timely_list[i]}  )
			var w = timely_list[i].substr(0,2),
				h = timely_list[i].substr(2,2),
				m = timely_list[i].substr(5,2)
			timely.push( {"w":w,"h":h,"m":m}  )
		}
		console.log(timely);
		win.down('grid').getStore().loadData(timely)

	},
});