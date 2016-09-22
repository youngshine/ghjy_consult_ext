Ext.define('Youngshine.view.prepaid.New', {
    extend: 'Ext.window.Window',
    alias : 'widget.prepaid-new',
	id: 'winPrepaidNew',
	
	autoShow: true,
	modal: true,
	resizable: false,
	closable: false,
	width: 550,
	//height: 300,
	//layout: 'fit',
	title : '新增',

    fbar : [{
		text: '确认付款',
		tooltip: '获得回执单',
		handler: function(btn){
			btn.up('window').onSwipeCard(btn); //启动刷卡、扫吗等，获得回执单
		}
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
			labelWidth: 65,
			labelAlign: 'right',
			anchor: '100%'
		},
		items: [{
			xtype: 'textfield',
			itemId : 'studentName',
			//width: 310,
			fieldLabel: '学生姓名',
			readOnly: true,
			listeners: {
		        click: {
		            element: 'el', //bind to the underlying el property on the panel
		            fn: function(e){ 					
						Ext.getCmp('winPrepaidNew').onStudent(e)
					},
		        },	
		    },
		},{
			xtype: 'hiddenfield', // 学生id，隐藏
			itemId: 'studentID',
		},{
			xtype: 'displayfield',
			itemId: 'grade',
			fieldLabel: '年级',	
			disabled: true
		},{
			xtype: 'displayfield',
			itemId : 'coupon',
			fieldLabel: '代金券',
			disabled: true	
			
		},{
			xtype: 'radiogroup',
	        fieldLabel: '体验课',
			itemId: 'xp',
	        // Arrange radio buttons into two columns, distributed vertically
	        columns: 1,
	        vertical: true,
	        items: [
	            { boxLabel: '2小时150元，代金券抵扣50元', name: 'rb', inputValue: '150,2,0' },
	        ]			
		},{
			xtype: 'radiogroup',
	        fieldLabel: '小学课程',
			itemId: 'xiaoxue',
	        // Arrange radio buttons into two columns, distributed vertically
	        columns: 2,
	        vertical: true,
	        items: [
	            { boxLabel: '10小时800元（原价1400元）', name: 'rb', inputValue: '800,10,1' },
	            { boxLabel: '30小时2250元（原价4200元）', name: 'rb', inputValue: '2250,30,1'},
	            { boxLabel: '60小时4200元（原价8400元）', name: 'rb', inputValue: '4200,60,1' },
	            { boxLabel: '100小时6500元（原价14000元）', name: 'rb', inputValue: '6500,100,1' },
	        ]
		},{
			xtype: 'radiogroup',
	        fieldLabel: '初中课程',
			itemId: 'chuzhong',
	        // Arrange radio buttons into two columns, distributed vertically
	        columns: 2,
	        vertical: true,
	        items: [
	            { boxLabel: '10小时950元（原价1650元）', name: 'rb', inputValue: '950,10,2' },
	            { boxLabel: '30小时2700元（原价4950元）', name: 'rb', inputValue: '2700,30,2'},
	            { boxLabel: '60小时5100元（原价9900元）', name: 'rb', inputValue: '5100,60,2' },
	            { boxLabel: '100小时7500元（原价16500元）', name: 'rb', inputValue: '7500,100,2' },
	        ]
		},{	
			xtype: 'combo',
			itemId: 'payment',
			store: {
				fields: ['value'],
				data : [
					{"value":"现金"},
					{"value":"刷卡"},
					{"value":"微信"},
					{"value":"扫码"}
				]
			},
			valueField: 'value',
			displayField: 'value',
			editable: false,
			fieldLabel: '付款方式'	
		},{
			xtype: 'textfield',
			itemId : 'OrderID',
			fieldLabel: 'OrderID',		
		}],
    }],
   
	onSave: function(){
		var me = this; 
		console.log(this.down('radiogroup[itemId=xiaoxue]').getChecked())
		// 有无选中
		var xiaoxue = this.down('radiogroup[itemId=xiaoxue]').getChecked()[0], 
			chuzhong = this.down('radiogroup[itemId=chuzhong]').getChecked()[0],
			xp = this.down('radiogroup[itemId=xp]').getChecked()[0]
		//xiaoxue = xiaoxue != null ? xiaoxue.inputValue : 0
		//chuzhong = chuzhong != null ? chuzhong.inputValue : 0
		//console.log(xiaoxue+chuzhong)
			
		var studentName = this.down('textfield[itemId=studentName]').getValue().trim(),
			studentID = this.down('hiddenfield[itemId=studentID]').getValue(),
			grade = this.down('displayfield[itemId=grade]').getValue(),
			payment = this.down('combo[itemId=payment]').getValue(),
			OrderID = this.down('textfield[itemId=OrderID]').getValue().trim(),
			coupon = this.down('displayfield[itemId=coupon]').getValue(),
			taocan,sectionID,amt,times,amount;
		
		if (studentName == ''){
			Ext.Msg.alert('提示','请选择学生！');
			return;
		}
		
		if(xiaoxue == null && chuzhong == null && xp == null ){
			Ext.Msg.alert('提示','请选择课程！');
			return;
		}
		if(xiaoxue) {
			amt = xiaoxue.inputValue.split(',')[0]
			times = xiaoxue.inputValue.split(',')[1]
			sectionID = xiaoxue.inputValue.split(',')[2]
			taocan = '小学'+xiaoxue.boxLabel
		}	
		if(chuzhong) {
			amt = chuzhong.inputValue.split(',')[0]
			times = chuzhong.inputValue.split(',')[1]
			sectionID = chuzhong.inputValue.split(',')[2]
			taocan = '初中'+chuzhong.boxLabel
		}
		if(xp) {
			amt = xp.inputValue.split(',')[0]
			times = xp.inputValue.split(',')[1]
			sectionID = xp.inputValue.split(',')[2]
			taocan = '体验课'+xp.boxLabel
		}
			
		console.log(amt);console.log(times)

		Ext.Msg.confirm('询问','是否保存？',function(id){
			if( id == "yes"){
				//if(viewEF.isValid()){
					var obj = {
						"studentName": studentName,
						"studentID": studentID,
						"grade": grade, // 前端显示用
						"payment": payment,
						"OrderID": OrderID,
						"taocan": taocan,
						"sectionID": sectionID,
						"times": times,
						"amt": amt,	
						"coupon": coupon,
						"amount": amt-coupon, //实际金额：amt-coupon代金券						
						//"consultID": localStorage.consultID, //当前登录的咨询师
					};
					console.log(obj);
					//me.close();
					me.fireEvent('save',obj,me); //后台数据判断，才能关闭  本窗口win
				//}
			}
		})
	},
	// 查找选择学生
	onStudent: function(e){
		var me = this;
		//var win = Ext.create('Youngshine.view.prepaid.Student'); 
		var win = Ext.create('Youngshine.view.student.Find');
		win.oldWin = this; //调用的父窗口，返回用 
		
		win.showAt(e.getXY()) 
		 
        var store = Ext.getStore('Student');
		store.removeAll();
		store.clearFilter();
		var obj = {
			"consultID": localStorage.getItem('consultID'),//me.record.data.km,
		}
		console.log(obj)
		var url = Youngshine.getApplication().dataUrl + 
			'readStudentList.php?data=' + JSON.stringify(obj); ;
		store.getProxy().url = url;
        store.load({
            callback: function(records, operation, success) {
				console.log(records);
				store.filter([
				   // {filterFn: function(item) { return item.get("km") != ''; }}
				]);
            },
            scope: this
        });
	},
});