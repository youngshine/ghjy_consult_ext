// 添加一对一课程
Ext.define('Youngshine.view.accnt.KclistOne2one', {
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
	//height: 400,
	//autoScroll: true,
	layout: 'fit',

	defaultFocus: 'search',
	
    title : '添加一对一课程',
	//titleAlign: 'center',
	
	parentView: null, //父表单，返回显示选中值
	record: null, // 父表的记录

	fbar: ['->',{
		text: '确定',
		handler: function(btn){
			btn.up('window').onOk();//hide();
		}	
	},{	
		text: '取消',
		handler: function(btn){
			btn.up('window').close();//hide();
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
			xtype: 'combo',
			name: 'kclistID',
			store: 'Kclist',
			valueField: 'kclistID',
			displayField: 'title',
			editable: false,
			fieldLabel: '课程名称',
			listeners: {
				change( field, newValue, oldValue, eOpts ){
					field.up('window').onKclistChange(newValue,field)
				}
			}
		},{
			xtype: 'displayfield',
			name: 'unitprice',
			fieldLabel: '单价',
		},{
			xtype: 'numberfield',
			name: 'hour',
			fieldLabel: '购买课时',
			value: 0,
			listeners: {
				change( field, newValue, oldValue, eOpts ){
					field.up('window').onHourChange(newValue,field)
				}
			}	
		},{
			xtype: 'displayfield',
			name: 'amount',
			fieldLabel: '金额',				
		}],
    }],
	
	onOk: function(){
		var me = this;	
		var kclistID = this.down('combo[name=kclistID]').getValue(),
			title = this.down('combo[name=kclistID]').getRawValue(),
			unitprice = this.down('displayfield[name=unitprice]').getValue(),
			hour = this.down('numberfield[name=hour]').getValue(), 
			amount = this.down('displayfield[name=amount]').getValue()

		if (kclistID == null){
			Ext.Msg.alert('提示','请选择购买的课程！');
			return;
		}
		if (hour == 0){
			Ext.Msg.alert('提示','请输入购买的课时数！');
			return;
		}
		
		var obj = {
			"kclistID": kclistID,
			"title": title,
			"unitprice": unitprice,
			"hour": hour,
			"amount": parseInt(unitprice)*parseInt(hour)
		};
		console.log(obj);

		var store = me.parentView.down('grid').getStore()
		console.log(store)
		store.insert(0,obj); //新增记录，0排在最前面
		
		var ys = me.parentView.down('displayfield[name=amount_ys]'),
			ss = me.parentView.down('numberfield[name=amount]')
		
		ys.setValue( parseInt(ys.getValue()) + parseInt(obj.amount) )
		ss.setValue( parseInt(ss.getValue()) + parseInt(obj.amount) )
		
		me.destroy()
	},
	
	// 选择一对一课程，自动单价
	onKclistChange: function(val,field){
		var me = this;  
		var store = field.getStore();
		store.each(function(record){
			if(record.data.kclistID == val ){
				//me.down('hiddenfield[itemId=title]').setValue(record.data.title)
				me.down('displayfield[name=unitprice]').setValue(record.data.unitprice)
				var hour = me.down('numberfield[name=hour]').getValue()
				var amount = record.data.unitprice * hour
				me.down('displayfield[name=amount]').setValue(amount)
				return false // 跳出循环
			}
			console.log(record.data)
		})
	},	
	
	onHourChange: function(val,field){
		var me = this;
		var amount = val * me.down('displayfield[name=unitprice]').getValue()
		me.down('displayfield[name=amount]').setValue(amount)
	},
});