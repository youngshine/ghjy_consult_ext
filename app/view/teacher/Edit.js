Ext.define('Youngshine.view.teacher.Edit', {
    extend: 'Ext.window.Window',
    alias : 'widget.teacher-edit',
    title : '修改教师资料',
    //layout: 'fit',
	
	width: 400,
	//height: 300,
	
    autoShow: true,
    modal: true,
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
			xtype: 'hiddenfield',
			name: 'teacherID',
			hidden: true //修改的唯一id,隐藏
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
		var teacherID = this.down('hiddenfield[name=teacherID]').getValue();

		if (teacherName == ''){
			Ext.Msg.alert('提示','姓名不能空白');
			return;
		}
		
		Ext.Msg.confirm('询问','确认修改保存？',function(id){
			if( id == "yes"){
				var obj = {
					"teacherName": teacherName,
					"subjectID": subjectID,
					"subjectName": subjectName,
					"teacherID": teacherID
				};
				console.log(obj);
				//me.close();
				me.fireEvent('save',obj,me); //后台数据判断，才能关闭  本窗口win
			}
		})
	}
});