// 咨询师：待缴费
Ext.define('Youngshine.controller.Pay', {
    extend: 'Ext.app.Controller',

	//stores: ['Studying'],
	
    refs: [{
		ref: 'studentpay',
		selector: 'student-pay'
	},{
		ref: 'pay',
		selector: 'pay'	
	}],

    init: function() {
        this.control({
			'student-pay': {
				pay: this.studentPay,
			},
			'pay': {
				//addnew: this.studyAdd,
				//studyingUpdateItem: this.studyingUpdateItem,
				del: this.payDelete,
			},					
        });
    },

	// 当前学生的报名学习知识点
    studentPay: function(record) {
		var me = this;
		var win = Ext.widget('pay', {record: record}); // 父表传递参数，当前学生记录
		//win.down('panel[itemId=info]').update(record.data);
		//win.setTitle( '报读知识点');

		// 获取当前委托单的检测项目
		var obj = {
			"studentID": record.data.studentID,
			"checked": 0 //未付款审核
		};
		var store = Ext.getStore('Study'); 
		store.removeAll();
        var url = this.getApplication().dataUrl + 
			'readStudyListByPay.php?data=' + JSON.stringify(obj);
		store.getProxy().url = url;
        store.load({
            callback: function(records, operation, success) {
		        if (success){
					me.sumFee(); // 合计公用函数
					/*var sum = 0; //合计费用
					for (var i=0;i<store.data.length;i++){
						sum = sum + parseInt(records[i].get('fee'));
					}
					//console.log(win.down('label[itemId=subtotal]').text)
					win.down('label[itemId=subtotal]').setText('合计金额（元）：'+sum);  */
				};
            },
            scope: this
        }); 
    },	
	

	// 表哥行直接修改教师
    studyingUpdateItem: function(obj) {
        var me = this;
		Ext.MessageBox.show({
		   msg: '正在保存...',
		   width: 300,
		   wait: true,
		   waitConfig: {interval:200},
		});
		Ext.data.JsonP.request({
            url: this.getApplication().dataUrl +  'updateStudyingTeacher.php',
            callbackKey: 'callback',
            params:{
                data: JSON.stringify(obj)
            },
            success: function(result){
                Ext.MessageBox.hide();
				if(result.success){
                    //Ext.Msg.alert('提示','委托检测申请单提交成功!');
                }else{
                    Ext.Msg.alert('提示',result.message);
                }    
            },
            failure: function(){
                Ext.MessageBox.hide();
				Ext.Msg.alert('提示','服务请求失败！');
            }
        });
    },

	// 删除表格行
	payDelete: function(record, win){
		var me = this;
		Ext.MessageBox.show({
		   msg: '正在删除...',
		   width: 300,
		   wait: true,
		   waitConfig: {interval:200},
		});
		console.log(record)
		Ext.data.JsonP.request({
			// 删除服务端记录: 最好做个标记，别真正删除？或者过期的和定期的不能删除？
			url: me.getApplication().dataUrl + 'deleteStudy.php',
			callbackKey: 'callback',
			params:{
				data: '{"studentstudyID":' + record.data.studentstudyID + '}'
			},
			success: function(result){
				Ext.MessageBox.hide();
				if(result.success){
					// 服务端删除成功后，客户端store当前记录同时删除，列表list才能相应显示 
					Ext.getStore('Study').remove(record); //移除本地store记录
					me.sumFee(); //合计
					/*var sum = 0;
					store.each(function(record){
						sum += parseInt(record.data.fee)
					})
					win.down('label[itemId=subtotal]').setText('合计金额（元）：'+sum); */
				}else{
					Ext.Msg.alert('提示',result.message);
				}
			},
			failure: function(){
				Ext.MessageBox.hide();
				Ext.Msg.alert('网络错误','服务请求失败');
			}
		});	
	},	
	
	// 表格合计公用函数
	sumFee: function(){
		var sum = 0; //合计费用
		var store = Ext.getStore('Study')
		store.each(function(record){
			sum += parseInt(record.get('fee'));
		})
		//console.log(win.down('label[itemId=subtotal]').text)
		this.getPay().down('displayfield[itemId=subtotal]').setValue(sum)
	},	
});