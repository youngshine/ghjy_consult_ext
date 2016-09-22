// 管理登录
Ext.define('Youngshine.view.login.Pswreset', {
	extend: 'Ext.window.Window',
	alias: 'widget.pswreset',
	
	autoShow: true,
	modal: true,
	resizable: false,
	closable: false,
	width: 350,
	//height: 300,
	
	title: '操作员修改密码',
	
	items: [{
		xtype: 'form',
		bodyPadding: 10,
		//bodyPadding: 10,
		fieldDefaults: {
			labelWidth: 65,
			anchor: '100%',
			labelAlign: 'right',
		},
		items: [{
			xtype: 'displayfield',
			//value: localStorage.getItem('admin_name'),
			name: 'username',
			fieldLabel: '咨询帐号',
		},{	
			xtype: 'displayfield',
			//value: localStorage.getItem('admin_name'),
			name: 'schoolsub',
			fieldLabel: '分校区',
		},{	
			xtype: 'textfield',
			name : 'psw1',
			inputType: 'password',
			fieldLabel: '新密码',
			emptyText: '长度至少6位',
		},{
			xtype: 'textfield',
			name : 'psw2',
			inputType: 'password',
			fieldLabel: '验证密码',
			emptyText: '再输入一次密码', /*
		},{
			xtype: 'displayfield',
			name: 'error',
			fieldLabel: '出错',
			labelStyle: 'color:red',
			//margin: '10 0 0 85',
			fieldStyle: {
				color: 'red'
			},
			hidden: true */	
		}],
	}],	
	
	fbar: [{
    	xtype: 'label',
		text: '',
		style: 'color:red;',
		itemId: 'error'
    },'->',{	
		text: '保存',
		//width: 45,
		handler: function(btn){
			btn.up('window').onOk();
		}
	},{
		text: '取消',
		//width: 45,
		handler: function(btn){
			btn.up('window').close();
		}
	}],

	onOk: function(){
		var me = this;
		var lblError = this.down('label[itemId=error]');
		var psw1 = this.down('textfield[name=psw1]').getValue().trim(),
			psw2 = this.down('textfield[name=psw2]').getValue().trim();
		if(psw1.length<6 || psw2.length<6){
			lblError.setText('密码长度至少6位！');
			return;
		}
		if(psw1 != psw2){
            //Ext.Msg.alert('提示','确认密码错误！')
            lblError.setText('确认密码错误！');
            return;
        }
		
		var obj = {
			'psw': psw1,
			'id': localStorage.getItem('consultID'), // user_id or admin_id
			'type': 'consult' // user or admin
		};
		me.fireEvent('save',obj,me); //login controller

	},

});