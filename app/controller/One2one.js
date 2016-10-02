// 一对一
Ext.define('Youngshine.controller.One2one', {
    extend: 'Ext.app.Controller',
	
    refs: [{
		ref: 'one2onepk',
		selector: 'one2one-pk'
	},{
		ref: 'one2onestudy',
		selector: 'one2one-study'	
	},{
		ref: 'one2onekcb',
		selector: 'one2one-kcb'	
	}],

    init: function() {
        this.control({
			'one2one-pk': {
                study: this.one2onepkStudy,
            },
			'one2one-study': {
                //add: this.one2onestudyAdd,
				del: this.one2onestudyDelete,
				kcb: this.one2onestudyKcb
            },
			'zsd': {
				choose: this.zsdChoose
			},
			'one2one-kcb': {
                save: this.one2onekcbSave
            },					
        });
    },
	
	// 待排课的一对一报读课程，show跳转来自main controller
	showPk: function(){
		var me = this;
		me.classes = Ext.create('Youngshine.view.one2one.Pk')

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
	
	// 安排学校内容
    one2onepkStudy: function(record) {
		var me = this;
		me.one2onestudy = Ext.create('Youngshine.view.one2one.Study')
		me.one2onestudy.parentRecord = record // 传递参数

		var obj = {
			"accntdetailID": record.data.accntdetailID,
		}
	    var url = this.getApplication().dataUrl + 
			'readStudyListByAccntdetail.php?data=' + JSON.stringify(obj);
	    var store = Ext.getStore('Study');
		store.removeAll();
		store.clearFilter();
		store.getProxy().url = url;
	    store.load({
	        callback: function(records, operation, success) {
				console.log(records);
	        },
	        scope: this
	    });
		
		// 学科
	    var url = this.getApplication().dataUrl + 'readSubjectList.php'
	    var store = Ext.getStore('Subject');
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
	
	// 删除报读的知识点，并且判断是否没有报读知识点，才能删除课程
	one2onestudyDelete: function(rec){
		console.log(rec)
		var me = this
		Ext.Ajax.request({
		    url: me.getApplication().dataUrl + 'deleteStudy.php',
		    params: {
				studentstudyID: rec.data.studentstudyID,
				accntdetailID : rec.data.accntdetailID 
				//多一个参数，父表报读课程记录，用于可能的改变状态isClassed=0
		    },
		    success: function(response){
				var ret = JSON.parse(response.responseText)
				//Ext.toast(ret.message,3000)
				if(ret.success){
					Ext.getStore('Study').remove(rec);
				}		         
		    }
		});
	},
	
	zsdChoose: function( obj,oldView )	{
    	var me = this; 

		Ext.data.JsonP.request({ 
            url: me.getApplication().dataUrl +  'createStudy.php',
            callbackKey: 'callback',
            params:{
                data: JSON.stringify(obj)
            },
            success: function(result){
				//更新前端store，最新插入记录ID，才能删除修改
				obj.studentstudyID = result.data.studentstudyID; 
				// model数组添加项目
				Ext.getStore('Study').insert(0,obj); //新增记录，排在最前面	
            }
		});
	},

	one2onestudyKcb: function(record,oldView){
		var me = this;
		me.one2onekcb = Ext.create('Youngshine.view.one2one.Kcb');
		me.one2onekcb.down('form').loadRecord(record); //binding data
		me.one2onekcb.parentRecord = record // 传递参数
		me.one2onekcb.parentView = oldView 
		//me.studykcb.down('list').getStore().removeAll(); //清除上课周期列表
		// 上课周期列表数组，list.store
		if(record.data.timely_list != ''){
			var timely_list = record.data.timely_list.split(',')
			console.log(timely_list)
			var timely = [];
			for (var i = 0; i < timely_list.length; i++) {
				//timely.push( {"timely":timely_list[i]}  )
				var w = timely_list[i].substr(0,2),
					h = timely_list[i].substr(2,2),
					m = timely_list[i].substr(5,2)
				timely.push( {"w":w,"h":h,"m":m}  )
			}
			console.log(timely);
			me.one2onekcb.down('grid').getStore().loadData(timely)
		}
		
		// 任课教师
		var obj = {
			"schoolID": localStorage.schoolID
		}		
		var store = Ext.getStore('Teacher'); 
		store.removeAll()
		store.clearFilter() 
		store.getProxy().url = me.getApplication().dataUrl + 
			'readTeacherList.php?data=' + JSON.stringify(obj);
		store.load({
			callback: function(records, operation, success){
			    if (success){
				};
			} 
		})
	},
	
	one2onekcbSave: function( obj,oldView )	{
    	var me = this; 
		console.log(obj)
		Ext.Ajax.request({
		    url: me.getApplication().dataUrl + 'updateStudyByKcb.php',
		    params: obj,
		    success: function(response){
		        //var text = response.responseText; Ext.JSON.decode JSON.parse()
				console.log(response)
				oldView.destroy()
		    }
		});
	},
});