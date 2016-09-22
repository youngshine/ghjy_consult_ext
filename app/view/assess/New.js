Ext.define('Youngshine.view.assess.New', {
    extend: 'Ext.window.Window',
    alias : 'widget.assess-new',
	id: 'winAssessNew',
	
	autoShow: true,
	modal: true,
	resizable: false,
	closable: false,
	width: 450,
	//height: 300,
	//layout: 'fit',
	title : '新增',

    fbar : ['->',{	
		text: '保存',
		handler: function(btn){
			btn.up('window').onSave();
		}
	},{
		text: '取消',
		handler: function(btn){
			btn.up('window').destroy();
			//this.close();
		}
	}],	
	
	items: [{
		xtype: 'form',
		bodyPadding: 10,
		fieldDefaults: {
			labelWidth: 65,
			labelAlign: 'right',
			anchor: '100%'
		},
		items: [{
			xtype: 'textfield',
			itemId : 'studentName',
			//width: 310,
			fieldLabel: '学生姓名',
			readOnly: true,
			listeners: {
		        click: {
		            element: 'el', //bind to the underlying el property on the panel
		            fn: function(e){ 					
						Ext.getCmp('winAssessNew').onStudent(e)
					},
		        },	
		    },
		},{
			xtype: 'hiddenfield', // 学生id，隐藏
			itemId: 'studentID',
		},{
			xtype: 'displayfield',
			itemId: 'grade',
			fieldLabel: '注册年级',	
			disabled: true
			
		},{	
			xtype: 'combo',
			itemId: 'subject',
			store: {
				fields: ['id','value'],
				data : [
					{"id":1,"value":"数学"},
					{"id":2,"value":"物理"},
					{"id":3,"value":"化学"},
				]
			},
			valueField: 'id',
			displayField: 'value',
			editable: false,
			fieldLabel: '测评学科'	
		},{	
			xtype: 'combo',
			itemId: 'mygrade',
			store: {
				fields: ['id','value'],
				data : [
					{"id":1,"value":"一年级"},
					{"id":2,"value":"二年级"},
					{"id":3,"value":"三年级"},
					{"id":4,"value":"四年级"},
					{"id":5,"value":"五年级"},
					{"id":6,"value":"六年级"},
					{"id":7,"value":"七年级"},
					{"id":8,"value":"八年级"},
					{"id":9,"value":"九年级"},
				]
			},
			valueField: 'id',
			displayField: 'value',
			editable: false,
			fieldLabel: '年级'	
		},{	
			xtype: 'combo',
			itemId: 'semester',
			store: {
				fields: ['value'],
				data : [
					{"value":"上"},
					{"value":"下"}
				]
			},
			valueField: 'value',
			displayField: 'value',
			editable: false,
			fieldLabel: '学期'
		}],
    }],
   
	onSave: function(){
		var me = this; 
		var studentName = this.down('textfield[itemId=studentName]').getValue().trim(),
			studentID = this.down('hiddenfield[itemId=studentID]').getValue(),
			//grade = this.down('displayfield[itemId=grade]').getValue(),
			subjectID = this.down('combo[itemId=subject]').getValue(),
			subjectName = this.down('combo[itemId=subject]').getRawValue(),
			gradeID = this.down('combo[itemId=mygrade]').getValue(),//要测评年级
			gradeName = this.down('combo[itemId=mygrade]').getRawValue(),
			semester = this.down('combo[itemId=semester]').getValue()
		
		if (studentName == ''){
			Ext.Msg.alert('提示','请选择要测评的学生！');
			return;
		}		
		if(subjectID == null ){
			Ext.Msg.alert('提示','请选择测评学科！');
			return;
		}
		if(gradeID == null ){
			Ext.Msg.alert('提示','请选择年级！');
			return;
		}
		if(semester == null ){
			Ext.Msg.alert('提示','请选择学期！');
			return;
		}

		Ext.Msg.confirm('询问','是否保存？',function(id){
			if( id == "yes"){
				//if(viewEF.isValid()){
					var obj = {
						"studentName": studentName,
						"studentID": studentID,
						//"grade": grade, // 前端显示用
						"subjectID": subjectID,
						"subjectName": subjectName,	
						"gradeID": gradeID,
						"gradeName": gradeName,	
						"semester": semester,			
						//"consultID": localStorage.consultID, //当前登录的咨询师
					};
					console.log(obj);
					//me.close();
					me.fireEvent('save',obj,me); //后台数据判断，才能关闭  本窗口win
				//}
			}
		})
	},
	// 查找选择学生
	onStudent: function(e){
		var me = this;
		var win = Ext.create('Youngshine.view.student.Find');
		win.oldWin = this; //调用的父窗口，返回用 
		win.showAt(e.getXY())  
        var store = Ext.getStore('Student');
		store.removeAll();
		store.clearFilter();
		var obj = {
			"consultID": localStorage.getItem('consultID'),//me.record.data.km,
		}
		console.log(obj)
		var url = Youngshine.getApplication().dataUrl + 
			'readStudentList.php?data=' + JSON.stringify(obj); ;
		store.getProxy().url = url;
        store.load({
            callback: function(records, operation, success) {
				console.log(records);
				store.filter([
				   // {filterFn: function(item) { return item.get("km") != ''; }}
				]);
            },
            scope: this
        });
	},
});