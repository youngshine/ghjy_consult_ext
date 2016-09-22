// 现场缴费，多条合并缴费，
Ext.define('Youngshine.view.study.Prepay', {
    extend: 'Ext.window.Window',
    alias : 'widget.prepay',
	id: 'winStudyPrepay',
	
	autoShow: true,
	modal: true,
	resizable: false,
	closable: false,
	width: 450,
	//height: 300,
	//layout: 'fit',
	title : '缴费',
	
	//record: null,
	
	fbar: [{
		text: '确认付款',
		tooltip: '获得回执单',
		handler: function(btn){
			btn.up('window').onSwipeCard(btn); //启动刷卡、扫吗等，获得回执单
		}
	},'->',{	
		text: '保存',
		action: 'save',
		tooltip: '',
		disabled: true,
		//scale: 'medium',
		width: 55,
		handler: function(btn){
			btn.up('window').onSave(); //onAdd是系统保留reserved word
		}
	},{	
		text: '取消',
		action: 'cancel',
		width: 55,
		handler: function(btn){
			//btn.up('window').close()
			btn.up('window').onCancel(btn)
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
			itemId: 'payment',
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
	        itemId: 'discount',
	        fieldLabel: '打折％',
	        value: 0,
	        maxValue: 100,
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
			xtype: 'textfield',
			itemId: 'OrderID', //刷卡，返回的交易单
			fieldLabel: '回执单',
			readOnly: true
		},{
			xtype: 'hiddenfield',
			name: 'studentID' //unique for update
		}],
    }],
 
	onSwipeCard: function(btn){
		var me = this; 
		var payment = this.down('combo[itemId=payment]').getValue()
		if (payment == null || payment == ''){
			Ext.Msg.alert('提示','请选择付款方式');
			return;
		}
		if (payment != '刷卡'){
			swiped()
			return;
		}
		
		var amt = this.down('displayfield[itemId=actualtotal]').getValue()
		amt = amt.toString() + '00'
		var lengthAmt = amt.length;
		for(var i=0;i<(12-lengthAmt);i++)
			amt = "0"+amt;
		console.log(amt)
		//var transtime = time().toString();
		// 快钱刷卡,orderId = time()
		var today = new Date()
		//console.log(today.getTime().toString())
		var yy = (today.getFullYear()).toString()//.substr(2); 
		var mm = (today.getMonth()+1).toString();
		var dd = (today.getDate()).toString();
		var hh = (today.getHours()).toString();
		var ii = (today.getMinutes()).toString();
		var ss = (today.getSeconds()).toString();
		var hm = (today.getMilliseconds()).toString();console.log(hm)
		mm = mm.length==1 ? '0'+mm : mm;
		dd = dd.length==1 ? '0'+dd : dd;
		hh = hh.length==1 ? '0'+hh : hh;
		ii = ii.length==1 ? '0'+ii : ii;
		ss = ss.length==1 ? '0'+ss : ss;
		//var OrderID = yy+mm+dd +today.getTime().toString()+ '0'
		var TransTime = mm+dd+hh+ii+ss;
		var OrderID = yy+mm+dd+hh+ii+ss+hm
		var lengthOrderID = OrderID.length;
		for(var i=0;i<(20-lengthOrderID);i++)
			OrderID = OrderID + '0';
		console.log(OrderID); 

		var str = '00'+amt+'38031659'+'0001'+TransTime + OrderID+
			'      '+'          '+'      '+'            '+'                    '
		console.log(str.length)
		/*
		if(OpenComm()){
			if(TAPI_SendReq(str)){
				//if(TAPI_RecvResp()){
				str = Pad.API_RecvResp();
				str = str.substr(22,12)	
				me.down('textfield[itemId=OrderId]').setValue(str)
				//}
			}
		} */
		me.down('textfield[itemId=OrderID]').setValue(OrderID)
		if(Pad.OpenComm(1,57600,60)==1){
			console.log("开启OCX1成功");
			Pad.API_SendReq(110,str);
			Pad.CloseComm();
			//me.down('textfield[itemId=OrderId]').setValue(str)
		}else{
			alert("开启OCX1失败");
		}
		
		
		function swiped(){
			// 获得刷卡等回执单
			btn.setDisabled(true)
			me.down('combo[itemId=payment]').setDisabled(true)
			me.down('textfield[itemId=discount]').setDisabled(true)
			me.down('textfield[itemId=OrderID]').setDisabled(false)
			me.down('button[action=save]').setDisabled(false)
		}
	},
	
	onSave: function(){
		var me = this; 
		var payment = this.down('combo[itemId=payment]').getValue(),
			subtotal = this.down('displayfield[itemId=subtotal]').getValue(),
			discount = this.down('numberfield[itemId=discount]').getValue(),
			actualtotal = this.down('displayfield[itemId=actualtotal]').getValue(),
			OrderID = this.down('textfield[itemId=OrderID]').getValue().trim(),
			studentID = this.down('hiddenfield[name=studentID]').getValue()
		/*
		if (payment == null || payment == ''){
			Ext.Msg.alert('提示','请选择付款方式');
			return;
		} */
		if (OrderID == ''){
			Ext.Msg.alert('提示','回执单不能空白！');
			return;
		}
		
		Ext.Msg.confirm('询问','是否保存？',function(id){
			if( id == "yes"){
				var obj = {
					"payment": payment,
					"subtotal": subtotal,
					"discount": discount,
					"actualtotal": actualtotal,
					"OrderID": OrderID,
					"study_list": '', //合并报读课程列表
					"studentID": studentID,
					"prepaid": 1
				};
				// 合并报读课程 缴费
				var store = Ext.getStore('Study')
				store.each(function(record){ //循环
					obj.study_list += record.get('studentstudyID')+',';
					//me.fireEvent('save',obj); 
				}) 
				// 删掉最后一个逗号
				obj.study_list = obj.study_list.substr(0,obj.study_list.length-1)
				console.log(obj); 
				me.fireEvent('save',obj,me); //后台数据判断，才能关闭  本窗口win
				
				// 前端store立即更新
				//me.record.set(obj)
				//me.close()
			}
		})
	},
	onCancel: function(btn){
		var me = this;
		Ext.Msg.confirm('询问','取消本次缴费？',function(id){
			if( id == "yes"){
				me.close()
			}
		})
	}
	
});