Ext.define('Youngshine.view.accnt.Edit', {
    extend: 'Ext.window.Window',
    alias : 'widget.accnt-edit',
	id: 'winAccntEdit',
	
    autoShow: true,
    modal: true,
	resizable: false,
	closable: false,
    //layout: 'fit',
	width: 600,
	//height: 300,
	title : '修改课程销售单',

    fbar : [{
    	text: '＋添加课程明细',
		handler: function(btn){
			btn.up('window').onAddrow();
		},
		disabled: true
    },'->',{
		text: '保存',
		handler: function(btn){
			btn.up('window').onSave();
		}
	},{
		text: '取消',
		handler: function(btn){
			btn.up('window').destroy();
			//this.close();
		}
	}],	
	
	items: [{
		xtype: 'form',
		bodyPadding: 10,
		fieldDefaults: {
			labelWidth: 85,
			labelAlign: 'right',
			anchor: '100%'
		},
		items: [{
			xtype: 'radiogroup',
	        fieldLabel: '缴费类型',
			itemId: 'accntType',
	        // Arrange radio buttons into two columns, distributed vertically
	        columns: 4,
	        //vertical: true,
	        items: [
	            { boxLabel: '大小班', name: 'wl', inputValue: '1' },
	            { boxLabel: '一对一', name: 'wl', inputValue: '2' },
	            { boxLabel: '退费退班', name: 'wl', inputValue: '3' }
	        ],
			disabled: true	
		},{
			xtype: 'textfield',
			name : 'studentName',
			fieldLabel: '姓名',
			readOnly: true,
			emptyText: '选择全校学生',
			listeners: {
		        click: {
		            element: 'el', 
		            fn: function(e,opts){ 					
						Ext.getCmp('winAccntNew').onStudent(e,opts)
					},
		        },	
		    },
			disabled: true
		},{
			xtype: 'hiddenfield',
			name : 'studentID',
		},{	
			xtype: 'hiddenfield',
			name: 'wxID', //用于发模版消息
		},{
			xtype: 'datefield',
            fieldLabel: '日期',
			format: 'Y-m-d',
            name: 'accntDate',
            allowBlank: false,
			//value: new Date()	
			disabled: true
		},{
			xtype: 'radiogroup',
	        fieldLabel: '付款方式',
			itemId: 'payment',
	        // Arrange radio buttons into two columns, distributed vertically
	        //columns: 2,
	        //vertical: true,
	        items: [
	            { boxLabel: '现金', name: 'pay', inputValue: '1' },
	            { boxLabel: '刷卡', name: 'pay', inputValue: '2' },
	            { boxLabel: '微信', name: 'pay', inputValue: '3' },
				{ boxLabel: '支付宝', name: 'pay', inputValue: '4' }
	        ],
			disabled: true
		},{
			xtype: 'displayfield',
			name: 'amount_ys',
			fieldLabel: '课程合计金额',
			value: 0
		},{
			xtype: 'displayfield',
			name: 'discount',
			fieldLabel: '打折(元)',
		},{
			xtype: 'displayfield',
			name: 'amount',
			fieldLabel: '折后实收金额',
			//value: 0,
			//disabled: true
		},{
			xtype: 'numberfield',
			name: 'amount_owe',
			fieldLabel: '欠费(元)',
			//value: 0
			hidden: true
		},{
			xtype: 'textfield',
			name: 'note',
			fieldLabel: '备注',		
		},{
			xtype: 'combo',
			// selectOnFocus: true, editable=true 结合
			name: 'consultID_owe',
			store: 'Consult',
			valueField: 'consultID',
			displayField: 'consultName',
			editable: false,
			fieldLabel: '业绩归咨询',	
			listConfig: {
                itemTpl: '{consultName} - {schoolsub}'
            },	
			queryMode: 'local'
			
		},{			
			xtype: 'hiddenfield',//修改的唯一id,隐藏
			name: 'accntID',	
		}],
			
	},{
		xtype: 'grid',
		//disabled: true,
		height: 200,
		tripeRows: true,
		//allowDeselect: true,
		//selType: 'cellmodel',
		//store: 'AccntDetail',
		store: Ext.create('Ext.data.Store', {
			fields: [
	            {name: "title", type: "string"},
	            {name: "kclistID"},
				{name: "unitprice", defaultValue: 0}, // 0,不是大小班
				{name: "hour", defaultValue: 0},
				{name: "amount"},
	        ],
		}),
		 
	    columns: [{
			xtype: 'rownumberer',
		},{	
			text: '报读课程',
			flex: 1,
			sortable: true,
			menuDisabled: true,
			dataIndex: 'title'
		}, {
			text: '单价',
			width: 60,
			menuDisabled: true,
			dataIndex: 'unitprice',
			align: 'right'
		}, {
			text: '课时',
			width: 80,
			menuDisabled: true,
			dataIndex: 'hour',
			align: 'center'
		}, {
			text: '金额(元)',
			width: 80,
			menuDisabled: true,
			dataIndex: 'amount',
			align: 'right'
 		},{	 
 			menuDisabled: true,
 			sortable: false,
 			xtype: 'actioncolumn',
 			width: 30,
 			items: [{
 				//iconCls: 'add',
 				icon: 'resources/images/my_delete_icon.png',
 				tooltip: '删除',
				disabled: true,
 				handler: function(grid, rowIndex, colIndex) {
 					grid.getSelectionModel().select(rowIndex); // 高亮
 					var rec = grid.getStore().getAt(rowIndex);
 					grid.up('window').onDelete(rec); 
 				}	
 			}]
		}],
    }],
	
	onSave: function(){
		var me = this;
		
		var //studentName = this.down('textfield[name=studentName]').getValue().trim(),
			//studentID = this.down('hiddenfield[name=studentID]').getValue().trim(),
			//wxID = this.down('hiddenfield[name=wxID]').getValue().trim(),
			//datetime.toLocaleDateString() // 0点0分，不准确，要转换toLocal
			//accntDate = this.down('datefield[name=accntDate]').getValue(), 
			//amount = this.down('numberfield[name=amount]').getValue(),
			//amount_owe = this.down('numberfield[name=amount_owe]').getValue(),
			//amount_ys = this.down('displayfield[name=amount_ys]').getValue(),
			note = this.down('textfield[name=note]').getValue().trim(),
			consultID_owe = this.down('combo[name=consultID_owe]').getValue(),
			consultName_owe = this.down('combo[name=consultID_owe]').getRawValue(),
			accntID = this.down('hiddenfield[name=accntID]').getValue() // unique
/*
		var arrList = [] //,jsonList = {};
		var store = me.down('grid').getStore()
		store.each(function(rec,index){
			arrList.push(rec.data)
			//jsonList[index] = rec.data.kclistID 
		})
		if (arrList.length == 0){	
			Ext.Msg.alert('提示','请添加课程明细！');
			return;
		}
		//console.log(arrList);
		//console.log(JSON.stringify(jsonList));
		//arrList = JSON.stringify(jsonList); 
		arrList = JSON.stringify(arrList); //传递到后台，必须字符串
		//arrList = arrList.join(',')
*/	
		var obj = {
			/*"studentName": studentName,
			"studentID": studentID,
			"wxID": wxID, //发微信模版通知消息
			"accntType": accntType,
			"accntDate": accntDate,
			"payment": payment,  */
			//"amount": amount,
			//"amount_ys": amount_ys, 
			//"amount_owe": amount_owe,
			"note": note,	
			"consultID_owe": consultID_owe,	//业绩归属
			"consultName_owe": consultName_owe, //前端显示
			//"arrList": arrList, // 报读的多个课程列表					
			//"consultID": localStorage.consultID, //当前登录的咨询师
			//"schoolsubID": localStorage.schoolsubID,
			//"schoolID": localStorage.schoolID,
			"accntID": accntID //unique
		};
		console.log(obj);
		
		Ext.Msg.confirm('询问','确认修改保存？',function(id){
			if( id == "yes"){
				//me.close();
				me.fireEvent('save',obj,me); //后台数据判断，才能关闭  本窗口win
				
				/* 更新前端store
				var model = me.down('form').getRecord();
				model.set(obj) */
			}
		})
	},
});