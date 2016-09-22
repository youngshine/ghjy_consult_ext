Ext.define('Youngshine.controller.Consult', {
    extend: 'Ext.app.Controller',

    views: [
        //'admin.List', //equal to required
    ],
	
	//stores: ['Student'],

    refs: [{
		ref: 'consultlist',
		selector: 'consult-list'
	}],

    init: function() {
        this.control({
            'consult-list': {
				//addnew: this.teacherNew,
				
            },				
        });
    },

	// 教师信息，包括添加删除排课以及历史报读课程，show跳转来自main controller
	showConsult: function(){
		var me = this;
		var win = Ext.create('Youngshine.view.consult.List') //Ext.widget('student-list');
		win.down('grid').getStore().removeAll(); // 先晴空
		
		var obj = {
			"schoolID": localStorage.getItem('schoolID')
		}
        var url = this.getApplication().dataUrl + 
			'readConsultList.php?data=' + JSON.stringify(obj);
        var store = Ext.getStore('Consult');
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
});