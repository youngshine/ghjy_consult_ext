// 咨询师：学生测评
Ext.define('Youngshine.controller.Assess', {
    extend: 'Ext.app.Controller',

	//stores: ['Studying'],
	
    refs: [{
		ref: 'assesstopic',
		selector: 'assess-topic'
	},{
		ref: 'assesslist',
		selector: 'assess-list'	
	}],

    init: function() {
        this.control({
			'assess-list': {
				addnew: this.assessNew,
				del: this.assessDelete,
				topic: this.assessTopic
			},
			'assess-new': {
				save: this.assessnewSave, //学科测评的父记录
			},
			'assess-topic': {
				//assess: this.assesstopic??,
				done: this.assesstopicDone, //评分对错
			},
			//查找选择知识点
			'assess-zsd': {
				choose: this.zsdChoose,
			},					
        });
    },


	// 测评（学生知识点），show跳转来自main controller
	showAssess: function(){
		var me = this;
		var win = Ext.create('Youngshine.view.assess.List');
		win.down('grid').getStore().removeAll(); // 先晴空
		
		var obj = {
			"consultID": localStorage.getItem('consultID'),
		}
        var url = this.getApplication().dataUrl + 
			'readAssessList.php?data=' + JSON.stringify(obj);
        var store = Ext.getStore('Assess');
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
	
    assessNew: function(button) {
		var win = Ext.widget('assess-new');
    },
	assessnewSave: function(obj,win){ //obj用户信息
		var me = this;
		Ext.MessageBox.show({
		   msg: '正在保存',
		   width: 300,
		   wait: true,
		   waitConfig: {interval:200},
		});
		Ext.data.JsonP.request({
            url: this.getApplication().dataUrl + 'createAssess.php',
            callbackKey: 'callback',
            params:{
                data: JSON.stringify(obj)
            },
            success: function(result){
				Ext.MessageBox.hide(); console.log(result)
				if(result.success){ //数据重新加载，最新添加的在前面
					obj.assessID = result.data.assessID; // model数组添加项目
					obj.created = '刚刚刚刚';
					Ext.getStore('Assess').insert(0,obj); //新增记录，排在最前面
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

	assessDelete: function(rec){
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
			url: this.getApplication().dataUrl + 'deleteAssess.php',
			callbackKey: 'callback',
			params:{
				data: '{"assessID":' + rec.data.assessID + '}'
			},
			success: function(result){
				Ext.MessageBox.hide();
				if(result.success){
					// 服务端删除成功后，客户端store当前记录同时删除，列表list才能相应显示 
					var store = Ext.getStore('Assess'); //移除本地store记录
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

	// 当前学生测评知识点（内容）
    assessTopic: function(rec) {
		var me = this; console.log(rec.data)
		//var win = Ext.widget('study', {record: record}); // 父表传递参数，当前学生记录
		var win = Ext.create('Youngshine.view.assess.Topic', {record: rec});
		//win.down('panel[itemId=info]').update(record.data);
		//win.setTitle( '报读知识点');
		
		// 获取当前测评记录
		var obj = {
			"assessID": rec.data.assessID,
			"subjectID": rec.data.subjectID, //题目按学科分3个表
		};
		console.log(obj)
		var store = Ext.getStore('Topic-assess'); 
		store.removeAll();
        var url = this.getApplication().dataUrl + 
			'readTopicAssessList.php?data=' + JSON.stringify(obj);
		store.getProxy().url = url;
        store.load({
            callback: function(records, operation, success) {
				console.log(records)
            },
            scope: this
        }); 
    },	
	// 添加报读知识点
	zsdChoose: function(obj,win){
		var me = this; 
		console.log(obj)
		Ext.data.JsonP.request({ 
            url: me.getApplication().dataUrl +  'createAssess.php',
            callbackKey: 'callback',
            params:{
                data: JSON.stringify(obj)
            },
            success: function(result){
				//更新前端store，最新插入记录ID，才能删除修改
				obj.assessID = result.data.assessID; // model数组添加项目
				Ext.getStore('Assess').insert(0,obj); //新增记录，排在最前面
						
            }
		});
	},		
	
	// 测评题目的评分对1错0
	assesstopicDone: function(done,fullDone,rec){
		var me = this;

		var obj = {
			"done": done,
			"assesstopicID": rec.data.assesstopicID
		}
		console.log(obj)
		Ext.data.JsonP.request({
			url: me.getApplication().dataUrl + 'updateTopicAssess.php',
			callbackKey: 'callback',
			params:{
				data: JSON.stringify(obj)
			},
			success: function(result){				
				if(result.success){			
					//本地更新数据：打分结果 model.set, setRecord/updateRecord
					// model = record
					//rec.set('done',done)
					//rec.set({'fullDone':fullDone})
				}else{
					Ext.Msg.alert(result.message); // 错误模式窗口
				}
			}
		});
	},	
	
	// 删除测评知识点表格行
	assesstopicDelete: function(record, oldWin){
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
			url: me.getApplication().dataUrl + 'deleteTopicAssess.php',
			callbackKey: 'callback',
			params:{
				data: '{"studentassessID":' + record.data.studentassessID + '}'
			},
			success: function(result){
				Ext.MessageBox.hide();
				if(result.success){
					Ext.getStore('Topic-assess').remove(record); //移除本地store记录
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