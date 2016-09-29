Ext.define('Youngshine.controller.Student', {
    extend: 'Ext.app.Controller',

    views: [
        //'admin.List', //equal to required
    ],
	
	//stores: ['Student'],

    refs: [{
		ref: 'studentlist',
		selector: 'student-list'
    },{
		ref: 'studentnew',
		selector: 'student-new'
	},{
		ref: 'studentedit',
		selector: 'student-edit'	
	}],

    init: function() {
        this.control({
            'student-list': {
				addnew: this.studentNew,
				edit: this.studentEdit, //自定义事件 user...
				del: this.studentDelete,
				studyhist: this.studentStudyhist,//报读历史记录
				accnt: this.studentAccnt,//缴费历史记录
				followup: this.studentFollowup,
            },	
			'student-edit': {
				save: this.studenteditSave, 
            },
			'student-new': {
                save: this.studentnewSave,
            }			
        });
    },

	// 学生信息，包括添加删除排课以及历史报读课程，show跳转来自main controller
	showStudent: function(){
		var me = this;
		var win = Ext.create('Youngshine.view.student.List')
		win.down('grid').getStore().removeAll(); // 先晴空
		
		var obj = {
			//"schoolID": localStorage.getItem('schoolID')
			"consultID": localStorage.getItem('consultID')
		}
		
        var url = this.getApplication().dataUrl + 
			'readStudentList.php?data=' + JSON.stringify(obj);
        var store = Ext.getStore('Student');
		store.removeAll();
		store.clearFilter();
		store.getProxy().url = url;
        store.load({
            callback: function(records, operation, success) {
				console.log(records);
            },
            scope: this
        });
		
		// 分校区
		var obj = {
			"schoolID": localStorage.getItem('schoolID')
		}
        var url = this.getApplication().dataUrl + 
			'readSchoolsubList.php?data=' + JSON.stringify(obj);
        var store = Ext.getStore('Schoolsub');
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

    studentNew: function(button) {
		var me = this;
		me.studentnew = Ext.create('Youngshine.view.student.New');
    },
	studentnewSave: function(obj,win){ //obj用户信息
		var me = this;
		Ext.MessageBox.show({
		   msg: '正在保存',
		   width: 300,
		   wait: true,
		   waitConfig: {interval:200},
		});
		Ext.data.JsonP.request({
            url: this.getApplication().dataUrl + 'createStudent.php',
            callbackKey: 'callback',
            params:{
                data: JSON.stringify(obj)
            },
            success: function(result){
				Ext.MessageBox.hide(); console.log(result)
				if(result.success){
					//Ext.getStore('Student').load(); 
					//数据重新加载，最新添加的在前面
					obj.studentID = result.data.studentID; // model数组添加项目
					obj.created = '刚刚刚刚'
					Ext.getStore('Student').insert(0,obj); //新增记录，排在最前面
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
    studentEdit: function(record) {
		var me = this;
		me.studentedit = Ext.create('Youngshine.view.student.Edit')
		//Ext.widget('student-edit');
        me.studentedit.down('form').loadRecord(record); //binding data
    },
	studenteditSave: function(obj,oldWin){ //obj用户信息
		var me = this;
		Ext.MessageBox.show({
		   msg: '正在保存...',
		   width: 300,
		   wait: true,
		   waitConfig: {interval:200},
		});
		Ext.data.JsonP.request({
            url: this.getApplication().dataUrl + 'updateStudent.php',
            callbackKey: 'callback',
            params:{
                data: JSON.stringify(obj)
            },
            success: function(result){
				Ext.MessageBox.hide();
				if(result.success){
					//Ext.getStore('Student').load(); 
					//如何不重载，更新本地store当前记录？？？
					
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
	studentDelete: function(record){
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
			url: this.getApplication().dataUrl + 'deleteStudent.php',
			callbackKey: 'callback',
			params:{
				data: '{"studentID":' + record.data.studentID + '}'
			},
			success: function(result){
				Ext.MessageBox.hide();
				if(result.success){
					// 服务端删除成功后，客户端store当前记录同时删除，列表list才能相应显示 
					var store = Ext.getStore('Student'); //移除本地store记录
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

	// 收费明细
    studentAccnt: function(rec) {
		var me = this;
		var win = Ext.create('Youngshine.view.student.Accnt', 
			{record: rec
		}); 
		var obj = {
			"studentID": rec.data.studentID,
		};
		var store = Ext.getStore('Accnt'); 
		store.removeAll();
        var url = this.getApplication().dataUrl + 
			'readAccntListByStudent.php?data=' + JSON.stringify(obj);
		store.getProxy().url = url;
        store.load({
            callback: function(records, operation, success) {
		        if (success){
					console.log(records)
					var sum = me.sumAmt(records);; // 合计应收
					win.down('displayfield[itemId=subtotal]').setValue(sum); 
				};
            },
            scope: this
        }); 
    },		
	// 当前学生的报读历史课程
    studentStudyhist: function(rec) {
		var me = this;
		var win = Ext.create('Youngshine.view.student.Study', {
			record: rec // 父表传递参数，当前学生记录
		}); 
		//win.down('panel[itemId=info]').update(record.data);
		//win.setTitle( '报读知识点');

		// 获取当前委托单的检测项目
		var obj = {
			"studentID": rec.data.studentID,
			//"prepaid"  : 1 //已经缴费，不再可编辑
		};
		var store = Ext.getStore('Study'); 
		store.removeAll();
		store.clearFilter();
        var url = this.getApplication().dataUrl + 
			'readStudyListByHist.php?data=' + JSON.stringify(obj);
		store.getProxy().url = url;
        store.load({
            callback: function(records, operation, success) {
		        if (success){
					var sum = me.getApplication().getController('Study').sumFee();; // 合计公用函数
					win.down('displayfield[itemId=subtotal]').setValue(sum); 
				};
            },
            scope: this
        }); 
    },
	// 沟通记录
    studentFollowup: function(rec) {
		var me = this;
		var win = Ext.create('Youngshine.view.student.Followup', 
			{record: rec
		}); 
		var obj = {
			"studentID": rec.data.studentID,
		};
		var store = Ext.getStore('Followup'); 
		store.removeAll();
        var url = this.getApplication().dataUrl + 
			'readFollowupListByStudent.php?data=' + JSON.stringify(obj);
		store.getProxy().url = url;
        store.load({
            callback: function(records, operation, success) {
		        if (success){
					//var sum = me.sumAmt();; // 合计应收
					//win.down('displayfield[itemId=subtotal]').setValue(sum); 
				};
            },
            scope: this
        }); 
    },		
	
	// 表格合计公用函数
	sumAmt: function(records){
		var sum = 0; //合计费用
		/*var store = Ext.getStore('Accnt')
		store.each(function(record){
			sum += parseInt(record.get('amount'));
		}) */
		Ext.Array.each(records, function(record) {
	        sum += parseInt(record.data.amount);
	    });
		return sum;
	},	
});