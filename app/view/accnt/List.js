Ext.define('Youngshine.view.accnt.List' ,{
    //extend: 'Ext.grid.Panel',
	extend: 'Ext.window.Window',
    alias : 'widget.accnt-list',

	closable: true,
	modal: true,
    autoShow: true,
	//resizable: false,
	width: 800,
	height: 550,
	maximizable: true,
	maximized: true,
	layout: 'fit',

    title : '课程销售订单',

	fbar: [{	
		xtype: 'combo',
		width: 100,
		itemId: 'accntType',
		store: {
			fields: ['value'],
			data : [
				{"value":"大小班"},
				{"value":"一对一"},
				{"value":"退费退班"},
			]
		},
		valueField: 'value',
		displayField: 'value',
		emptyText: '课程类型',
		//editable: false,
		//padding: '5 0',
		listeners: {
			change: function(cb,newValue){
				var accntType = newValue,
					studentName = this.up('window').down('textfield[itemId=search]').getValue().trim();
				this.up('window').onFilter(accntType,studentName); 
			}
		}	
	},{	
		xtype: 'textfield',
		itemId : 'search',
		width: 100,
		//fieldLabel: '筛选',
		//labelWidth: 30,
		//labelAlign: 'right',
		emptyText: '搜索姓名...',
		enableKeyEvents: true,
		listeners: {
			keypress: function(field,e){
				console.log(e.getKey())
				if(e.getKey()=='13'){ //按Enter
					var studentName = field.value,
						accntType = field.up('window').down('combo[itemId=accntType]').getValue();
					field.up('window').onFilter(accntType,studentName); 
				}	
			}
		}

	},'->',{	
		xtype: 'button',
		text: '＋新增',
		tooltip: '添加记录',
		//disabled: true,
		//scale: 'medium',
		width: 55,
		handler: function(btn){
			btn.up('window').onNew(); //onAdd是系统保留reserved word
		}
	},{	
		xtype: 'button',
		text: '关闭',
		//scale: 'medium',
		width: 55,
		style: {
			//background: 'transparent',
			border: 1 //'1px solid #fff'
		},
		handler: function(btn){
			btn.up('window').close()
			// non-modal window
		}
	}],
	
	items: [{
		xtype: 'grid',
		stripeRows: true,
		//allowDeselect: true,
		//selType: 'cellmodel',
		store: 'Accnt',
	    columns: [{
			xtype: 'rownumberer',
			width: 35
		},{	
			 text: '单据号',
			 width: 60,
	         sortable: true,
			 menuDisabled: true,
	         dataIndex: 'accntID'
	     }, {
	         text: '日期',
	         width: 80,
			 menuDisabled: true,
	         dataIndex: 'accntDate'
 		},{	
 			 text: '学生',
 			 width: 80,
 	         sortable: true,
 			 menuDisabled: true,
 	         dataIndex: 'studentName'
	     }, {
	         text: '类型',
	         width: 60,
	         //sortable: false,
			 menuDisabled: true,
	         dataIndex: 'accntType'	 
	     }, {
	         text: '课程金额',
	         width: 60,
	         //sortable: false,
			 menuDisabled: true,
	         dataIndex: 'amount_ys',
			 align: 'right'	
	     }, {
	         text: '打折(元)',
	         width: 60,
	         //sortable: false,
			 menuDisabled: true,
	         dataIndex: 'discount',
			 align: 'right',
			 renderer: function(value){
		         if (value == 0) {
		             return '';
		         }
		         return value;
		     }	
	     }, {
	         text: '折后金额',
	         width: 60,
			 menuDisabled: true,
	         dataIndex: 'amount',
			 align: 'right'
	     }, {
	         text: '欠费(元)',
	         width: 60,
	         //sortable: false,
			 menuDisabled: true,
	         dataIndex: 'balance',
			 align: 'right',
			 renderer: function(value){
		         if (value == 0) {
		             return '';
		         }
		         return value;
		     }	

	     }, {
	         text: '归属咨询师',
	         width: 80,
			 menuDisabled: true,
	         dataIndex: 'consultName_owe',	
	     }, {
	         text: '备注',
	         flex: 1,
			 menuDisabled: true,
	         dataIndex: 'note',
	         //align: 'right',
	         //renderer: Ext.util.Format.usMoney
	         
		},{	 
			menuDisabled: true,
			sortable: false,
			xtype: 'actioncolumn',
			width: 30,
			items: [{
				//iconCls: 'add',
				icon: 'resources/images/my_pay_icon.png',
				tooltip: '缴费记录',
				handler: function(grid, rowIndex, colIndex) {
					grid.getSelectionModel().select(rowIndex); // 高亮
					var rec = grid.getStore().getAt(rowIndex);
					grid.up('window').onFee(rec); 
				}	
			}]
			
		},{	 
			menuDisabled: true,
			sortable: false,
			xtype: 'actioncolumn',
			width: 30,
			items: [{
				//iconCls: 'add',
				icon: 'resources/images/my_kclist_icon.png',
				tooltip: '课程明细记录',
				handler: function(grid, rowIndex, colIndex) {
					grid.getSelectionModel().select(rowIndex); // 高亮
					var rec = grid.getStore().getAt(rowIndex);
					grid.up('window').onDetail(rec); 
				}	
			}]	
			
		},{	 
			menuDisabled: true,
			sortable: false,
			xtype: 'actioncolumn',
			width: 30,
			items: [{
				//iconCls: 'add',
				icon: 'resources/images/my_edit_icon.png',
				tooltip: '修改',
				handler: function(grid, rowIndex, colIndex) {
					grid.getSelectionModel().select(rowIndex); // 高亮当前选择行？？？不是自动？
					var rec = grid.getStore().getAt(rowIndex);
					//Ext.Msg.alert('Sell', 'Sell ' + rec.get('company'));
					//me.fireEvent('adminEdit');
					grid.up('window').onEdit(rec); 
				}	
			}]	
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
	}],
	
	onNew: function(){ 
		this.down('grid').getSelectionModel().deselectAll();
		this.fireEvent('addnew');
	},
	onEdit: function(rec){ 
		if(rec.data.current==0) return false
			
		this.fireEvent('edit',rec);
	},
	onDelete: function(rec){
		var me = this;
		console.log(rec);
		
		if(rec.data.current==0) return false
			
		Ext.Msg.confirm('提示','删除当前行？',function(btn){
			if(btn == 'yes'){
				me.fireEvent('del',rec);
			}
		});
	},
	
	// 缴费明细，一个订单可能多次缴费
	onFee: function(rec){ 
		this.fireEvent('fee',rec);
	},

	// 缴费单的子表（课程明细）
	onDetail: function(record){ 
		var obj = {
			"accntID": record.data.accntID,
		} 
		Ext.data.JsonP.request({ 
            url: Youngshine.app.getApplication().dataUrl +  
				'readAccntDetailByAccnt.php',
            callbackKey: 'callback',
            params:{
                data: JSON.stringify(obj)
            },
            success: function(result){
				console.log(result)
				var kclist = []
				Ext.Array.each(result.data, function(name, index, countriesItSelf) {
				    console.log(name);
					kclist.push(name.title+'：'+name.hour+'课时、'+name.amount+'元')
				});
				console.log(kclist)
				kclist = kclist.join("<br>")
				Ext.Msg.show({
				     title: '购买课程明细',
				     msg: kclist,
				     buttons: Ext.Msg.OK,
				     //icon: Ext.Msg.QUESTION
				});
            }
		});
	},	
	
	onFilter: function(accntType,studentName){
		var me = this;
		var studentName = new RegExp("/*" + studentName); // 正则表达式
		var store = this.down('grid').getStore();
		store.clearFilter(); // filter is additive
		if(accntType != null )
			store.filter([
				{property: "accntType", value: accntType},
				{property: "studentName", value: studentName}, // 姓名模糊查找？？
			]);
		if(accntType == null )
			store.filter("studentName", studentName);
	}
});