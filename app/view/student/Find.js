// 公用类find，查找选择学生
Ext.define('Youngshine.view.student.Find' ,{ 
	extend: 'Ext.window.Window',
    alias : 'widget.student-find',

	closable: true,
	modal: true,
    autoShow: false,
	resizable: false,
	width: 350,
	height: 350,
	//autoScroll: true,
	layout: 'fit',
    title : '查找选择学生',
	
	oldWin: null, //调用的父窗口，返回用 
	
	fbar: [{
		xtype: 'textfield',
		width: 100,
		itemId: 'title',
		emptyText: '搜索...',
		//padding: '5 5',
		enableKeyEvents: true,
		listeners: {
			keypress: function(field,e){
				console.log(e.getKey())
				if(e.getKey()=='13'){ //按Enter
					//var cust_name = field.value; 
					field.up('window').onFilter(field.value); 
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
			text: '姓名',
			width: 70,
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
			width: 70,
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
			text: '学校',
			width: 100,
			//sortable: false,
			menuDisabled: true,
			dataIndex: 'school'		 
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

	onFilter: function(val){
		var me = this;
		this.down('button[action=choose]').setDisabled(true)
		this.down('grid').getSelectionModel().clearSelections()
		
		console.log(val)
		var value = new RegExp("/*" + val); // 正则表达式，模糊查找
		console.log(value)
		var store = this.down('grid').getStore();
		store.clearFilter(true)
		store.filter([
			{property: "studentName", value: value}
		]);
	},
	onItemdblclick: function(list, record, item, index){
		var me = this;
		console.log(record)
		this.chooseItem(record)
		/*
		var view = Youngshine.getApplication().getController('Exam').getExamedit();
		view.down('textfield[name=title]').setValue(record.data.title)
		view.down('hiddenfield[name=mb_id]').setValue(record.data.mb_id)
		this.destroy()  */
		//list.getStore().remove(record); //store选择的排除，从 检测项目.. 再次进入后，恢复正常
		//this.fireEvent('customerfindItemdblclick', record, this.src, me); //src: 返回父窗口的参数
		//console.log(this.src)
		//list.getStore().remove(record); //store选择的排除，从 检测项目.. 再次进入后，恢复正常
		//this.down('grid').getStore().remove(record);
	},
	// 和上面双击选中效果一样
	onSelection: function(rec){ 
		var me = this;
		this.chooseItem(rec);
		/*)
		var view = Youngshine.getApplication().getController('Exam').getExamedit();
		view.down('textfield[name=title]').setValue(rec.data.title)
		view.down('hiddenfield[name=mb_id]').setValue(rec.data.mb_id)
		this.destroy() */
		//var fatherRecord = this.fatherRecord; //父窗口检测项目表格当前行，才能更新数据 rec是新开窗口标准表格
		//this.down('grid').getStore().remove(rec); //store选择的排除，从 检测项目.. 再次进入后，恢复正常
		//this.fireEvent('customerfindSelection', rec, this.src, me); //添加检测项目是共用类，必须指定谁调用src = this.xtype参数
	},
	
	onSelectionChange: function(selModel, selections){
		var btnChoose = this.down('button[action=choose]');
		btnChoose.setDisabled(false)
	},

	chooseItem: function(rec){
		var me = this; console.log(rec.data)
		//var win = Youngshine.getApplication().getController('Prepaid').getPrepaidnew();
		me.oldWin.down('textfield[itemId=studentName]').setValue(rec.data.studentName)
		me.oldWin.down('hiddenfield[itemId=studentID]').setValue(rec.data.studentID)
		me.oldWin.down('displayfield[itemId=grade]').setValue(rec.data.grade)
		
		if(me.oldWin.down('displayfield[itemId=coupon]')){
			me.oldWin.down('displayfield[itemId=coupon]').setValue(rec.data.coupon)
		}
		
		this.destroy()
	},

});