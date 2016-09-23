// 主控制器，包括login
Ext.define('Youngshine.controller.Main', {
    extend: 'Ext.app.Controller',
	
	//stores: ['Admin'],
    views: [
        //'Main2', //equal to required
        'Viewport',
		//'admin.New',
		//'admin.Edit',
		//'Login',
    ],
	
	refs: [{
		ref: 'login',
		selector: 'login'	
	},{
		ref: 'pswreset',
		selector: 'pswreset'	
	},{
		ref: 'myviewport',
		selector: 'app-viewport'	
	},{	
		ref: 'main',
		selector: 'app-main'	
	}],

    init: function() {
        this.control({
			'login': {
                loginOk: this.loginOk,
            },
			'pswreset': {
				//afterrender: this.afterrenderUserList,
                save: this.pswresetSave,
            },
			'mywest': {
				student: this.navStudent,
				schoolsub: this.navSchoolsub,
				consult: this.navConsult,
				teacher: this.navTeacher,
				kclist: this.navKclist,
				classes: this.navClasses,
				classesPk: this.navClassesPk,
				one2onePk: this.navOne2onePk,
				accnt: this.navAccnt,
				accntconsult: this.navAccntConsult,
				
				pswreset: this.navPswreset, 
				logout: this.navLogout,
            },
        });
    },

	// 用户而不是管理员admin登录成功，来自登录或注册成功直接跳转
    loginOk: function(obj,oldWin) {
        var me = this; //console.log(obj)
        Ext.data.JsonP.request({
            url: me.getApplication().dataUrl + 'login.php', 
            callbackKey: 'callback',
            params:{
                data: JSON.stringify(obj)
            },
            success: function(result){
                if(result.success){
					console.log(result.data.schoolName,result.data.schoolsub)
					//localStorage.setItem('isLogin',true);
					localStorage.setItem('consultID',result.data.consultID); 
					localStorage.setItem('consultName',result.data.consultName);
					
					localStorage.setItem('school',result.data.schoolName); //加盟许诶熬
					localStorage.setItem('schoolID',result.data.schoolID);
					//咨询师目前所在分校区
					localStorage.setItem('schoolsubID',result.data.schoolsubID);
					localStorage.setItem('schoolsub',result.data.schoolsub);
	
					// 跳转页面 main
					me.main = Ext.create('Youngshine.view.Main');
					me.main.down('container[itemId=infoBar]').html = result.data.schoolName
					me.getMyviewport().add(me.main) // build
					oldWin.close(); //成功后关闭当前窗口
                }else{
				    //Ext.Msg.alert('提示',result.message); me.getLogin()
					oldWin.down('label[itemId=error]').setText(result.message)
                }
            },
            failure: function(result){
                //Ext.Msg.alert('提示','服务请求失败！');
				oldWin.down('label').setText('服务请求失败！')
            }
        });
    },
	
	//
	navStudent: function(){
		this.getApplication().getController('Student').showStudent();
	},

	navSchoolsub: function(){
		this.getApplication().getController('Schoolsub').showSchoolsub(1);
	},	

	navAccnt: function(){
		this.getApplication().getController('Accnt').showAccnt();
	},
	
	navConsult: function(){
		//this.getApplication().getController('Study').showStudy();
		this.getApplication().getController('Consult').showConsult(0);
	},	
	navTeacher: function(){
		this.getApplication().getController('Teacher').showTeacher();
	},

	navKclist: function(){
		this.getApplication().getController('Kclist').showKclist();
	},
	navClasses: function(){
		this.getApplication().getController('Classes').showClasses();
	},
	
	navClassesPk: function(){
		this.getApplication().getController('Classes').showPk();
	},
	navOne2onePk: function(){
		this.getApplication().getController('One2one').showPk();
	},
	
	navAccnt: function(){
		this.getApplication().getController('Accnt').showAccnt();
	},
	navAccntConsult: function(){
		this.getApplication().getController('Accnt').showAccntConsult();
	},
	
	navPswreset: function(){	
		var win = Ext.create('Youngshine.view.login.Pswreset') 
		//Ext.widget('pswreset')
		win.down('displayfield[name=username]').setValue(localStorage.consultName)
		win.down('displayfield[name=schoolsub]').setValue(localStorage.schoolsub)
	},	
	// 密码重置reset	
	pswresetSave: function(obj,win){
		var me = this;
		//console.log(obj)
		Ext.data.JsonP.request({
			url: me.getApplication().dataUrl + 'updatePsw.php',
			callbackKey: 'callback',
			params:{
				data: JSON.stringify(obj)
			},
			success: function(result){
				if(result.success){
					Ext.Msg.alert('','密码修改成功！');
					win.close();
				}else{				
					Ext.Msg.alert('提示',result.message);
				}
			},
			failure: function(result){
				Ext.Msg.alert('提示','连接服务器失败');
			}
		});
	},
		
	navLogout: function(){
		//window.location.reload();
		//document.location = 'http://www.youngshine.com'; /
		//localStorage.setItem('schoolID','');
		//localStorage.setItem('schoolName','');
		
		window.location = 'index.html';
	}
});
