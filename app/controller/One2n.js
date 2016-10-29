// 一对一
Ext.define('Youngshine.controller.One2n', {
    extend: 'Ext.app.Controller',
	
    refs: [{
		ref: 'one2npk',
		selector: 'one2n-pk'
	},{
		ref: 'one2nteacher',
		selector: 'one2n-teacher'	
	},{
		ref: 'one2onekcb',
		selector: 'one2one-kcb'	
	}],

    init: function() {
        this.control({
			'one2n-pk': {
                teacher: this.one2npkTeacher, //分配给教师，并调整上课时间
            },
			'one2n-teacher': {
				choose: this.one2nteacherChoose
			},				
        });
    },
	
	// 待排课的一对一报读课程，show跳转来自main controller
	showPk: function(){
		var me = this;
		me.one2npk = Ext.create('Youngshine.view.one2n.Pk')

		var obj = {
			//"schoolID": localStorage.schoolID,
			"consultID": localStorage.getItem('consultID'),
			"accntType": "一对一"
		}		
        var url = this.getApplication().dataUrl + 
			'readAccntDetailByOne2one.php?data=' + JSON.stringify(obj);
        var store = Ext.getStore('AccntDetail');
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
	
	// 排课给已设定上课时间的一对N教师，可以减少上课时间，不能增加
    one2npkTeacher: function(record) {
		var me = this;
		me.one2nteacher = Ext.create('Youngshine.view.one2n.Teacher')
		me.one2nteacher.parentRecord = record // 传递参数

		var obj = {
			"schoolID": localStorage.schoolID
		}
	    var url = this.getApplication().dataUrl + 
			'readTeacherListByOne2n.php?data=' + JSON.stringify(obj);
	    var store = Ext.getStore('Teacher');
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
	
	// 一对N排课：学生分配给教师
	one2nteacherChoose: function( obj,parentRecord,oldView )	{
		var me = this;
		Ext.data.JsonP.request({ 
            url: me.getApplication().dataUrl +  'createOne2nStudent.php',
            callbackKey: 'callback',
            params:{
                data: JSON.stringify(obj)
            },
            success: function(result){
				Ext.Msg.alert('提示','一对N排课成功！');
				oldView.destroy()
				
				// 原来待分班当前行消失
				me.one2npk.down('grid').getStore().remove(parentRecord)		
            }
		});
	},
});