// 周几某个时间段的学科教师 课程及人数（1对4最多）
Ext.define('Youngshine.view.study.Teacher' ,{ 
	extend: 'Ext.window.Window',
    alias : 'widget.teacher',

	closable: true,
	modal: true,
    autoShow: false,
	resizable: false,
	width: 350,
	height: 250,
	//autoScroll: true,
	layout: 'fit',
    title : '课程表（双击选择教师）',
	
	record: null, // 父表记录的传递
/*	
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
	}], */
	
	items: [{
		xtype: 'grid',
		stripeRows: true,
		store: 'Kcb',
		columns: [{
			text: '学科教师',
			width: 70,
			sortable: true,
			menuDisabled: true,
			dataIndex: 'teacherName'
		}, {
			text: '课程（知识点）',
			flex: 1,
			//sortable: false,
			menuDisabled: true,
			dataIndex: 'zsdName'
		}, {
			text: '人数',
			width: 30,
			//sortable: false,
			menuDisabled: true,
			dataIndex: 'persons',	
			align: 'center'	 
		}],
		
		listeners: {
			itemdblclick: function(list, record, item, index){
				this.up('window').onItemdblclick(list, record, item, index);
			},
			selectionchange: function(selModel, selections){
				this.up('window').onSelectionChange(selModel, selections);
			}
		}     
	}],

	onItemdblclick: function(list, record, item, index){
		var me = this;
		console.log(record)
		this.chooseItem(record)
	},
	// 和上面双击选中效果一样
	onSelection: function(rec){ 
		var me = this;
		this.chooseItem(rec);
	},
	
	onSelectionChange: function(selModel, selections){
		var btnChoose = this.down('button[action=choose]');
		//btnChoose.setDisabled(false)
	},

	chooseItem: function(rec){
		var me = this;
		console.log(rec); 
		console.log(me.record)
		if (rec.data.zsdName != null && rec.data.zsdName != me.record.data.zsdName){
			Ext.Msg.alert('提示','课程（知识点）不同，不能排课');
			return;
		}
		if (rec.data.persons > 4){
			Ext.Msg.alert('提示','超过1对4！');
			return;
		}
		var win = Youngshine.getApplication().getController('Study').getStudykcb();
		win.down('textfield[name=teacherName]').setValue(rec.data.teacherName)
		win.down('hiddenfield[name=teacherID]').setValue(rec.data.teacherID)
		// 安排教师，才能点击保存
		win.down('button[action=save]').setDisabled(false); 
		this.destroy()
	},
});