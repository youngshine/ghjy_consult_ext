// 缴费
Ext.define('Youngshine.controller.Accnt', {
    extend: 'Ext.app.Controller',

	//stores: ['Studying'],
	
    refs: [{
		ref: 'accntlist',
		selector: 'accnt-list'	
	},{
		ref: 'accntnew',
		selector: 'accnt-new'	
	},{
		ref: 'accntedit',
		selector: 'accnt-edit'
	}],

    init: function() {
        this.control({
			'accnt-list': {
				addnew: this.accntNew,
				//edit: this.accntEdit,
				//del: this.accntDelete,
			},	
			'accnt-new': {
				//save: this.accntnewSave,
				addrow: this.accntnewAddrow
			},			
        });
    },


	// 缴费，show跳转来自main controller
	showAccnt: function(){
		var me = this;
		var win = Ext.create('Youngshine.view.accnt.List');
		win.down('grid').getStore().removeAll(); // 先晴空
		
		var obj = {
			"consultID": localStorage.getItem('consultID'),
		} 
        var url = this.getApplication().dataUrl + 
			'readAccntList.php?data=' + JSON.stringify(obj);
        var store = Ext.getStore('Accnt');
		store.removeAll();
		store.clearFilter();
		store.getProxy().url = url;
        store.load({
            callback: function(records, operation, success) {
				console.log(records);
            },
            scope: this
        }); 
		
		// 该校的业绩咨询师
		var obj = {
			"schoolID": localStorage.getItem('schoolID'),
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
	
    accntNew: function(button) {
		var me = this;
		me.accntnew = Ext.create('Youngshine.view.accnt.New');
		
		// 业绩归属咨询师，默认为当前录入咨询师
		var combo = me.accntnew.down('combo[name=consultID_owe]')
		combo.setValue(localStorage.consultID)
		combo.setRawValue(localStorage.consultName)
    },
	
	// 添加报读课程明细（大小班、一对一、退费）
	accntnewAddrow: function(accntType,oldView){
		var me = this;
		switch(accntType){
		case '大小班':
			me.kclist = Ext.create('Youngshine.view.accnt.KclistClass')
			me.kclist.parentView = oldView; //方便父表单显示选中项
			me.kclist.show()
			
			var obj = {
				"schoolID": localStorage.getItem('schoolID'),
				"kcType": accntType
			} 
			var store = Ext.getStore('Kclist'); 
			store.removeAll();
	        var url = this.getApplication().dataUrl + 
				'readKclist.php?data=' + JSON.stringify(obj);
			store.getProxy().url = url;
	        store.load({
	            callback: function(records, operation, success) {

	            },
	            scope: this
	        });
			break;
		case '一对一':
			me.kclist = Ext.create('Youngshine.view.accnt.KclistOne2one')
			me.kclist.parentView = oldView; //方便父表单显示选中项
			me.kclist.show()
			
			var obj = {
				"schoolID": localStorage.getItem('schoolID'),
				"kcType": accntType
			} 
			var store = Ext.getStore('Kclist'); 
			store.removeAll();
	        var url = this.getApplication().dataUrl + 
				'readKclist.php?data=' + JSON.stringify(obj);
			store.getProxy().url = url;
	        store.load({
	            callback: function(records, operation, success) {

	            },
	            scope: this
	        });
			break;
		case '退费退班':
			me.kclist = Ext.create('Youngshine.view.accnt.KclistRefund')
			me.kclist.parentView = oldView; //方便父表单显示选中项
			me.kclist.show()
			
			var obj = {
				"schoolID": localStorage.getItem('schoolID'),
				"studentID": studentID
			} 
			var store = Ext.getStore('AccntDetail'); 
			store.removeAll();
	        var url = this.getApplication().dataUrl + 
				'readAccntDetailByRefund.php?data=' + JSON.stringify(obj);
			store.getProxy().url = url;
	        store.load({
	            callback: function(records, operation, success) {

	            },
	            scope: this
	        });
			break;
		}
	},	
	
});