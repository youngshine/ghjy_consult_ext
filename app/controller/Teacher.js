Ext.define('Youngshine.controller.Teacher', {
    extend: 'Ext.app.Controller',

    views: [
        //'admin.List', //equal to required
    ],
	
	//stores: ['Student'],

    refs: [{
		ref: 'teacherlist',
		selector: 'teacher-list'
    },{
		ref: 'teachernew',
		selector: 'teacher-new'
	},{
		ref: 'teacheredit',
		selector: 'teacher-edit'	
	}],

    init: function() {
        this.control({
            'teacher-list': {
				addnew: this.teacherNew,
				edit: this.teacherEdit, //自定义事件 user...
				del: this.teacherDelete,
            },
			'teacher-edit': {
				save: this.teachereditSave, 
            },
			'teacher-new': {
                save: this.teachernewSave,
            }				
        });
    },

	// 教师信息，包括添加删除排课以及历史报读课程，show跳转来自main controller
	showTeacher: function(){
		var me = this;
		var win = Ext.create('Youngshine.view.teacher.List') //Ext.widget('student-list');
		win.down('grid').getStore().removeAll(); // 先晴空
		
		var obj = {
			"schoolID": localStorage.getItem('schoolID')
		}
        var url = this.getApplication().dataUrl + 
			'readTeacherList.php?data=' + JSON.stringify(obj);
        var store = Ext.getStore('Teacher');
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
	
    teacherNew: function(button) {
		var win = Ext.create('Youngshine.view.teacher.New') 
		//Ext.widget('teacher-new');
		var store = Ext.create('Ext.data.Store', {
		     fields: ['subjectID','subjectName'],
		     proxy: {
		         type: 'jsonp',
		         url: '',
		         reader: {
		             type: 'json',
		             root: 'data'
		         }
		     },
		     autoLoad: false
		});
		store.getProxy().url = this.getApplication().dataUrl + 'readSubjectList.php'
		store.load({
			callback: function(records, operation, success) {
				console.log(records);
				win.down('combo[name=subjectID]').store = store
			},
			scope: this
		});
    },
	teachernewSave: function(obj,win){ //obj用户信息
		var me = this;
		Ext.MessageBox.show({
		   msg: '正在保存',
		   width: 300,
		   wait: true,
		   waitConfig: {interval:200},
		});
		Ext.data.JsonP.request({
            url: this.getApplication().dataUrl + 'createTeacher.php',
            callbackKey: 'callback',
            params:{
                data: JSON.stringify(obj)
            },
            success: function(result){
				Ext.MessageBox.hide(); console.log(result)
				if(result.success){
					//Ext.getStore('Student').load(); //数据重新加载，最新添加的在前面
					obj.studentID = result.data.studentID; // model数组添加项目
					obj.created = '刚刚刚刚'
					Ext.getStore('Teacher').insert(0,obj); //新增记录，排在最前面
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
    teacherEdit: function(record) {
		var win = Ext.create('Youngshine.view.teacher.Edit') 
		//Ext.widget('teacher-edit');
        win.down('form').loadRecord(record); //binding data
		
		var store = Ext.create('Ext.data.Store', {
		     fields: ['subjectID','subjectName'],
		     proxy: {
		         type: 'jsonp',
		         url: '',
		         reader: {
		             type: 'json',
		             root: 'data'
		         }
		     },
		     autoLoad: false
		});
		store.getProxy().url = this.getApplication().dataUrl + 'readSubjectList.php'
		store.load({
			callback: function(records, operation, success) {
				console.log(records);
				win.down('combo[name=subjectID]').store = store
			},
			scope: this
		});
		 
    },
	teachereditSave: function(obj,oldWin){ //obj用户信息
		var me = this;
		Ext.MessageBox.show({
		   msg: '正在保存...',
		   width: 300,
		   wait: true,
		   waitConfig: {interval:200},
		});
		Ext.data.JsonP.request({
            url: this.getApplication().dataUrl + 'updateTeacher.php',
            callbackKey: 'callback',
            params:{
                data: JSON.stringify(obj)
            },
            success: function(result){
				Ext.MessageBox.hide();
				if(result.success){
					//Ext.getStore('Student').load(); //如何不重载，更新本地store当前记录？？？
					
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
	teacherDelete: function(record){
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
			url: this.getApplication().dataUrl + 'deleteTeacher.php',
			callbackKey: 'callback',
			params:{
				data: '{"teacherID":' + record.data.teacherID + '}'
			},
			success: function(result){
				Ext.MessageBox.hide();
				if(result.success){
					// 服务端删除成功后，客户端store当前记录同时删除，列表list才能相应显示 
					var store = Ext.getStore('Teacher'); //移除本地store记录
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