Ext.define('Youngshine.view.classes.New', {
    extend: 'Ext.window.Window',
    alias : 'widget.classes-new',
	id: 'winClassesNew',
	
	autoShow: true,
	modal: true,
	resizable: false,
	closable: false,
	width: 400,
	//height: 300,
	//layout: 'fit',
	title : '新增大小班级',

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
			store: 'Teacher',
			valueField: 'teacherID',
			displayField: 'teacherName',
			editable: false,
			fieldLabel: '教师主管'	
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
			teacherID_chief = this.down('combo[name=teacherID_chief]').getValue()
		
		if (title == ''){
			Ext.Msg.alert('提示','班级名称不能空白！');
			return;
		}
		if (kclistID == null){
			Ext.Msg.alert('提示','请选择对应课程！');
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

		Ext.Msg.confirm('询问','是否保存？',function(id){
			if( id == "yes"){
				var obj = {
					"title": title,
					"beginDate": beginDate,
					"kclistID": kclistID,
					"persons": persons,
					"note": note,	
					"teacherID": teacherID,	
					"teacherID_chief": teacherID_chief,						
					"consultID": localStorage.consultID, //当前登录的咨询师
					"schoolsubID": localStorage.schoolsubID, 
					//当前登录的咨询师所在分校区，归属
				};
				console.log(obj);
				//me.close();
				me.fireEvent('save',obj,me); 
			}
		})
	},
	
});