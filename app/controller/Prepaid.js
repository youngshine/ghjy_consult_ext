// 咨询师：销售课程、退款
Ext.define('Youngshine.controller.Prepaid', {
    extend: 'Ext.app.Controller',

	//stores: ['Studying'],
	
    refs: [{
		ref: 'prepaidnew',
		selector: 'prepaid-new'	
	},{
		ref: 'prepaidlist',
		selector: 'prepaid-list'
	}],

    init: function() {
        this.control({
			'prepaid-list': {
				addnew: this.prepaidNew,
				del: this.prepaidDelete,
				study: this.prepaidStudy
			},
			'prepaid-new': {
				save: this.prepaidnewSave, //缴费
			},				
        });
    },

	// show跳转来自main controller，购买课程：flag=0尚未添加内容
	showPrepaid: function(flag){
		var me = this;
		var win = Ext.create('Youngshine.view.prepaid.List');
		win.down('grid').getStore().removeAll(); // 先晴空
		
		var obj = {
			"consultID": localStorage.getItem('consultID'),
			//"prepaid"  : 0
		}
		var script = flag == 0 ? 'readPrepaidListByStudy.php?data=' : 'readPrepaidList.php?data=';
		var url = this.getApplication().dataUrl + script + JSON.stringify(obj);
        //var url = this.getApplication().dataUrl + 'readPrepaidList.php?data=' + JSON.stringify(obj);
        var store = Ext.getStore('Prepaid');
		store.removeAll();
		store.clearFilter();
		store.getProxy().url = url;
        store.load({
            callback: function(records, operation, success) {
				console.log(records);
				var sum = me.sumFunc()
				win.down('displayfield[itemId=subtotal]').setValue(sum); 
            },
            scope: this
        });
	},
	
	// show跳转来自main controller，各个校区课程价格表
	showPricelist: function(flag){
		var me = this;
		var win = Ext.create('Youngshine.view.prepaid.Pricelist');
		win.down('grid').getStore().removeAll(); // 先晴空
		
		var obj = {
			"schoolID": localStorage.getItem('schoolID')
		}
        var url = this.getApplication().dataUrl + 
			'readPricelist.php?data=' + JSON.stringify(obj);
        var store = Ext.getStore('Pricelist');
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
	
    prepaidNew: function(button) {
		var win = Ext.widget('prepaid-new');
    },
	prepaidnewSave: function(obj,win){ //obj用户信息
		var me = this;
		Ext.MessageBox.show({
		   msg: '正在保存',
		   width: 300,
		   wait: true,
		   waitConfig: {interval:200},
		});
		Ext.data.JsonP.request({
            url: this.getApplication().dataUrl + 'createPrepaid.php',
            callbackKey: 'callback',
            params:{
                data: JSON.stringify(obj)
            },
            success: function(result){
				Ext.MessageBox.hide(); console.log(result)
				if(result.success){ //数据重新加载，最新添加的在前面
					obj.prepaidID = result.data.prepaidID; // model数组添加项目
					obj.created = '刚刚刚刚';
					Ext.getStore('Prepaid').insert(0,obj); //新增记录，排在最前面
					win.close(); //成功保存才关闭窗口
				}else{		
					Ext.Msg.alert('提示',result.message);
				}	
			},
			failure: function(result){
				Ext.MessageBox.hide();
				Ext.Msg.alert('网络错误','服务请求失败');
			}
        });
	},	

	prepaidDelete: function(rec){
		var me = this;
		Ext.MessageBox.show({
		   msg: '正在删除...',
		   width: 300,
		   wait: true,
		   waitConfig: {interval:200},
		});
		console.log(rec)
		Ext.data.JsonP.request({
			// 删除服务端记录: 最好做个标记，别真正删除？或者过期的和定期的不能删除？
			url: this.getApplication().dataUrl + 'deletePrepaid.php',
			callbackKey: 'callback',
			params:{
				data: '{"prepaidID":' + rec.data.prepaidID + '}'
			},
			success: function(result){
				Ext.MessageBox.hide();
				if(result.success){
					// 服务端删除成功后，客户端store当前记录同时删除，列表list才能相应显示 
					var store = Ext.getStore('Prepaid'); //移除本地store记录
					store.remove(rec); //.removeAt(i); 
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
	
	// 按购买课时，分配课程（知识点）
	prepaidStudy: function(rec) {
		this.getApplication().getController('Study').studentStudy(rec);
	},
	
	// 表格合计公用函数
	sumFunc: function(){
		var sum = 0; //合计费用
		var store = Ext.getStore('Prepaid')
		store.each(function(record){
			sum += parseInt(record.get('amt'));
		})
		return sum;
	},	
});