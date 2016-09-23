// 班级的学生
Ext.define('Youngshine.view.classes.Classes' ,{
    //extend: 'Ext.grid.Panel',
	extend: 'Ext.window.Window',
    alias : 'widget.classes-classes',

	closable: true,
	modal: true,
    autoShow: true,
	resizable: false,
	width: 700,
	height: 350,
	//maximizable: true,
	//maximized: true,
	layout: 'fit',

    title : '课程对应班级',
	
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
		store: 'Classes',
	    columns: [{
			xtype: 'rownumberer',
		},{	
			text: '班级名称',
			flex: 1,
			sortable: true,
			menuDisabled: true,
			dataIndex: 'title'
		},{	
			text: '上课周期',
			width: 120,
			sortable: true,
			menuDisabled: true,
			dataIndex: 'timely_list'
		},{	
			text: '定员',
			width: 40,
			sortable: true,
			menuDisabled: true,
			dataIndex: 'persons'
		},{	
			text: '现招',
			width: 40,
			sortable: true,
			menuDisabled: true,
			dataIndex: 'enroll'
		},{	
			text: '教师',
			width: 80,
			sortable: true,
			menuDisabled: true,
			dataIndex: 'teacherName'
		},{	
			text: '分校区',
			width: 100,
			sortable: true,
			menuDisabled: true,
			dataIndex: 'fullname'
 		 
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

		Ext.Msg.confirm('提示','是否分配到选中班级？',function(btn){
			if(btn == 'yes'){
				var obj = {
					classID: record.data.classID,
					studentID: me.parentRecord.data.studentID,
					accntdetailID: me.parentRecord.data.accntdetailID //更改状态
			    }
				console.log(obj)
				me.fireEvent('choose',obj,me);
			}
		});
		
	},
});