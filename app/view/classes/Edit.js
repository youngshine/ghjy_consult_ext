Ext.define('Youngshine.view.classes.Edit', {
    extend: 'Ext.window.Window',
    alias : 'widget.classes-edit',
	id: 'winClassesEdit',
	
    autoShow: true,
    modal: true,
	resizable: false,
	closable: false,
    //layout: 'fit',
	width: 400,
	//height: 300,
	title : '修改班级',

    fbar : [{
    	text: '＋添加上课时间',
		handler: function(btn){
			btn.up('window').onAddrow();
		}
    },'->',{
		text: '保存',
		handler: function(btn){
			btn.up('window').onSave();
		}
	},{
		text: '取消',
		//scope: this,
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
			name : 'title',
			fieldLabel: '班级名称'
		},{
			xtype: 'combo',
			name: 'kclistID',
			store: 'Kclist',
			valueField: 'kclistID',
			displayField: 'title',
			editable: false,
			fieldLabel: '所属课程'	
		},{
			xtype: 'datefield',
            fieldLabel: '开课日期',
			format: 'Y-m-d',
            name: 'beginDate',
			value: new Date(),
            allowBlank: false,		
		},{
			xtype: 'numberfield',
			name: 'persons',
			fieldLabel: '定员',
			value: 0
		},{
			xtype: 'textfield',
			name: 'note',
			fieldLabel: '备注',		
		},{
			xtype: 'combo',
			name: 'teacherID',
			store: 'Teacher',
			valueField: 'teacherID',
			displayField: 'teacherName',
			editable: false,
			fieldLabel: '任课教师'	
		},{
			xtype: 'combo',
			name: 'teacherID_chief',
			queryMode: 'local',
			store: 'Teacher',
			valueField: 'teacherID',
			displayField: 'teacherName',
			editable: false,
			fieldLabel: '教师主管'
		},{			
			xtype: 'hiddenfield',//修改的唯一id,隐藏
			name: 'classID',
		}],
		
	},{ //上课时间列表
		plugins: [
			Ext.create('Ext.grid.plugin.CellEditing', {
				clicksToEdit: 1
			})
		], 
		xtype: 'grid',
		height: 100,
		tripeRows: true,
		store: Ext.create('Ext.data.Store', {
			fields: [
	            //{name: "timely_list", type: "string"},
				{name: "w", type: "string"},
				{name: "h", type: "string"},
				{name: "m", type: "string"},
	        ],
		}),
		 
	    columns: [{
			text: '上课星期',
			flex: 1,
			sortable: false,
			menuDisabled: true,
			dataIndex: 'w',
            editor: {
                xtype:'combo', // 可以录入 检测方法 的 条件
				store: {
					fields: ['value'],
					data : [
						{"value":"周一"},
						{"value":"周二"},
						{"value":"周三"},
						{"value":"周四"},
						{"value":"周五"},
						{"value":"周六"},
						{"value":"周日"},
					]
				},
				valueField: 'value',
				displayField: 'value',
				editable: false,
            }
 		},{	 
			text: '时',
			width: 80,
			sortable: false,
			menuDisabled: true,
			dataIndex: 'h',
            editor: {
                xtype:'combo', // 可以录入 检测方法 的 条件
				store: {
					fields: ['value'],
					data : [
						{"value":"08"},
						{"value":"09"},
						{"value":"10"},
						{"value":"11"},
						{"value":"13"},
						{"value":"14"},
						{"value":"15"},
						{"value":"16"},
						{"value":"17"},
						{"value":"19"},
						{"value":"20"},
					]
				},
				valueField: 'value',
				displayField: 'value',
				editable: false,
            }
 		},{	
			text: '分',
			width: 80,
			sortable: false,
			menuDisabled: true,
			dataIndex: 'm',
            editor: {
                xtype:'combo', // 可以录入 检测方法 的 条件
				store: {
					fields: ['value'],
					data : [
						{"value":"00"},
						{"value":"05"},
						{"value":"10"},
						{"value":"15"},
						{"value":"20"},
						{"value":"25"},
						{"value":"30"},
						{"value":"35"},
						{"value":"40"},
						{"value":"45"},
						{"value":"50"},
						{"value":"55"},
					]
				},
				valueField: 'value',
				displayField: 'value',
				editable: false,
            }
 		},{	
 			menuDisabled: true,
 			sortable: false,
 			xtype: 'actioncolumn',
 			width: 30,
 			items: [{
 				//iconCls: 'add',
 				icon: 'resources/images/my_delete_icon.png',
 				tooltip: '删除',
 				handler: function(grid, rowIndex, colIndex) {
 					grid.getSelectionModel().select(rowIndex); // 高亮
 					var rec = grid.getStore().getAt(rowIndex);
 					grid.up('window').onDelete(rec); 
 				}	
 			}]
		}],	
    }],
	
	onSave: function(){
		var me = this;
	
		var title = this.down('textfield[name=title]').getValue().trim(),
			//datetime.toLocaleDateString() // 0点0分，不准确，要转换toLocal
			beginDate = this.down('datefield[name=beginDate]').getValue(), 
			kclistID = this.down('combo[name=kclistID]').getValue(),
			persons = this.down('numberfield[name=persons]').getValue(),
			note = this.down('textfield[name=note]').getValue().trim(),
			teacherID = this.down('combo[name=teacherID]').getValue(),
			teacherID_chief = this.down('combo[name=teacherID_chief]').getValue(),
			teacherName = this.down('combo[name=teacherID]').getRawValue(), //前端显示
			teacherName_chief = this.down('combo[name=teacherID_chief]').getRawValue(),
			classID = this.down('hiddenfield[name=classID]').getValue() //unique
		
		if (title == ''){
			Ext.Msg.alert('提示','班级名称不能空白！');
			return;
		}	
		if (persons == 0){
			Ext.Msg.alert('提示','请输入定员人数！');
			return;
		} /* 可能尚且无法指定教师，先为0
		if (teacherID == null){
			Ext.Msg.alert('提示','请选择任课教师！');
			return;
		} */
		if(teacherID==null) teacherID=0
		if(teacherID_chief==null) teacherID_chief=0
			
		var arrList = [] //,jsonList = {};
		var store = me.down('grid').getStore()
		store.each(function(rec,index){
			var timely_list = rec.data.w + rec.data.h + ':' + rec.data.m
			arrList.push(timely_list)
			//arrList.push(rec.data)
			//jsonList[index] = rec.data.kclistID 
		})
		if (arrList.length == 0){	
			Ext.Msg.alert('提示','请添加上课时间！');
			return;
		}
		//arrList = JSON.stringify(arrList); //传递到后台，必须字符串
		arrList = arrList.join(',')
		
		var obj = {
			"title": title,
			"beginDate": beginDate,
			"kclistID": kclistID,
			"persons": persons,
			"note": note,	
			"timely_list": arrList,
			"teacherID": teacherID,	
			"teacherID_chief": teacherID_chief,	
			"teacherName": teacherName, //前端显示	
			"teacherName_chief": teacherName_chief,						
			"consultID": localStorage.consultID, //当前登录的咨询师
			"schoolsubID": localStorage.schoolsubID, 
			"classID": classID, // unique
		};
		console.log(obj);
		
		Ext.Msg.confirm('询问','确认修改保存？',function(id){
			if( id == "yes"){
				//me.close();
				me.fireEvent('save',obj,me); //后台数据判断，才能关闭  本窗口win
				
				/* 更新前端store
				var model = me.down('form').getRecord();
				model.set(obj) */
			}
		})
	},
	
	// 添加上课时间记录
	onAddrow: function(){
		var me = this;	
		me.down('grid').getSelectionModel().deselectAll();
		//me.down('grid').getStore().add({w:'周日',h:'08','m':'00'});
		me.down('grid').getStore().insert(0,{w:'周日',h:'08','m':'00'});
		me.down('grid').getSelectionModel().select(0);
		//me.down('grid').getStore().add({w:'周日'},{h:'08'});
		//me.fireEvent('addrow',me); 
	},
	// 删除行
	onDelete: function(record){
		var me = this; console.log(record)
		me.down('grid').getStore().remove(record); //store选择的排除，从 检测项目.. 
	},
});