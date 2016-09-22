// 咨询师：待排课
Ext.define('Youngshine.controller.Kcb', {
    extend: 'Ext.app.Controller',

	//stores: ['Studying'],
	
    refs: [{
		ref: 'studentkcb',
		selector: 'student-kcb'
	},{
		ref: 'kcb',
		selector: 'kcb'	
	}],

    init: function() {
        this.control({
			'student-kcb': {
				kcb: this.studentKcb,
			},
			'kcb': {
				//kcb: this.kcbPk, //排课
			},					
        });
    },

	// 当前学生待排课的课程
    studentKcb: function(record) {
		var me = this;
		var win = Ext.widget('kcb', {record: record}); // 父表传递参数，当前学生记录
		//win.down('panel[itemId=info]').update(record.data);
		//win.setTitle( '报读知识点');

		// 获取当前委托单的检测项目
		var obj = {
			"studentID": record.data.studentID,
			//"checked": 0 //未付款审核
		};
		var store = Ext.getStore('Study'); 
		store.removeAll();
        var url = this.getApplication().dataUrl + 
			'readStudyListByKcb.php?data=' + JSON.stringify(obj);
		store.getProxy().url = url;
        store.load({
            callback: function(records, operation, success) {
		        if (success){
					//me.sumFee(); // 合计公用函数
					/*var sum = 0; //合计费用
					for (var i=0;i<store.data.length;i++){
						sum = sum + parseInt(records[i].get('fee'));
					}
					//console.log(win.down('label[itemId=subtotal]').text)
					win.down('label[itemId=subtotal]').setText('合计金额（元）：'+sum);  */
				};
            },
            scope: this
        }); 
    },	

});