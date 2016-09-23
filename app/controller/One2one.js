// 一对一
Ext.define('Youngshine.controller.One2one', {
    extend: 'Ext.app.Controller',
	
    refs: [{
		ref: 'one2onestudy',
		selector: 'one2one-study'	
	},{
		ref: 'one2onepk',
		selector: 'one2one-pk'
	}],

    init: function() {
        this.control({
			'one2one-pk': {
                study: this.one2onepkStudy,
            },
			'one2one-study': {
                //choose: this.classesclassesChoose,
            }					
        });
    },
	
	// 待排课的一对一报读课程，show跳转来自main controller
	showPk: function(){
		var me = this;
		me.classes = Ext.create('Youngshine.view.one2one.Pk')

		var obj = {
			//"schoolID": localStorage.schoolID,
			"consultID": localStorage.getItem('consultID'),
			"accntType": "一对一"
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
	},	
	
	// 安排学校内容
    one2onepkStudy: function(record) {
		var me = this;
		me.one2onestudy = Ext.create('Youngshine.view.one2one.Study')
		me.one2onestudy.parentRecord = record // 传递参数

		var obj = {
			"accntdetailID": record.data.accntdetailID,
		}
	    var url = this.getApplication().dataUrl + 
			'readStudyListByAccntdetail.php?data=' + JSON.stringify(obj);
	    var store = Ext.getStore('Study');
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
	classesclassesChoose: function(obj,oldView){
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
				me.classespk.down('grid').getStore().remove(record)		
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
		
		// 清除暂存表格数据
		me.classesedit.down('grid').getStore().removeAll() 
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
            url: me.getApplication().dataUrl + 'deleteClassStudent.php',
            params: obj,
            success: function(response){
				var ret = Ext.JSON.decode(response.responseText)	
				Ext.toast('学生移出成功',3000)
				// 消除本行
				oldView.down('grid').getStore().remove(record)
			},
        });
	},	
});