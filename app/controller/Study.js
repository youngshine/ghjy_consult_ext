// 咨询师：学生报读知识点
Ext.define('Youngshine.controller.Study', {
    extend: 'Ext.app.Controller',

	//stores: ['Studying'],
	
    refs: [{
		ref: 'studentstudy',
		selector: 'student-study'
	},{
		ref: 'study',
		selector: 'study'
	},{
		ref: 'studykcb',
		selector: 'study-kcb'	
	},{
		ref: 'studyprepay',
		selector: 'prepay'
	}],

    init: function() {
        this.control({
			'student-study': {
				study: this.studentStudy,
			},
			'study': {
				//addnew: this.studyAdd,
				//studyingUpdateItem: this.studyingUpdateItem,
				del: this.studyDelete,
			},
			'study-kcb': {
				save: this.studykcbSave,
			},
			'prepaid': {
				save: this.prepaySave, //缴费
			},
			'studytest': {
				//studytestStudyptFind: this.studyptFind, //公用 studyptFind
				//studytestSearch: this.studytestSearch,
			},
			//查找选择知识点
			'zsd': {
				choose: this.zsdChoose,
			},					
        });
    },

	// 学生报读信息，包括添加删除排课，show跳转来自main controller
	showStudy: function(){
		var me = this;
		var win = Ext.create('Youngshine.view.study.List'); //Ext.widget('student');
		win.down('grid').getStore().removeAll(); // 先晴空
		
		var obj = {
			consultID: localStorage.getItem('consultID')
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
	},	
	// 缴费：预付款prepaid=0，show跳转来自main controller
	showPrepaid: function(){
		var me = this;
		var win = Ext.create('Youngshine.view.prepaid.List');
		win.down('grid').getStore().removeAll(); // 先晴空
		
		var obj = {
			"consultID": localStorage.getItem('consultID'),
			"prepaid"  : 0
		}
        var url = this.getApplication().dataUrl + 
			'readPrepaidList.php?data=' + JSON.stringify(obj);
        var store = Ext.getStore('Prepaid');
		store.removeAll();
		store.clearFilter();
		store.getProxy().url = url;
        store.load({
            callback: function(records, operation, success) {
				console.log(records);
				var sum = me.sumFee()
				win.down('displayfield[itemId=subtotal]').setValue(sum); 
            },
            scope: this
        });
	},
	// 待排课teacherID=0的课程（学生知识点），show跳转来自main controller
	showKcb: function(){
		var me = this;
		var win = Ext.create('Youngshine.view.study.Kcb');
		win.down('grid').getStore().removeAll(); // 先晴空
		
		var obj = {
			"consultID": localStorage.getItem('consultID'),
			"teacherID"  : 0
		}
        var url = this.getApplication().dataUrl + 
			'readStudyListByKcb.php?data=' + JSON.stringify(obj);
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

	
	// 当前学生的报名学习知识点
    studentStudy: function(rec) {
		var me = this;
		console.log(rec)
		//var win = Ext.widget('study', {record: record}); // 父表传递参数，当前学生记录
		var win = Ext.create('Youngshine.view.study.Study', {
			record: rec //包括 付款id
		});
		//win.down('panel[itemId=info]').update(record.data);
		//win.setTitle( '报读知识点');
		
		// 获取当前购买套餐的学习内容
		var obj = {
			"studentID": rec.data.studentID,
			"prepaidID": rec.data.prepaidID,
			//"prepaid"  : 0 //未缴费，可编辑
		};
		var store = Ext.getStore('Study'); 
		store.removeAll();
        var url = this.getApplication().dataUrl + 
			'readStudyList.php?data=' + JSON.stringify(obj);
		store.getProxy().url = url;
        store.load({
            callback: function(records, operation, success) {
		        if (success){
					var sum = me.sumFee(); // 合计公用函数
					win.down('displayfield[itemId=subtotal]').setValue(sum);
					//win.down('button[action=prepay]').setDisabled(sum==0) 
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
	
	/* 添加报名知识点
    studyAdd: function(record) {
		var me = this;

		var win = Ext.widget('zsd'); //公用类
		//win.down('panel[itemId=info]').update(record.data);
		//win.showAt(0,0)

		var store = Ext.getStore('Zsd'); 
		store.removeAll();
        var url = this.getApplication().dataUrl + 'readZsdList.php'
		store.getProxy().url = url;
        store.load({
            callback: function(records, operation, success) {
				console.log(records);
            },
            scope: this
        }); 
    },	*/
	// 表格行直接修改教师？？ 保存排课信息
    studykcbSave: function(obj,oldWin) {
        var me = this;
		Ext.MessageBox.show({
		   msg: '正在保存...',
		   width: 300,
		   wait: true,
		   waitConfig: {interval:200},
		});
		Ext.data.JsonP.request({
            url: this.getApplication().dataUrl +  'updateStudyByKcb.php',
            callbackKey: 'callback',
            params:{
                data: JSON.stringify(obj)
            },
            success: function(result){
                Ext.MessageBox.hide();
				if(result.success){
                    //Ext.Msg.alert('提示','委托检测申请单提交成功!');
					oldWin.close()
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
	// 添加报读知识点
	zsdChoose: function(obj,win){
		var me = this; 
		console.log(obj)
		//console.log(this.getStudy().record.get('studentID'))
		/*
		var obj = {
		    studentID : this.getStudy().record.get('studentID'), //当前学生
			zsdID : record.data.zsdID,
			zsdName: record.data.zsdName, //用于前端显示，不保存到后端
			fee: record.data.fee, // unitprice
		} */
		Ext.data.JsonP.request({ //不采用批量添加子表（传递数组），单个添加2014-3-20
            url: me.getApplication().dataUrl +  'createStudy.php',
            callbackKey: 'callback',
            params:{
                data: JSON.stringify(obj)
            },
            success: function(result){
				//更新前端store，最新插入记录ID，才能删除修改
				obj.studentstudyID = result.data.studentstudyID; // model数组添加项目
				Ext.getStore('Study').insert(0,obj); //新增记录，排在最前面
				//合计费用
				var sum = me.sumFee(); 
				me.getStudy().down('displayfield[itemId=subtotal]').setValue(sum); 
				//me.getStudy().down('button[action=prepay]').setDisabled(sum==0) 						
            }
		});
		/*
		var model = Ext.create('Newclass.model.Studying', {
		    student_id : v.record.get('student_id'),
			studypt_id : record.data.studypt_id,
			studypt_name: record.data.studypt_name, //用于前端显示，不保存到后端
			fee: record.data.keshi*record.data.unitprice, // unitprice
		});
		var store = Ext.getStore('Studying');
		store.add(model); //把选中记录，添加进来 insert(0,model) */
	},
	// 删除表格行
	studyDelete: function(record, win){
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
					var sum = me.sumFee(); //合计
					win.down('displayfield[itemId=subtotal]').setValue(sum); 
					win.down('button[action=prepay]').setDisabled(sum==0) 
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
	
	// 缴费create，并且更改报读课程付款标识update
    prepaySave: function(obj,oldWin) {
        var me = this; console.log(obj)
		Ext.MessageBox.show({
		   msg: '正在缴费...',
		   width: 300,
		   wait: true,
		   waitConfig: {interval:200},
		});
		Ext.data.JsonP.request({
            //url: this.getApplication().dataUrl +  'updateStudyByPrepay.php',
			url: this.getApplication().dataUrl +  'createPrepay.php',
            callbackKey: 'callback',
            params:{
                data: JSON.stringify(obj)
            },
            success: function(result){
                Ext.MessageBox.hide();
				if(result.success){
                    Ext.Msg.alert('提示','报读课程缴费成功!');
					oldWin.close()
					// 打印单据
					// 付款报读记录不再显示
					Ext.getStore('Study').removeAll()
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

	
	// 学科测评
    consultStudytest: function(record) {
		var me = this;

		var win = Ext.widget('studytest', {record: record}); // 传递参数，当前学生记录
		//win.down('panel[itemId=info]').update(record.data);
		win.setTitle( record.data.student_name + '学生学科测评');
    },	
    studytestSearch: function(obj,win) {
		var store = Ext.getStore('Topic'); 
		store.removeAll();
        var url = this.getApplication().dataUrl + 'readTopicList.php?data=' + JSON.stringify(obj);
		store.getProxy().url = url;
        store.load({
            callback: function(records, operation, success) {
				console.log(records);
            },
            scope: this
        });
    },
	// 查找返回知识点
	studytestStudypt: function(record){
		var v = this.getStudytest();
		v.down('hiddenfield[name=studypt_id]').setValue(record.data.studypt_id);
		var studypt = record.data.studypt_name + '（' +record.data.grade+record.data.semester+record.data.subject+ '）';
		v.down('textfield[name=studypt_name]').setValue(studypt);
		//v.down('displayfield[name=subject]').setValue(record.data.grade+record.data.semester+record.data.subject);
		v.onSearch(); // 打开窗口选择后，立即运行查找
	},
	
	// 公用类，搜索知识点 ，到studypt控制器，先获得store，再打开搜索表单
	studyptFind: function(src) {	
		//this.getApplication().getController('Studypt').findStudypt(src); //到相应的控制器处理，比较合适
        var url = this.getApplication().dataUrl + 'readStudyptList.php';
        var store = Ext.getStore('Studypt');
		store.removeAll();
		store.clearFilter();
		store.getProxy().url = url;
        store.load({
            callback: function(records, operation, success) {
				console.log(records);
				this.getApplication().getController('Studypt').findStudypt(src); //到相应的控制器处理，比较合适
            },
            scope: this
        });
    },
	
	// 表格合计公用函数
	sumFee: function(){
		var sum = 0; //合计费用
		var store = Ext.getStore('Study')
		store.each(function(record){
			//sum += parseInt(record.get('fee'));
			sum += parseInt(record.get('times'));
		})
		return sum;
		//console.log(win.down('label[itemId=subtotal]').text)
		//this.getStudy().down('displayfield[itemId=subtotal]').setValue(sum); 
	},	
});