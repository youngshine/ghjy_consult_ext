// 课程知识点 排课
Ext.define('Youngshine.view.study.Study-kcb', {
    extend: 'Ext.window.Window',
    alias : 'widget.study-kcb',
	id: 'winStudyKcb',
	
	autoShow: true,
	modal: true,
	resizable: false,
	closable: false,
	width: 450,
	//height: 300,
	//layout: 'fit',
	title : '一对多教学排课',
	
	record: null,
	
	fbar: ['->',{	
		xtype: 'button',
		text: '保存',
		tooltip: '保存排课',
		width: 55,
		action: 'save',
		disabled: true,
		//scale: 'medium',
		handler: function(btn){
			btn.up('window').onSave(); //onAdd是系统保留reserved word
		}
	},{	
		xtype: 'button',
		text: '取消',
		//scale: 'medium',
		width: 55,
		style: {
			//background: 'transparent',
			border: 1 //'1px solid #fff'
		},
		handler: function(btn){
			btn.up('window').close()
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
			xtype: 'combo',
			name: 'teach_weekday',
			store: {
				fields: ['value'],
				data : [
					{"value":"周一"},
					{"value":"周二"},
					{"value":"周三"},
					{"value":"周四"},
					{"value":"周五"},
					{"value":"周六"},
					{"value":"周日"}
				]
			},
			valueField: 'value',
			displayField: 'value',
			editable: false,
			fieldLabel: '上课日'	
		},{
			xtype: 'combo',
			name: 'teach_timespan',
			store: {
				fields: ['value'],
				data : [
					{"value":"08-10"},
					{"value":"10-12"},
					{"value":"14-16"},
					{"value":"16-18"},
					{"value":"19-21"}
				]
			},
			valueField: 'value',
			displayField: 'value',
			editable: false,
			fieldLabel: '时间段'
		/*	
		},{
			xtype: 'timefield',
	        name: 'teach_end',
	        fieldLabel: '下课时间',
	        minValue: '9:00',
	        maxValue: '22:00',
	        increment: 30,
	        anchor: '100%'	*/
		},{	
	        xtype: 'fieldcontainer',
			layout: 'hbox',
	        defaults: {
	            anchor: '100%'
	        },
			items: [{
				xtype: 'textfield',
				name : 'teacherName',
				fieldLabel: '学科教师',
				width: '100%',
				labelWidth: 65,
				labelAlign: 'right',
				emptyText: '',
				readOnly: true,
				//enableKeyEvents: true,
				listeners: {
			        click: {
			            element: 'el', //bind to the underlying el property on the panel
			            fn: function(e){ 					
							Ext.getCmp('winStudyKcb').onTeacher(e)
						},
			        },	
			    },
			},{
				xtype: 'hiddenfield', // 关联知识点id，隐藏
				name: 'teacherID',		
			}]	/*
		},{
			xtype: 'combo',
			name: 'teacherID',
		    store: 'Teacher',
		    queryMode: 'local',
			valueField: 'teacherID',
			displayField: 'teacherName',
			editable: false,
			fieldLabel: '学科教师' */
		},{
			xtype:'textfield',
			name: 'note',
			fieldLabel: '备注',
			labelWidth: 65,
			labelAlign: 'right',	
		},{
			xtype: 'hiddenfield',
			name: 'studentstudyID' //unique for update
		}],
    }],
   
	onSave: function(){
		var me = this; 
		console.log(this.down('combo[name=teach_timespan]').getValue())
		console.log(this.down('hiddenfield[name=studentstudyID]').getValue())
			
		var teach_weekday = this.down('combo[name=teach_weekday]').getValue(),
			teach_timespan = this.down('combo[name=teach_timespan]').getValue(),
			teacherID = this.down('hiddenfield[name=teacherID]').getValue(),
			teacherName = this.down('textfield[name=teacherName]').getValue(),
			note = this.down('textfield[name=note]').getValue(),
			studentstudyID = this.down('hiddenfield[name=studentstudyID]').getValue()
		
		if (teach_weekday == null || teach_weekday == ''){
			Ext.Msg.alert('提示','请先选择上课日');
			return;
		}
		if (teach_timespan == null || teach_timespan == ''){
			Ext.Msg.alert('提示','请先选择上课时间段');
			return;
		}
		// 分配教师，允许空白，以后再选教师
		if(teacherID == null) teacherID=0;

		Ext.Msg.confirm('询问','是否保存？',function(id){
			if( id == "yes"){
				//if(viewEF.isValid()){
					var obj = {
						"teach_weekday": teach_weekday,
						"teach_timespan": teach_timespan,
						"teacherID": teacherID,
						"teacherName": teacherName,
						"note": note,
						"studentstudyID": studentstudyID // unique

					};
					console.log(obj);
					//me.close();
					me.fireEvent('save',obj,me); //后台数据判断，才能关闭  本窗口win
					
					// 前端store立即更新
					me.record.set(obj)
				//}
			}
		})
	},
	
	// 选择给时间段s的学科教师
	onTeacher: function(e){
		var me = this;
		var teach_weekday = this.down('combo[name=teach_weekday]').getValue(),
			teach_timespan = this.down('combo[name=teach_timespan]').getValue()
		
		if (teach_weekday == null || teach_weekday == ''){
			Ext.Msg.alert('提示','请先选择上课日');
			return;
		}
		if (teach_timespan == null || teach_timespan == ''){
			Ext.Msg.alert('提示','请先选择上课时间段');
			return;
		}

		var win = Ext.create('Youngshine.view.study.Teacher');  
		win.record = me.record;
		//win.setTitle( teach_weekday + teach_timespan )
		win.showAt(e.getXY())
		// ajax创建当前时间段学科教师的课程、人数???
        var store = Ext.getStore('Kcb');
		store.removeAll();
		//store.clearFilter();
		var obj = {
			"weekday": teach_weekday,
			"timespan": teach_timespan,
			"subjectID": me.record.data.subjectID, // 取得某个校区学科所有教师
			"schoolID": localStorage.schoolID
		}
		console.log(obj)
		var url = Youngshine.getApplication().dataUrl + 
			'readTeacherKcb.php?data='+ JSON.stringify(obj); ;
		store.getProxy().url = url;
        store.load({
            callback: function(records, operation, success) {
				console.log(records);
            },
            scope: this
        });
	}
});