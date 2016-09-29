Ext.define('Youngshine.view.accnt.Student' ,{ // 公用类find，查找选择学生
	extend: 'Ext.window.Window',
    alias : 'widget.student',

	closable: true,
	modal: true,
    autoShow: false,
	resizable: false,
	width: 450,
	height: 450,
	//autoScroll: true,
	layout: 'fit',
    title : '查找选择全校学生',
	
	parentView: null, //父表单，返回显示选中值
	
	fbar: [{
		xtype: 'combo',
		width: 120,
		itemId: 'schoolsub',
		store: 'Schoolsub',
		valueField: 'schoolsubID',
		displayField: 'fullname',
		emptyText: '选择分校区',
		editable: false,
		//padding: '5 0',
		listeners: {
			change: function(cb,newValue){
				this.up('window').onFetch(); 
			}
		}
	},{
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
					field.up('window').onFetch(); 
				}	
			}
		}
	},'->',{	
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
		store: 'Student',
		columns: [{
			text: '学生姓名',
			width: 100,
			menuDisabled: true,
			dataIndex: 'studentName'
		}, {
			text: '性别',
			width: 40,
			//sortable: false,
			menuDisabled: true,
			dataIndex: 'gender'	 
		}, {
			text: '电话',
			width: 100,
			//sortable: false,
			menuDisabled: true,
			dataIndex: 'phone'	 
		}, {
			text: '年级',
			width: 60,
			//sortable: false,
			menuDisabled: true,
			dataIndex: 'grade'	
		}, {
			text: '分校区',
			flex: 1,
			//sortable: false,
			menuDisabled: true,
			dataIndex: 'schoolsub'		 
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

	onFetch: function(schoolsub,search){
		var me = this;
		this.down('button[action=choose]').setDisabled(true)
		//this.down('grid').getSelectionModel().clearSelections()； // 不选择某行记录
/*		
		console.log(val)
		//var cust_name = this.down('textfield[itemId=cust_name]').getValue();
		var value = new RegExp("/*" + val); // 正则表达式
		console.log(value)
		var store = this.down('grid').getStore();
		store.clearFilter(true)
		store.filter([
			{property: "fullStudent", value: value}, // studypt_name =''为全部，姓名模糊查找？？
		]); */

		var me = this;
		var studentName = me.down('textfield[itemId=search]').getValue().trim(),
			schoolsub = me.down('combo[itemId=schoolsub]').getRawValue()
		
		if(schoolsub == null) schoolsub = ''
			
		var obj = {
			"schoolID": localStorage.schoolID,
			"schoolsub": schoolsub,
			"studentName": studentName, // like % %
		}
		console.log(obj)
		var store = this.down('grid').getStore();
		store.removeAll();
		store.clearFilter()
		store.getProxy().url = Youngshine.app.getApplication().dataUrl + 
			'readStudentListBySearch.php?data='+JSON.stringify(obj) ;
		store.load({ //异步async
			callback: function(records, operation, success){
				console.log(records)
			}   		
		});	
	},
	
	onItemdblclick: function(list, record, item, index){
		var me = this;
		console.log(record)
		this.chooseItem(record)
	},
	// 选择确定，和上面双击选中效果一样
	onSelection: function(rec){ 
		var me = this;
		this.chooseItem(rec);
	},
	onSelectionChange: function(selModel, selections){
		console.log(selections)
		var btnChoose = this.down('button[action=choose]');
		btnChoose.setDisabled(selections==0)
	},

	chooseItem: function(record){
		var me = this; console.log(record.data)
		me.parentView.down('textfield[name=studentName]').setValue(record.data.studentName)
		me.parentView.down('hiddenfield[name=studentID]').setValue(record.data.studentID)
		me.parentView.down('hiddenfield[name=wxID]').setValue(record.data.wxID)
		this.destroy()
	},

});