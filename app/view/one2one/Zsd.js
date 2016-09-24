// 一对一课程，选择知识点
Ext.define('Youngshine.view.one2one.Zsd' ,{ 
	extend: 'Ext.window.Window',
    alias : 'widget.zsd',
	id: 'multiSelectZsd',

    autoShow: false,
	closable: true,
	modal: true,
	resizable: true,
	frame: true,
	collapsible: true,
	//headerPosition: 'left',
	width: 400,
	height: 400,
	//autoScroll: true,
	layout: 'fit',
	
	defaultFocus: 'subject',
	
    title : '添加报读知识点',
	//titleAlign: 'center',
	
	parentRecord: null, // 父表的记录
	parentView: null,

	fbar: [{
		xtype: 'combo',
		width: 80,
		itemId: 'subject',
		store: 'Subject',
		valueField: 'subjectID',
		displayField: 'subjectName',
		emptyText: '选择学科',
		editable: true,
		//autoSelect: true,
		selectOnFocus: true,
		//fieldLabel: '选择科目',
		//labelWidth: 60,	
		//labelAlign: 'right',
		listeners: {
			change: function(cb,newValue){
				var subject = newValue;
				this.up('window').onFetch(subject);
			}
		}
	},{
		xtype: 'textfield',
		width: 80,
		itemId: 'zsd',
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
		text: '关闭',
		handler: function(btn){
			btn.up('window').close();//hide();
		}	
	}],
	
	items: [{
		xtype: 'grid',
		stripeRows: true,
		store: 'Zsd',
		headerBorders: false,
		//bodyStyle: 'background:#ffe;',
	    viewConfig: {
	        enableTextSelection: false
	    },
		
		columns: [{
			text: '知识点',
			flex: 1,
			sortable: true,
			menuDisabled: true,
			dataIndex: 'zsdName'
		}, {
			text: '课时',
			width: 40,
			//sortable: false,
			menuDisabled: true,
			dataIndex: 'times',
			align: 'center' 
		}, {
			text: '年级',
			width: 60,
			//sortable: false,
			menuDisabled: true,
			dataIndex: 'gradeName'			 
		}],
		
		listeners: {
			itemdblclick: function(list, record, item, index){
				//this.up('window').onItemdblclick(list, record, item, index);
			},
			selectionchange: function(selModel, selections){
				this.up('window').onSelectionChange(selModel, selections);
			},
		}     
	}],

	// 读取某个学科知识点
	onFetch: function(val){
        var store = Ext.getStore('Zsd');
		store.removeAll();
		store.clearFilter();
		var obj = {
			"subjectID": val
		}
		var url = Youngshine.getApplication().dataUrl + 
			'readZsdList.php?data='+ JSON.stringify(obj); ;
		store.getProxy().url = url;
        store.load({
            callback: function(records, operation, success) {
				//console.log(records);
            },
            scope: this
        }); // end store知识点
	},
	
	onFilter: function(val){
		var me = this;
		//this.down('button[action=choose]').setDisabled(true)
		//this.down('grid').getSelectionModel().clearSelections()
		
		console.log(val)
		//var cust_name = this.down('textfield[itemId=cust_name]').getValue();
		var value = new RegExp("/*" + val); // 正则表达式
		console.log(value)
		var store = this.down('grid').getStore();
		store.clearFilter(true)
		store.filter([
			{property: "zsdName", value: value}
			//{property: "fullZsd", value: value}, // studypt_name =''为全部，姓名模糊查找？？
		]);
	}, /*
	onItemdblclick: function(list, record, item, index){
		var me = this;
		list.getStore().remove(record); //store选择的排除，从 检测项目.. 
		var obj = {
			zsdID : record.data.zsdID,
			zsdName: record.data.zsdName, //用于前端显示，不保存到后端
			subjectID: record.data.subjectID,
			subjectName: record.data.subjectName,
			gradeName: record.data.gradeName,
			times: record.data.times,
			accntdetailID : me.parentRecord.get('accntdetailID'), // 对应购买课程
			studentID : me.parentRecord.get('studentID'), //当前学生
		}
		console.log(obj)
		me.fireEvent('choose',obj, me);
	}, */
	
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
		var me = this;
		
		var obj = {
			zsdID : record.data.zsdID,
			zsdName: record.data.zsdName, //用于前端显示，不保存到后端
			subjectID: record.data.subjectID,
			subjectName: record.data.subjectName,
			gradeName: record.data.gradeName,
			times: record.data.times,
			accntdetailID : me.parentRecord.get('accntdetailID'), // 对应购买课程
			studentID : me.parentRecord.get('studentID'), //当前学生
		}
		console.log(obj)
		me.fireEvent('choose',obj, me);
		
		me.down('grid').getStore().remove(record); //store选择的排除
	},

	initComponent: function(){
		this.callParent()
		this.on('deactivate',function(e){
			this.hide()
		})
	}

});