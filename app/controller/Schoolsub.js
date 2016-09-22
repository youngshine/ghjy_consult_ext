// 分校区
Ext.define('Youngshine.controller.Schoolsub', {
    extend: 'Ext.app.Controller',

	//stores: ['Studying'],
	
    refs: [{
		ref: 'schoolsub',
		selector: 'schoolsub'
	}],

    init: function() {
        this.control({
			'schoolsub': {
				//kcb: this.kcbPk, //排课
			},					
        });
    },

	// 教师信息，包括添加删除排课以及历史报读课程，show跳转来自main controller
	showSchoolsub: function(){
		var me = this;
		var win = Ext.create('Youngshine.view.schoolsub.List') //Ext.widget('student-list');
		win.down('grid').getStore().removeAll(); // 先晴空
		
		var obj = {
			"schoolID": localStorage.getItem('schoolID')
		}
        var url = this.getApplication().dataUrl + 
			'readSchoolsubList.php?data=' + JSON.stringify(obj);
        var store = Ext.getStore('Schoolsub');
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