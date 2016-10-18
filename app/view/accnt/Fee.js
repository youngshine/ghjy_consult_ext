// 订单的缴费记录，可能多次
Ext.define('Youngshine.view.accnt.Fee' ,{
	extend: 'Ext.window.Window',
    alias : 'widget.accnt-fee',
	//id: 'winPrepaidHist',

	autoShow: true,
	closable: true,
	modal: true,
	//collapsible: true,
	resizable: false,
	width: 500,
	height: 250,
	layout: 'fit',

    title : '缴费记录',
	//titleAlign: 'center',
	
	parentRecord: null, // 父表参数传递，该学生信息

	fbar: [{
/*		xtype: 'label',
		html: '合计(元)：',
	},{	
		xtype: 'displayfield',
		itemId: 'subtotal',
		hidden: true
		//padding: '0 0 0 5'	
	},'->',{	*/
		xtype: 'button',
		text: '＋添加',
		tooltip: '添加缴费记录',
		//disabled: true,
		//scale: 'medium',
		width: 55,
		handler: function(btn){
			btn.up('window').onAddnew(btn); //onAdd是系统保留reserved word
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
		}
	}],
	
	items: [{
		xtype: 'grid',
		stripeRows: true,
		allowDeselect: true,
		//selType: 'cellmodel',
		store: 'AccntFee',
	    columns: [{
			xtype: 'rownumberer',
	     }, {
	         text: '日期',
	         flex: 1,
			 menuDisabled: true,
	         dataIndex: 'feeDate'
	     }, {
	         text: '金额',
	         width: 80,
			 menuDisabled: true,
	         dataIndex: 'amount',
			 align: 'right' 
	     }, {
	         text: '付款方式',
	         width: 80,
			 menuDisabled: true,
	         dataIndex: 'payment'		
	     }, {
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

	onAddnew: function(btn){
		// console.log( Math.floor(text) == text )
		var me = this;
		
		this.down('grid').getSelectionModel().deselectAll();
		
		var win = Ext.create('Youngshine.view.accnt.FeeNew')
		win.parentView = me // 带入参数
		win.showBy(btn)
		/*
		Ext.Msg.prompt('缴费', '请输入整数金额：', function(btn, text){
		    if (btn == 'ok'){
		        // process text value and close...
				console.log( Math.floor(text) == text )
				// 输入正确数字
				if(Math.floor(text) == text){ 
					var obj = {
						amount: text,
						payment: payment,
						feeDate: new Date()
					}
					me.fireEvent('addnew',obj);
				}
				
		    }
		}); */
	},
	onDelete: function(rec){
		var me = this;
		console.log(rec);

		Ext.Msg.confirm('提示','删除当前行？',function(btn){
			if(btn == 'yes'){
				me.fireEvent('del',rec);
			}
		});
	},
});