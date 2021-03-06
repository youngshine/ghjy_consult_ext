// 课程：大小班
Ext.define('Youngshine.view.accnt.KclistClass' ,{ 
	extend: 'Ext.window.Window',
    alias : 'widget.kclist',
	id: 'multiSelectKclist',

    autoShow: false,
	closable: true,
	modal: true,
	resizable: true,
	frame: true,
	collapsible: true,
	//headerPosition: 'left',
	width: 450,
	height: 400,
	//autoScroll: true,
	layout: 'fit',

	defaultFocus: 'search',
	
    title : '大小班课程（双击选择）',
	//titleAlign: 'center',
	
	parentView: null, //父表单，返回显示选中值
	record: null, // 父表的记录

	fbar: [{
		xtype: 'combo',
		width: 80,
		itemId: 'kmType',
		store: {
			fields: ['value'],
			data : [
				{"value":"数理化"},
				{"value":"语政英"},
				{"value":"史地生"},
				{"value":"艺术"},
			]
		},
		valueField: 'value',
		displayField: 'value',
		editable: true,
		emptyText: '学科类别',
		listeners: {
			change: function(cb,newValue){
				cb.up('window').onFilter(); 
			}
		}
	},{
		xtype: 'textfield',
		width: 100,
		itemId: 'search',
		//fieldLabel: '筛选',
		//labelWidth: 30,
		labelAlign: 'right',
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
		text: '关闭',
		handler: function(btn){
			btn.up('window').close();//hide();
		}	
	}],
	
	items: [{
		xtype: 'grid',
		stripeRows: true,
		store: 'Kclist',
		headerBorders: false,
		//bodyStyle: 'background:#ffe;',
	    viewConfig: {
	        enableTextSelection: false
	    },
		
		columns: [{
			text: '课程名称',
			flex: 1,
			sortable: true,
			menuDisabled: true,
			dataIndex: 'title'
		}, {
			text: '课时',
			width: 40,
			//sortable: false,
			menuDisabled: true,
			dataIndex: 'hour',
			align: 'center'	
		}, {
			text: '金额',
			width: 60,
			//sortable: false,
			menuDisabled: true,
			dataIndex: 'amount',
			align: 'right' 
		}, {
			text: '学科类别',
			width: 60,
			//sortable: false,
			menuDisabled: true,
			dataIndex: 'kmType',		 
		}],
		
		listeners: {
			itemdblclick: function(list, record, item, index){
				this.up('window').onItemdblclick(list, record, item, index);
			},/*
			selectionchange: function(selModel, selections){
				this.up('window').onSelectionChange(selModel, selections);
			} */
		}     
	}],

	
	onFilter: function(val){
		var me = this;
		//this.down('button[action=choose]').setDisabled(true)
		//this.down('grid').getSelectionModel().clearSelections()
		
		var kmType = me.down('combo[itemId=kmType]').getValue(),
			title = me.down('textfield[itemId=search]').getValue().trim();
		title = new RegExp("/*" + title); // 正则表达式，模糊查找
		kmType = new RegExp("/*" + kmType);
		console.log(title)
		var store = this.down('grid').getStore();
		store.clearFilter(true)
		store.filter([
			{property: "title", value: title},
			{property: "kmType", value: kmType}, 
			// studypt_name =''为全部，姓名模糊查找？？
		]);
	},
	onItemdblclick: function(list, record, item, index){
		var me = this; console.log(record)
		list.getStore().remove(record); //store选择的排除，从 检测项目.. 
		var obj = {
			kclistID : record.data.kclistID,
			title: record.data.title, //用于前端显示，不保存到后端
			//unitprice: 0, //单价大小班0
			hour: record.data.hour, // 
			amount: record.data.amount,
		}
		console.log(obj)
		//me.fireEvent('choose',obj, me);
		
		var store = me.parentView.down('grid').getStore()
		console.log(store)
		store.insert(0,obj); //新增记录，0排在最前面
		
		var ys = me.parentView.down('displayfield[name=amount_ys]'),
			ss = me.parentView.down('displayfield[name=amount]')
		
		ys.setValue( parseInt(ys.getValue()) + parseInt(obj.amount) )
		ss.setValue( parseInt(ss.getValue()) + parseInt(obj.amount) )
		
		console.log(ys.getValue())
	},

	initComponent: function(){
		this.callParent()
		this.on('deactivate',function(e){
			this.hide()
		})
	}

});