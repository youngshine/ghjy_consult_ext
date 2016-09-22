// 课程
Ext.define('Youngshine.controller.Kclist', {
    extend: 'Ext.app.Controller',

	//stores: ['Studying'],
	
    refs: [{
		ref: 'kclist',
		selector: 'kclist'
    },{
		ref: 'kclistnew',
		selector: 'kclist-new'
	},{
		ref: 'kclistedit',
		selector: 'kclist-edit'	
	}],

    init: function() {
        this.control({
			'kclist': {
				addnew: this.kclistNew,
				edit: this.kclistEdit, //自定义事件 user...
				del: this.kclistDelete,
            },
			'kclist-edit': {
				save: this.kclisteditSave, 
            },
			'kclist-new': {
                save: this.kclistnewSave,
            }					
        });
    },

	// 教师信息，包括添加删除排课以及历史报读课程，show跳转来自main controller
	showKclist: function(){
		var me = this;
		var win = Ext.create('Youngshine.view.kclist.List')
		//Ext.widget('student-list');
		win.down('grid').getStore().removeAll(); // 先晴空
		
		var obj = {
			"schoolID": localStorage.getItem('schoolID')
		}
        var url = this.getApplication().dataUrl + 
			'readKclist.php?data=' + JSON.stringify(obj);
        var store = Ext.getStore('Kclist');
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
	
    kclistNew: function(button) {
		var win = Ext.create('Youngshine.view.kclist.New')
    },
	kclistnewSave: function(obj,win){ //obj用户信息
		var me = this;
		Ext.MessageBox.show({
		   msg: '正在保存',
		   width: 300,
		   wait: true,
		   waitConfig: {interval:200},
		});
		Ext.data.JsonP.request({
            url: this.getApplication().dataUrl + 'createKclist.php',
            callbackKey: 'callback',
            params:{
                data: JSON.stringify(obj)
            },
            success: function(result){
				Ext.MessageBox.hide(); console.log(result)
				if(result.success){
					obj.studentID = result.data.studentID; // model数组添加项目
					obj.created = '刚刚刚刚'
					Ext.getStore('Kclist').insert(0,obj); //新增记录，排在最前面
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
    kclistEdit: function(record) {
		var win = Ext.create('Youngshine.view.kclist.Edit') 
		//Ext.widget('kclist-edit');
        win.down('form').loadRecord(record); //binding data
    },
	kclisteditSave: function(obj,oldWin){ //obj用户信息
		var me = this;
		Ext.MessageBox.show({
		   msg: '正在保存...',
		   width: 300,
		   wait: true,
		   waitConfig: {interval:200},
		});
		Ext.data.JsonP.request({
            url: this.getApplication().dataUrl + 'updateKclist.php',
            callbackKey: 'callback',
            params:{
                data: JSON.stringify(obj)
            },
            success: function(result){
				Ext.MessageBox.hide();
				if(result.success){
					// 更新前端store
					var model = oldWin.down('form').getRecord();
					model.set(obj) 
					
					oldWin.close();
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
	kclistDelete: function(record){
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
			url: this.getApplication().dataUrl + 'deleteKclist.php',
			callbackKey: 'callback',
			params:{
				data: '{"kclistID":' + record.data.kclistID + '}'
			},
			success: function(result){
				Ext.MessageBox.hide();
				if(result.success){
					var store = Ext.getStore('Kclist'); //移除本地store记录
					store.remove(record); //.removeAt(i); 
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
});