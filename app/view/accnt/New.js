Ext.define('Youngshine.view.accnt.New', {
    extend: 'Ext.window.Window',
    alias : 'widget.accnt-new',
	id: 'winAccntNew',
	
	autoShow: true,
	modal: true,
	resizable: false,
	closable: false,
	width: 600,
	//height: 600,
	//layout: 'vbox',
	title : '新增课程销售单',

    fbar : [{
    	text: '＋添加课程明细',
		action: 'addrow',
		disabled: true,
		handler: function(btn){
			btn.up('window').onAddrow();
		}
    },'->',{
		text: '保存',
		action: 'save',
		handler: function(btn){
			btn.up('window').onSave();
		},
		disabled: true
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
			listeners: {
				change: function( field, newValue, oldValue, eOpts ){
					field.up('window').down('button[action=save]').setDisabled(false)
					field.up('window').down('button[action=addrow]').setDisabled(false)
				}
			}	
		},{
			xtype: 'textfield',
			name : 'studentName',
			fieldLabel: '学生姓名',
			readOnly: true,
			emptyText: '全校范围选择学生',
			listeners: {
		        click: {
		            element: 'el', 
		            fn: function(e,opts){ 					
						Ext.getCmp('winAccntNew').onStudent(e,opts)
					},
		        },	
		    },
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
			value: new Date()	
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
			xtype: 'fieldset',
			items: [{
				xtype: 'displayfield',
				name: 'amount_ys',
				fieldLabel: '课程合计金额',
				value: 0
			},{
				xtype: 'numberfield',
				name: 'discount',
				fieldLabel: '打折(元)',
				value: 0,
				listeners: {
			        change: function(field,newValue){ 					
						var total = field.up('window').down('displayfield[name=amount_ys]').getValue()
						
						//if(newValue > total) return false
							
						field.up('window').down('displayfield[name=amount]').setValue(total-newValue)
			        },	
			    },
			},{
				xtype: 'displayfield',
				name: 'amount',
				fieldLabel: '折后实收金额',
				value: 0
			},{
				xtype: 'numberfield',
				//name: 'amount_owe',
				name: 'amount_now',
				fieldLabel: '本次缴款(元)',
				value: 0,
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
			}]
		}],
	},{
		xtype: 'grid',
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
				{name: "accntdetailID", defaultValue: 0}, //退费，退班用，更改他的状态
				{name: "kcType"},
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
 				handler: function(grid, rowIndex, colIndex) {
 					grid.getSelectionModel().select(rowIndex); // 高亮
 					var rec = grid.getStore().getAt(rowIndex);
 					grid.up('window').onDelete(rec); 
 				}	
 			}]
		}],
		/*
		listeners: {
			itemclick: function(list, record, item, index){
				this.up('window').onItemtap(list, record, item, index);
			},
		}	*/
    }],
   
	onSave: function(){
		var me = this;  
		
		var studentName = this.down('textfield[name=studentName]').getValue().trim(),
			studentID = this.down('hiddenfield[name=studentID]').getValue().trim(),
			wxID = this.down('hiddenfield[name=wxID]').getValue().trim(),
			//datetime.toLocaleDateString() // 0点0分，不准确，要转换toLocal
			accntDate = this.down('datefield[name=accntDate]').getValue(), 
			amount = this.down('displayfield[name=amount]').getValue(),
			//amount_owe = this.down('numberfield[name=amount_owe]').getValue(),
			amount_now = this.down('numberfield[name=amount_now]').getValue(),
			amount_ys = this.down('displayfield[name=amount_ys]').getValue(),
			note = this.down('textfield[name=note]').getValue().trim(),
			consultID_owe = this.down('combo[name=consultID_owe]').getValue(),
			consultName_owe = this.down('combo[name=consultID_owe]').getRawValue()

		/*
		console.log(this.down('radiogroup[itemId=accntType]').getChecked())
		// 有无选中
		var accntType = this.down('radiogroup[itemId=accntType]').getChecked()[0]
		console.log(accntType)
		if (!accntType){
			Ext.Msg.alert('提示','请选择缴费类型！');
			return;
		}
		var accntType = accntType.boxLabel
		console.log(accntType)
		*/
		var accntType = this.down('radiogroup[itemId=accntType]').getChecked()[0].boxLabel
		
		var payment = this.down('radiogroup[itemId=payment]').getChecked()[0]
		if (!payment){
			Ext.Msg.alert('提示','请选择付款方式！');
			return;
		}
		payment = payment.boxLabel
		console.log(payment)
		
		if (studentName == ''){
			Ext.Msg.alert('提示','请选择学生！');
			return;
		}
		if (amount_now == 0){
			Ext.Msg.alert('提示','本次缴款为0');
		}
/*	可能关系户不收钱	
		if (amount == 0){
			Ext.Msg.alert('提示','实收金额不能为0！');
			return;
		}
*/		
		/*
		var store = me.down('grid').getStore()
		if (store.getCount()==0){
			Ext.Msg.alert('提示','请添加课程明细！');
			return;
		} */
		
		//if list.length == 0 '至少报读一个班级'
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

		var obj = {
			"studentName": studentName,
			"studentID": studentID,
			"wxID": wxID, //发微信模版通知消息
			"accntType": accntType,
			"accntDate": accntDate,
			"amount": amount,
			"amount_ys": amount_ys,
			"amount_now": amount_now, //本次缴款，保存到fee表
			"payment": payment, //付款方式，保存到fee表
			"note": note,	
			"consultID_owe": consultID_owe,	//业绩归属
			"consultName_owe": consultName_owe, //前端显示
			"arrList": arrList, // 报读的多个课程列表（数组转字符串）					
			"consultID": localStorage.consultID, //当前登录的咨询师
			"schoolsubID": localStorage.schoolsubID,
			"schoolID": localStorage.schoolID,
		};
		console.log(obj);

		Ext.Msg.confirm('询问','应缴金额'+amount+'元，本次缴款'+amount_now+'元。确认保存？',function(id){
			if( id == "yes"){
				//me.close();
				me.fireEvent('save',obj,me); //后台数据判断，才能关闭  本窗口win
			}
		})
	},

	// 添加课程明晰
	onAddrow: function(){
		var me = this;
		
		// 有学生，才有退费
		var studentName = this.down('textfield[name=studentName]').getValue().trim()
		if (studentName == ''){
			Ext.Msg.alert('提示','请先选择学生！');
			return;
		}
		
		// 有无选中
		var radios = this.down('radiogroup[itemId=accntType]')
		var radioChecked = radios.getChecked()[0]
		if (!radioChecked){
			Ext.Msg.alert('提示','请选择缴费类型！');
			return;
		}
		var accntType = radioChecked.boxLabel
		console.log(accntType)
		radios.setDisabled(true) //添加，就不能再选择类型
		
		me.fireEvent('addrow',accntType,me); 
	},
	
	// 删除
	onDelete: function(record){
		var me = this; console.log(record)
		me.down('grid').getStore().remove(record); //store选择的排除，从 检测项目.. 
		
		var ys = me.down('displayfield[name=amount_ys]'),
			ss = me.down('displayfield[name=amount]')
		ys.setValue ( parseInt(ys.getValue()) - parseInt(record.data.amount) )
		ss.setValue ( parseInt(ss.getValue()) - parseInt(record.data.amount) )
	},
	
	// 查找选择全校学生
	onStudent: function(e,input){
		console.log(input)
		var me = this
		var win = Ext.create('Youngshine.view.accnt.Student'); 
		win.parentView = me;
		win.showAt(e.getXY())  
		//win.show()
		// 带入参数：当前js textfield，返回值显示
		win.input = input;  
		win.down('grid').getStore().removeAll()
		
		// 分校区
		var obj = {
			"schoolID": localStorage.getItem('schoolID'),
		} 
		var store = Ext.getStore('Schoolsub'); 
		store.removeAll();
		store.clearFilter();
        var url = Youngshine.app.getApplication().dataUrl + 
			'readSchoolsubList.php?data=' + JSON.stringify(obj);
		store.getProxy().url = url;
        store.load({
            callback: function(records, operation, success) {

            },
            scope: this
        });
/*		
		var obj = {
			"schoolID": localStorage.getItem('schoolID'),
		} 
		var store = Ext.getStore('Student'); 
		store.removeAll();
        var url = Youngshine.app.getApplication().dataUrl + 
			'readStudentListBySchool.php?data=' + JSON.stringify(obj);
		store.getProxy().url = url;
        store.load({
            callback: function(records, operation, success) {

            },
            scope: this
        }); */
	},
});