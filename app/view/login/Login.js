Ext.define('Youngshine.view.login.Login', {
    //extend: 'Ext.form.Panel',
    //xtype: 'register-form',
    extend: 'Ext.window.Window',
	alias: 'widget.login',
	
	requires: [
       'Ext.window.*',
    ], 	
	
	autoShow: true,
	closable: false,
	modal: true,
	//resizable: false,
    frame: true,
    //bodyPadding: 10,
    //autoScroll:true,
    width: 350,
	
	title: '根号教育－咨询PC端',

    items: [{
        xtype: 'image',
		height: 80,
		width: '100%',
		bodyPadding: 10,
		src: 'resources/images/banner.jpg'
	},{
		xtype: 'form',
		bodyPadding: 10,
        //title: '操作员登录',
		//width: '100%',
        defaultType: 'textfield',
        defaults: {
            anchor: '100%',
        },
	    fieldDefaults: {
	        labelAlign: 'right',
	        labelWidth: 65,
	        msgTarget: 'side'
	    },
        items: [{ 
			allowBlank:false, 
			fieldLabel: '咨询帐号', 
			name: 'username', 
			emptyText: '',
			//value: 'admin' 
		},{ 
			allowBlank: false, 
			fieldLabel: '密码', 
			name: 'psw', 
			emptyText: '', 
			inputType: 'password',
			value: '123456' 
		},{
			xtype: 'textfield',
			name: 'school',
			//value: '管理员',
			editable: false,
			fieldLabel: '联盟学校',
			emptyText: '输入学校名称',	
		}]
    }],

    fbar: [{
    	xtype: 'label',
		text: '',
		style: 'color:red;',
		itemId: 'error'
    },'->',{
        text: '登录',
        //disabled: true,
        //formBind: true
		handler: function(btn){
			btn.up('window').onLogin();
		}
	},{
		text: '取消'	,
		disabled: true,
		handler: function(btn){
			btn.up('window').destroy();
			//document.location = 'http://www.fclfj.com';
		},
    }],
	
    onLogin: function(button, e, eOpts) {
        var me = this;
		var username = this.down('textfield[name=username]').getValue().trim(),
			psw = this.down('textfield[name=psw]').getValue().trim(),
			school = this.down('textfield[name=school]').getValue().trim();
			//school = this.down('combo[name=school]').getRawValue()
			//schoolID = this.down('combo[name=school]').getValue(); //id
		
		if (school == null || school == ''){
			me.down('label').setText('请输入学校名称！')
			return;
		}
        if(username == ''){
            //Ext.Msg.alert('提示','帐号不能空白！');
			me.down('label').setText('帐号不能空白！')
            return;
        }
        if(psw.length<6){
			me.down('label').setText('密码长度至少6位！')
            return;
        }
        var obj = {
            'username': username,
            'psw': psw,
			'school': school,
			//'schoolID': schoolID
			//'type': 'admin' //判断是 用户user 或 管理员admin 
        }

        this.fireEvent('loginOk', obj, me); //login控制器
    },
});