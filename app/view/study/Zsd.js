// 公用类find，查找 知识点
Ext.define('Youngshine.view.study.Zsd' ,{ 
	extend: 'Ext.window.Window',
    alias : 'widget.zsd',
	id: 'multiSelectZsd',

    autoShow: false,
	closable: true,
	modal: false,
	resizable: true,
	frame: true,
	collapsible: true,
	//headerPosition: 'left',
	width: 350,
	height: 350,
	//autoScroll: true,
	layout: 'fit',
	
    style: {
        background: '#FDF5E6'  
    }, 
	defaultFocus: 'subject',
	
    title : '知识点（双击选择）',
	//titleAlign: 'center',
	
	record: null, // 父表的记录

	fbar: [{
		xtype: 'combo',
		width: 100,
		itemId: 'subject',
		store: {
			fields: ['value'],
			data : [
				{"value":"选择学科"},
				{"value":"数学"},
				{"value":"物理"},
				{"value":"化学"},
				{"value":"科学"},
			]
		},
		valueField: 'value',
		displayField: 'value',
		value: '选择学科',
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
	},'-',{
		xtype: 'textfield',
		width: 100,
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
		text: '关闭',
		handler: function(btn){
			btn.up('window').hide();//close();
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
			text: '年级',
			width: 60,
			//sortable: false,
			menuDisabled: true,
			dataIndex: 'gradeName'	
		}, {
			text: '课时',
			width: 40,
			//sortable: false,
			menuDisabled: true,
			dataIndex: 'times',
			align: 'right' 		 
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

	// 读取某个学科知识点
	onFetch: function(val){
        var store = Ext.getStore('Zsd');
		store.removeAll();
		store.clearFilter();
		var obj = {
			"subject": val
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
	},
	onItemdblclick: function(list, record, item, index){
		var me = this;
		list.getStore().remove(record); //store选择的排除，从 检测项目.. 
		var obj = {
			zsdID : record.data.zsdID,
			zsdName: record.data.zsdName, //用于前端显示，不保存到后端
			subjectID: record.data.subjectID,
			subjectName: record.data.subjectName,
			gradeName: record.data.gradeName,
			fee: record.data.fee, // unitprice
			times: record.data.times,
			prepaidID : me.record.get('prepaidID'), // 购买付款id
			studentID : me.record.get('studentID'), //当前学生
		}
		console.log(obj)
		me.fireEvent('choose',obj, me);
	},

	initComponent: function(){
		this.callParent()
		this.on('deactivate',function(e){
			this.hide()
		})
	}

});