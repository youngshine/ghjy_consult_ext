// 缴费
Ext.define('Youngshine.controller.Accnt', {
    extend: 'Ext.app.Controller',

	//stores: ['Studying'],
	
    refs: [{
		ref: 'accntlist',
		selector: 'accnt-list'	
	},{
		ref: 'accntnew',
		selector: 'accnt-new'	
	},{
		ref: 'accntedit',
		selector: 'accnt-edit'
	},{
		ref: 'accntfee',
		selector: 'accnt-fee'		
	}],

    init: function() {
        this.control({
			'accnt-list': {
				addnew: this.accntNew,
				edit: this.accntEdit,
				del: this.accntDelete,
				fee: this.accntFee,
			},	
			'accnt-new': {
				save: this.accntnewSave,
				addrow: this.accntnewAddrow
			},	
			'accnt-edit': {
				save: this.accnteditSave,
			},	
			'accnt-fee': {
				//addnew: this.accntfeeAddnew,
				del: this.accntfeeDelete,
			},	
			'fee-new': {
				save: this.feenewSave,
			},
        });
    },


	// 缴费，show跳转来自main controller
	showAccnt: function(){
		var me = this;
		var win = Ext.create('Youngshine.view.accnt.List');
		win.down('grid').getStore().removeAll(); // 先晴空
		
		var obj = {
			"consultID": localStorage.getItem('consultID'),
		} 
        //var url = this.getApplication().dataUrl + 'readAccntList.php?data=' + JSON.stringify(obj);
	    var url = this.getApplication().dataUrl + 
			'readOrdersList.php?data=' + JSON.stringify(obj);
        var store = Ext.getStore('Accnt');
		store.removeAll();
		store.clearFilter();
		store.getProxy().url = url;
        store.load({
            callback: function(records, operation, success) {
				console.log(records);
            },
            scope: this
        }); 
		
		// 该校的业绩咨询师
		var obj = {
			"schoolID": localStorage.getItem('schoolID'),
		} 
	    var url = this.getApplication().dataUrl + 
			'readConsultList.php?data=' + JSON.stringify(obj);
        var store = Ext.getStore('Consult');
		store.removeAll();
		store.clearFilter();
		store.getProxy().url = url;
        store.load({
            callback: function(records, operation, success) {
				console.log(records);
            },
            scope: this
        });
	},	
	
    accntNew: function(button) {
		var me = this;
		me.accntnew = Ext.create('Youngshine.view.accnt.New');
		
		// 业绩归属咨询师，默认为当前录入咨询师
		var combo = me.accntnew.down('combo[name=consultID_owe]')
		combo.setValue(localStorage.consultID)
		combo.setRawValue(localStorage.consultName)
		
		//先清除暂存的报读明细
		me.accntnew.down('grid').getStore().removeAll()
    },
	
	// 保存：accntType:一对一、大小班、退费退班 
	accntnewSave: function( obj,oldView )	{
    	var me = this; console.log(obj)
		// 传递参数，带有数组（子表多条记录）
		Ext.Ajax.request({
		    //url: me.getApplication().dataUrl + 'createAccntAndDetail.php',
			url: me.getApplication().dataUrl + 'createOrders.php', 
		    params: obj,
		    success: function(response){ 
				console.log(response.responseText)
				var ret = Ext.JSON.decode(response.responseText)
				//console.log(ret.data.accntID);
				obj.accntID = ret.data.accntID
				obj.current = 1; //状态
				//obj.created = '刚刚';
				Ext.getStore('Accnt').insert(0,obj)	
				
				oldView.destroy()
				
				// 发送模版消息：电子收据
				wxTpl(obj); 

				function wxTpl(person){
					var objWx = {
						wxID       : person.wxID, // 发消息学生家长
						student    : person.studentName,
						accntID    : person.accntID,
						accntType  : person.accntType,
						accntDate  : person.accntDate,
						amount_ys  : person.amount_ys,
						amount     : person.amount,
						amount_now : person.amount_now, //本次缴款
						school     : localStorage.school
					}
					console.log(objWx)
					Ext.Ajax.request({
					    url: me.getApplication().dataUrl + 
							'weixinJS_gongzhonghao/wx_msg_tpl_accnt.php',
					    params: objWx,
					    success: function(response){
					        var text = response.responseText;
					        // process server response here
							console.log(text)//JSON.parse
					    }
					});
				} // 模版消息end
				
				/* php 后台无法处理，数组arrClassess???
				if(obj.accntType == '大小班'){
					//往class_student表，添加报读的班级，直接在后台php处理？？？
					var objClasses = {
						accntID: obj.accntID,
						studentID: obj.studentID,
						classID: obj.arrClasses['classID'],
					}
					Ext.Ajax.request({
					    url: me.getApplication().dataUrl + 'createClassStudent.php',
					    params: obj.arrClasses,
					    success: function(response){
					    	
					    }
					})
				}	*/		
		    }
		});
	},
	
    accntEdit: function(record) {
		var me = this; 
		me.accntedit = Ext.create('Youngshine.view.accnt.Edit') 
		//Ext.widget('classes-edit');
        me.accntedit.down('form').loadRecord(record); //binding data
		
		// radio 类型
		var accntType = record.data.accntType
		if(accntType=='大小班'){
			accntType=1
		}else if(accntType=='一对一'){
			accntType=2
		}else{
			accntType=3
		}
		var radioAccntType = me.accntedit.down('radiogroup[itemId=accntType]')
			.down('radio[inputValue='+accntType+']')
		if(radioAccntType) radioAccntType.setValue(true); //打勾checked
		
		// radio 付款方式
		var payment = record.data.payment
		if(payment=='现金'){
			payment=1
		}else if(accntType=='刷卡'){
			payment=2
		}else if(accntType=='微信'){
			payment=3
		}else{
			payment=4
		}
		var radioPayment = me.accntedit.down('radiogroup[itemId=payment]')
			.down('radio[inputValue='+payment+']')
		if(radioPayment) radioPayment.setValue(true); //打勾checked
		
		// 缴费子表记录，临时表，不用store，用jsonp???
		var obj = {
			"accntID": record.data.accntID,
		} 
		console.log(obj)
		Ext.data.JsonP.request({ 
            url: me.getApplication().dataUrl +  
				'readAccntDetailByAccnt.php',
            callbackKey: 'callback',
            params:{
                data: JSON.stringify(obj)
            },
            success: function(result){
				console.log(result)
				var store = me.accntedit.down('grid').getStore()
				store.loadData(result.data)	
            }
		});
  
        //var url = this.getApplication().dataUrl + 'readAccntDetailByAccnt.php?data=' + JSON.stringify(obj);
		//var store = Ext.getStore('AccntDetail');
		//var store = me.accntedit.down('grid').getStore()
		/*store.removeAll();
		//store.clearFilter();
		store.getProxy().url = url;
        store.load({
            callback: function(records, operation, success) {
				console.log(records);
            },
            scope: this
        }); */
    },
	
	// 只修改主表，明细记录不能修改
	accnteditSave: function(obj,oldWin){ //obj用户信息
		var me = this;
		Ext.MessageBox.show({
		   msg: '正在保存...',
		   width: 300,
		   wait: true,
		   waitConfig: {interval:200},
		});
		Ext.Ajax.request({
            //url: this.getApplication().dataUrl + 'updateAccnt.php',
			url: this.getApplication().dataUrl + 'updateOrders.php',
            //callbackKey: 'callback',
            params: obj,
            success: function(response){
				Ext.MessageBox.hide();
				console.log(response.responseText)
				var ret = Ext.JSON.decode(response.responseText)
				if(ret.success){
					// 更新前端store
					var model = oldWin.down('form').getRecord();
					model.set(obj) 
					
					oldWin.close();
				}else{	
					Ext.Msg.alert('提示',ret.message);
				}	
			},
			failure: function(result){
				Ext.MessageBox.hide();
				Ext.Msg.alert('网络错误','服务请求失败');
			}
        });
	},
	accntDelete: function(record){
		var me = this;
		Ext.MessageBox.show({
		   msg: '正在删除...',
		   width: 300,
		   wait: true,
		   waitConfig: {interval:200},
		});
		
		var obj = {"accntID": record.data.accntID }
		console.log(obj)
		
		Ext.Ajax.request({
			// 删除服务端记录: 最好做个标记，别真正删除？或者过期的和定期的不能删除？
			//url: this.getApplication().dataUrl + 'deleteAccnt.php',
			url: me.getApplication().dataUrl + 'deleteOrders.php',
			//callbackKey: 'callback',
			params: obj,
			success: function(response){
				Ext.MessageBox.hide();
				console.log(response.responseText)
				var ret = Ext.JSON.decode(response.responseText)
				if(ret.success){
					var store = Ext.getStore('Accnt'); //移除本地store记录
					store.remove(record); //.removeAt(i); 
				}else{
					Ext.Msg.alert('提示',ret.message);
				}
			},
			failure: function(){
				Ext.MessageBox.hide();
				Ext.Msg.alert('错误','服务请求失败');
			}
		});	
	},
	
	// 某个订单的收费明细 ajax instead of jsonp???
    accntFee: function(record) {
		var me = this;
		var win = Ext.create('Youngshine.view.accnt.Fee', 
			{parentRecord: record}
		); 
		var params = {
			"accntID": record.data.accntID,
		};
		console.log(params)
		var store = Ext.getStore('AccntFee'); 
		store.removeAll();
		store.clearFilter()
        var url = this.getApplication().dataUrl + 
			'readAccntFee.php?data=' + JSON.stringify(params);
		store.getProxy().url = url; // jsonp
        store.load({
            callback: function(records, operation, success) {
		        if (success){
					console.log(records)
					//var sum = me.sumAmt(records);; // 合计
					//win.down('displayfield[itemId=subtotal]').setValue(sum); 
				};
            },
            scope: this
        }); 
    },
	
	// 添加报读课程明细（大小班、一对一、退费）
	accntnewAddrow: function(accntType,oldView){
		var me = this;
		
		switch(accntType){
		case '大小班':
			me.kclist = Ext.create('Youngshine.view.accnt.KclistClass')
			me.kclist.parentView = oldView; //方便父表单显示选中项
			me.kclist.showAt(0,0)
			
			var obj = {
				"schoolID": localStorage.getItem('schoolID'),
				"kcType": accntType
			} 
			var store = Ext.getStore('Kclist'); 
			store.removeAll();
			store.clearFilter();
	        var url = this.getApplication().dataUrl + 
				'readKclist.php?data=' + JSON.stringify(obj);
			store.getProxy().url = url;
	        store.load({
	            callback: function(records, operation, success) {

	            },
	            scope: this
	        });
			break;
		case '一对一':
			me.kclist = Ext.create('Youngshine.view.accnt.KclistOne2one')
			me.kclist.parentView = oldView; //方便父表单显示选中项
			me.kclist.show()
			
			var obj = {
				"schoolID": localStorage.getItem('schoolID'),
				"kcType": accntType
			} 
			var store = Ext.getStore('Kclist'); 
			store.removeAll();
			store.clearFilter();
	        var url = this.getApplication().dataUrl + 
				'readKclist.php?data=' + JSON.stringify(obj);
			store.getProxy().url = url;
	        store.load({
	            callback: function(records, operation, success) {

	            },
	            scope: this
	        });
			break;
		case '退费退班':
			me.kclist = Ext.create('Youngshine.view.accnt.KclistRefund')
			me.kclist.parentView = oldView; //方便父表单显示选中项
			me.kclist.show()
			
			var obj = {
				"schoolID": localStorage.getItem('schoolID'),
				"studentID": oldView.down('hiddenfield[name=studentID]').getValue()
				// 有学生，才能有供退费的单子
			} 
			var store = Ext.getStore('AccntDetail'); //store会重复冲突吗？
			store.removeAll();
			store.clearFilter();
	        var url = this.getApplication().dataUrl + 
				'readAccntDetailByRefund.php?data=' + JSON.stringify(obj);
			store.getProxy().url = url;
	        store.load({
	            callback: function(records, operation, success) {
					console.log(records)
	            },
	            scope: this
	        });
			break;
		}
	},	

	feenewSave: function( obj,oldView )	{
    	var me = this; 
		console.log(obj)
		Ext.Ajax.request({ 
            url: me.getApplication().dataUrl +  'createAccntFee.php',
            params: obj,
            success: function(response){
				var ret = JSON.parse(response.responseText)
				//更新前端store，最新插入记录ID，才能删除修改
				obj.accntfeeID = ret.data.accntfeeID; 
				// model数组添加项目
				Ext.getStore('AccntFee').insert(0,obj); //新增记录，排在最前面	
				
				oldView.destroy()
            }
		});
	},	
	accntfeeDelete: function(record){
		var me = this
		Ext.Ajax.request({
		    url: me.getApplication().dataUrl + 'deleteAccntFee.php',
		    params: {
				accntfeeID : record.data.accntfeeID 
		    },
		    success: function(response){
				var ret = JSON.parse(response.responseText)
				//Ext.toast(ret.message,3000)
				if(ret.success){
					Ext.getStore('AccntFee').remove(record);
				}		         
		    }
		});
	},
	
});