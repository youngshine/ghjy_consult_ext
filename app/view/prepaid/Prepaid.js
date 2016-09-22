// 现场缴费，单条缴费，
Ext.define('Youngshine.view.prepay.Prepaid', {
    extend: 'Ext.window.Window',
    alias : 'widget.prepaid',
	//id: 'winStudyPrepay',
	
	autoShow: true,
	modal: true,
	resizable: false,
	closable: false,
	width: 450,
	//height: 300,
	//layout: 'fit',
	title : '单条缴费',
	
	//record: null,
	
	fbar: ['->',{	
		xtype: 'button',
		text: '确认',
		tooltip: '保存缴费信息',
		//disabled: true,
		//scale: 'medium',
		width: 55,
		handler: function(btn){
			btn.up('window').onSave(); //onAdd是系统保留reserved word
		}
	},{	
		xtype: 'button',
		text: '取消',
		width: 55,
		handler: function(btn){
			btn.up('window').close()
		}
	}],
	items: [{
		xtype: 'form',
		bodyPadding: 10,
		fieldDefaults: {
			labelWidth: 65,
			labelAlign: 'right',
			anchor: '100%'
		},
		items: [{
			xtype: 'combo',
			name: 'payment',
			store: {
				fields: ['value'],
				data : [
					{"value":"现金"},
					{"value":"刷卡"},
					{"value":"扫码"}
				]
			},
			valueField: 'value',
			displayField: 'value',
			editable: false,
			fieldLabel: '付款方式'	
		},{
			xtype: 'displayfield',
			itemId: 'subtotal',
			fieldLabel: '应收金额',
		},{
			xtype: 'numberfield',
	        anchor: '100%',
	        name: 'discount',
	        fieldLabel: '打折％',
	        value: 0,
	        maxValue: 99,
	        minValue: 0,
			step: 10,
			listeners: {
				change: function(field,newValue,oldValue){
					var subtotal = field.up('window').down('displayfield[itemId=subtotal]').getValue()
					actualtotal = parseInt(subtotal * (100-newValue)/100)
					field.up('window').down('displayfield[itemId=actualtotal]').setValue(actualtotal)
				}
			}	
		},{
			xtype: 'displayfield',
			itemId: 'actualtotal',
			fieldLabel: '实收',
		},{
			xtype: 'hiddenfield',
			name: 'studentID' //unique for update
		}],
    }],
   
	onSave: function(){
		var me = this; 

		var payment = this.down('combo[name=payment]').getValue(),
			discount = this.down('numberfield[name=discount]').getValue()
		
		if (payment == null || payment == ''){
			Ext.Msg.alert('提示','请选择付款方式');
			return;
		}

		Ext.Msg.confirm('询问','是否保存？',function(id){
			if( id == "yes"){
				var obj = {
					"payment": payment,
					"discount": discount,
					"prepaid": 1
				};
				obj.studentstudyID = me.record.get('studentstudyID');
				me.fireEvent('save',obj); 
				
				//me.fireEvent('save',obj,me); //后台数据判断，才能关闭  本窗口win
				
				// 前端store立即更新
				me.record.set(obj)
				me.close()
			}
		})
	},
	
});