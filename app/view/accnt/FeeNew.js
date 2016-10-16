Ext.define('Youngshine.view.accnt.FeeNew', {
    extend: 'Ext.window.Window',
    alias : 'widget.fee-new',

    title : '新增缴费',
    layout: 'fit',
	
	width: 300,
	//height: 300,
	modal: true,
    autoShow: false,
	resizable: false,
	closable: false,

    fbar : [{
    	xtype: 'label',
		text: '',
		style: 'color:red;',
		itemId: 'err'
    },'->',{
		text: '保存',
		width: 45,
		action: 'save',
		//scope: this,
		handler: function(btn){
			btn.up('window').onSave();
		}
	},{
		text: '取消',
		width: 45,
		//scope: this,
		handler: function(btn){
			btn.up('window').destroy();
			//this.close();
		}
	}],	
		
	items: [{
		xtype: 'form',
		bodyPadding: 10,
		fieldDefaults: {
			labelWidth: 80,
			labelAlign: 'right',
			anchor: '100%'
		},
		items: [{
			xtype: 'datefield',
            fieldLabel: '日期',
			format: 'Y-m-d',
            name: 'feeDate',
            allowBlank: false,
			value: new Date()
		},{
			xtype: 'combo',
			name: 'payment',
			store: {
				fields: ['value'],
				data : [
					{"value":"现金"},
					{"value":"刷卡"},
					{"value":"微信"},
					{"value":"支付宝"},
				]
			},
			valueField: 'value',
			displayField: 'value',
			editable: false,
			fieldLabel: '付款方式'
		},{
			xtype: 'numberfield',
			name: 'amount',
			fieldLabel: '金额(元)',
			value: 0
		}],
    }],
   
	onSave: function(){
		var me = this;
		var payment = this.down('combo[name=payment]').getValue(),
			feeDate = this.down('datefield[name=feeDate]').getValue(), 
			amount = this.down('numberfield[name=amount]').getValue(),
			accntID = me.parentView.parentRecord.data.accntID //
		
		if (payment == null){
			//Ext.Msg.alert('提示','请选择付款方式');
			me.down('label[itemId=err]').setText('请选择付款方式')
			return;
		}	
		
		// 可能关系户，不收钱？
		if (amount == 0){
			me.down('label[itemId=err]').setText('请输入整数金额')
			return;
		}
		
		var obj = {
			amount: amount,
			payment: payment,
			feeDate: feeDate,
			accntID: accntID
		}
		console.log(obj)
		me.fireEvent('save',obj,me); //后台数据判断，才能关闭  本窗口win
/*
		Ext.Msg.confirm('询问','是否保存？',function(id){
			if( id == "yes"){
				//me.close();
				me.fireEvent('save',obj,me); //后台数据判断，才能关闭  本窗口win
			}
		})  */
	}
});