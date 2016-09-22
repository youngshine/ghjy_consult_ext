Ext.define('Youngshine.view.teacher.New', {
    extend: 'Ext.window.Window',
    alias : 'widget.teacher-new',

    title : '新增教师',
    //layout: 'fit',
	
	width: 400,
	//height: 300,
	modal: true,
    autoShow: true,
	resizable: false,
	closable: false,
	
	items: [{
		xtype: 'form',
		bodyPadding: 10,
		fieldDefaults: {
			labelWidth: 80,
			labelAlign: 'right',
			anchor: '100%'
		},
		items: [{
			xtype: 'textfield',
			name : 'teacherName',
			fieldLabel: '姓名'
		},{
			xtype: 'combo',
			name: 'subject',
			store: {
				fields: ['value', 'name'],
				data : [
					{"value":"数学", "name":"数学"},
					{"value":"物理", "name":"物理"},
					{"value":"化学", "name":"化学"},
				]
			},
			valueField: 'value',
			displayField: 'name',
			editable: false,
			fieldLabel: '学科'
		},{
			xtype: 'textfield',
			name: 'note',
			fieldLabel: '备注',
			hidden: true
		}],
	},{
	    buttons : [{
			text: '保存',
			width: 45,
			action: 'save',
			//scope: this,
			handler: function(btn){
				btn.up('window').onSave();
			}
		},{
			text: '取消',
			width: 45,
			//scope: this,
			handler: function(btn){
				btn.up('window').destroy();
				//this.close();
			}
		}],	
    }],
   
	onSave: function(){
		var me = this;
		var teacherName = this.down('textfield[name=teacherName]').getValue().trim();
		var subject = this.down('combo[name=subject]').getValue();
		//var note = this.down('textfield[name=note]').getValue().trim();
		
		if (teacherName == ''){
			Ext.Msg.alert('提示','姓名不能空白');
			return;
		}
		if (subject == null){
			Ext.Msg.alert('提示','请选择学科');
			return;
		}		

		Ext.Msg.confirm('询问','是否保存？',function(id){
			if( id == "yes"){
				//if(viewEF.isValid()){
					var obj = {
						"teacherName": teacherName,
						"subjectID": subjectID,
						"subjectName": subjectName,

					};
					console.log(obj);
					//me.close();
					me.fireEvent('save',obj,me); //后台数据判断，才能关闭  本窗口win
				//}
			}
		})
	}
});