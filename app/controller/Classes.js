// 大小班级管理
Ext.define('Youngshine.controller.Classes', {
    extend: 'Ext.app.Controller',

	//stores: ['Studying'],
	
    refs: [{
		ref: 'classes',
		selector: 'classes'
    },{
		ref: 'classesnew',
		selector: 'classes-new'
	},{
		ref: 'classesedit',
		selector: 'classes-edit'
	},{
		ref: 'classesstudent',
		selector: 'classes-student'	
	},{
		ref: 'classespk',
		selector: 'classes-pk'
	}],

    init: function() {
        this.control({
			'classes': {
				addnew: this.classesNew,
				edit: this.classesEdit, //自定义事件 user...
				del: this.classesDelete,
				student: this.classesStudent, //显示班级学生，用于转班等
            },
			'classes-edit': {
				save: this.classeseditSave, 
            },
			'classes-new': {
                save: this.classesnewSave,
            },
			'classes-student': {
                del: this.classesstudentDelete,
            },
			'classes-pk': {
                classes: this.classespkClasses,
            },
			'classes-classes': {
                choose: this.classesclassesChoose,
            }					
        });
    },

	// 教师信息，包括添加删除排课以及历史报读课程，show跳转来自main controller
	showClasses: function(){
		var me = this;
		me.classes = Ext.create('Youngshine.view.classes.List')
		//Ext.widget('student-list');

		var obj = {
			"schoolID": localStorage.getItem('schoolID'),
			"schoolsubID": localStorage.getItem('schoolsubID'),
			"consultID": localStorage.getItem('consultID')
		}
        var url = this.getApplication().dataUrl + 
			'readClassesList.php?data=' + JSON.stringify(obj);
        var store = Ext.getStore('Classes');
		store.removeAll();
		store.clearFilter();
		store.getProxy().url = url;
        store.load({
            callback: function(records, operation, success) {
				console.log(records);
            },
            scope: this
        });
		
		// 全校教师
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
		
		// 全校课程
		var obj = {
			"schoolID": localStorage.getItem('schoolID'),
			"schoolsubID": localStorage.getItem('schoolsubID'),
			"kcType": '大小班'
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
	
	// 待排课的报读课程，show跳转来自main controller
	showPk: function(){
		var me = this;
		me.classespk = Ext.create('Youngshine.view.classes.Pk')
		//Ext.widget('student-list');

		var obj = {
			//"schoolID": localStorage.schoolID,
			"consultID": localStorage.getItem('consultID'),
			"accntType": "大小班"
		}		
        var url = this.getApplication().dataUrl + 
			'readAccntDetailByUnclass.php?data=' + JSON.stringify(obj);
        var store = Ext.getStore('AccntDetail');
		store.removeAll();
		store.clearFilter();
		store.getProxy().url = url;
        store.load({
            callback: function(records, operation, success) {
				console.log(records);
            },
            scope: this
        });
		
		// 全校课程
		var obj = {
			"schoolID": localStorage.getItem('schoolID'),
			"schoolsubID": localStorage.getItem('schoolsubID'),
			"kcType": '大小班'
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
	// 分班
    classespkClasses: function(record) {
		var me = this;
		me.classespkclasses = Ext.create('Youngshine.view.classes.Classes')
		me.classespkclasses.parentRecord = record // 传递参数

		var obj = {
			"kclistID": record.data.kclistID
		}
	    var url = this.getApplication().dataUrl + 
			'readClassesListByKclist.php?data=' + JSON.stringify(obj);
	    var store = Ext.getStore('Classes');
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
	classesclassesChoose: function(obj,parentRecord,oldView){
		var me = this;
		Ext.data.JsonP.request({ 
            url: Youngshine.app.getApplication().dataUrl +  'createClassesStudent.php',
            callbackKey: 'callback',
            params:{
                data: JSON.stringify(obj)
            },
            success: function(result){
				Ext.Msg.alert('提示','分班成功！');
				oldView.destroy()
				
				// 原来待分班当前行消失
				me.classespk.down('grid').getStore().remove(parentRecord)		
            }
		});
	},

    classesStudent: function(record) {
		var me = this;
		me.classesstudent = Ext.create('Youngshine.view.classes.Student')
		me.classesstudent.parentRecord = record // 传递参数

		var obj = {
			"classID": record.data.classID
		}
	    var url = this.getApplication().dataUrl + 
			'readClassesStudent.php?data=' + JSON.stringify(obj);
	    var store = Ext.getStore('ClassesStudent');
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
		
    classesNew: function(button) {
		var me = this;
		me.classesnew = Ext.create('Youngshine.view.classes.New')
		
		// 清除暂存表格数据
		me.classesnew.down('grid').getStore().removeAll() 
    },
	classesnewSave: function(obj,win){ //obj用户信息
		var me = this;
		Ext.MessageBox.show({
		   msg: '正在保存',
		   width: 300,
		   wait: true,
		   waitConfig: {interval:200},
		});
		Ext.Ajax.request({
            url: this.getApplication().dataUrl + 'createClasses.php',
            //callbackKey: 'callback',
            params: obj,
            success: function(response){
				Ext.MessageBox.hide(); 
				console.log(response.responseText)
				var ret = Ext.JSON.decode(response.responseText)
				if(ret.success){
					obj.classID = result.data.classID; // model数组添加项目
					//obj.created = '刚刚刚刚'
					Ext.getStore('Classes').insert(0,obj); //新增记录，排在最前面
					win.close(); //成功保存才关闭窗口
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
    classesEdit: function(record) {
		var me = this;
		me.classesedit = Ext.create('Youngshine.view.classes.Edit') 
		//Ext.widget('classes-edit');
        me.classesedit.down('form').loadRecord(record); //binding data
		
		// 上课周期列表数组，list.store
		var timely_list = record.data.timely_list.split(',')
		console.log(timely_list)
		var timely = [];
		for (var i = 0; i < timely_list.length; i++) {
			//timely.push( {"timely":timely_list[i]}  )
			var w = timely_list[i].substr(0,2),
				h = timely_list[i].substr(2,2),
				m = timely_list[i].substr(5,2)
			timely.push( {"w":w,"h":h,"m":m}  )
		}
		console.log(timely);
		me.classesedit.down('grid').getStore().loadData(timely)
    },
	classeseditSave: function(obj,oldWin){ //obj用户信息
		var me = this;
		Ext.MessageBox.show({
		   msg: '正在保存...',
		   width: 300,
		   wait: true,
		   waitConfig: {interval:200},
		});
		Ext.Ajax.request({
            url: this.getApplication().dataUrl + 'updateClasses.php',
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
	classesDelete: function(record){
		var me = this;
		Ext.MessageBox.show({
		   msg: '正在删除...',
		   width: 300,
		   wait: true,
		   waitConfig: {interval:200},
		});
		console.log(record)
		Ext.Ajax.request({
			// 删除服务端记录: 最好做个标记，别真正删除？或者过期的和定期的不能删除？
			url: this.getApplication().dataUrl + 'deleteClasses.php',
			//callbackKey: 'callback',
			params: {"classID": record.data.classID },
			success: function(response){
				Ext.MessageBox.hide();
				console.log(response.responseText)
				var ret = Ext.JSON.decode(response.responseText)
				if(ret.success){
					var store = Ext.getStore('Classes'); //移除本地store记录
					store.remove(record); //.removeAt(i); 
				}else{
					Ext.Msg.alert('提示',ret.message);
				}
			},
			failure: function(){
				Ext.MessageBox.hide();
				Ext.Msg.alert('网络错误','服务请求失败');
			}
		});	
	},
	
	// 移出学生（不是真正删除??，才能统计原来上课，用点名表）
	classesstudentDelete: function( record,oldView )	{
    	var me = this; 
		
		var obj = {
			classstudentID: record.data.classstudentID, // unique删除
			studentID: record.data.studentID,
			classID: record.data.classID,
			accntdetailID: record.data.accntdetailID //用于更改排班状态isClassed=0
		};
		console.log(obj)
		
		Ext.Ajax.request({
            url: me.getApplication().dataUrl + 'deleteClassesStudent.php',
            params: obj,
            success: function(response){
				var ret = Ext.JSON.decode(response.responseText)	
				Ext.Msg.alert('提示','学生成功移出到待分班！');
				// 消除本行
				oldView.down('grid').getStore().remove(record)
			},
        });
	},	
});