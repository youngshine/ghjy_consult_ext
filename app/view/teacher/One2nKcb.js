// 一对N 上课时间，预先设定
Ext.define('Youngshine.view.teacher.One2nKcb', {
    extend: 'Ext.window.Window',
    alias : 'widget.teacher-one2n-kcb',
	
    autoShow: true,
    modal: true,
	resizable: false,
	closable: true,
    //layout: 'fit',
	width: 400,
	//height: 300,
	title : '一对N课程表',
	
	parentRecord: null, //parent view
	parentView: null,

    fbar : [{
    	text: '＋添加上课时间',
		handler: function(btn){
			btn.up('window').onAddnew();
		}
    },{
		text: '保存',hidden: true,
		handler: function(btn){
			btn.up('window').onSave();
		}
	},{
		text: '关闭',
		//scope: this,
		handler: function(btn){
			btn.up('window').destroy();
			//this.close();
		}
	}],	
	
	items: [{
		//上课时间列表
		/*
		selType: 'cellmodel',
		plugins: [
			Ext.create('Ext.grid.plugin.CellEditing', {
				clicksToEdit: 1
			})
		], */
		xtype: 'grid',
		height: 300,
		tripeRows: true,
		store: Ext.create('Ext.data.Store', {
			fields: [
	            {name: "timely", type: "string"},
				//{name: "w", type: "string"},
				//{name: "h", type: "string"},
				//{name: "m", type: "string"},
	        ],
		}),
		columns: [{ 
			text: '上课时间',  
			dataIndex: 'timely',
			flex: 1, 
 		},{	
 			menuDisabled: true,
 			sortable: false,
 			xtype: 'actioncolumn',
 			width: 30,
 			items: [{
 				//iconCls: 'add',
 				icon: 'resources/images/my_delete_icon.png',
 				tooltip: '删除',
 				handler: function(grid, rowIndex, colIndex) {
 					grid.getSelectionModel().select(rowIndex); // 高亮
 					var rec = grid.getStore().getAt(rowIndex);
 					grid.up('window').onDelete(rec); 
 				}	
 			}]
		}],
		 /*
	    columns: [{
			text: '上课星期',
			flex: 1,
			sortable: false,
			menuDisabled: true,
			dataIndex: 'w',
            editor: {
                xtype:'combo', // 可以录入 检测方法 的 条件
				store: {
					fields: ['value'],
					data : [
						{"value":"周一"},
						{"value":"周二"},
						{"value":"周三"},
						{"value":"周四"},
						{"value":"周五"},
						{"value":"周六"},
						{"value":"周日"},
					]
				},
				valueField: 'value',
				displayField: 'value',
				editable: false,
            }
 		},{	 
			text: '时',
			width: 80,
			sortable: false,
			menuDisabled: true,
			dataIndex: 'h',
            editor: {
                xtype:'combo', // 可以录入 检测方法 的 条件
				store: {
					fields: ['value'],
					data : [
						{"value":"08"},
						{"value":"09"},
						{"value":"10"},
						{"value":"11"},
						{"value":"12"},
						{"value":"13"},
						{"value":"14"},
						{"value":"15"},
						{"value":"16"},
						{"value":"17"},
						{"value":"18"},
						{"value":"19"},
						{"value":"20"},
					]
				},
				valueField: 'value',
				displayField: 'value',
				editable: false,
            }
 		},{	
			text: '分',
			width: 80,
			sortable: false,
			menuDisabled: true,
			dataIndex: 'm',
            editor: {
                xtype:'combo', // 可以录入 检测方法 的 条件
				store: {
					fields: ['value'],
					data : [
						{"value":"00"},
						{"value":"05"},
						{"value":"10"},
						{"value":"15"},
						{"value":"20"},
						{"value":"25"},
						{"value":"30"},
						{"value":"35"},
						{"value":"40"},
						{"value":"45"},
						{"value":"50"},
						{"value":"55"},
					]
				},
				valueField: 'value',
				displayField: 'value',
				editable: false,
            }
 		},{	
 			menuDisabled: true,
 			sortable: false,
 			xtype: 'actioncolumn',
 			width: 30,
 			items: [{
 				//iconCls: 'add',
 				icon: 'resources/images/my_delete_icon.png',
 				tooltip: '删除',
 				handler: function(grid, rowIndex, colIndex) {
 					grid.getSelectionModel().select(rowIndex); // 高亮
 					var rec = grid.getStore().getAt(rowIndex);
 					grid.up('window').onDelete(rec); 
 				}	
 			}]
		}],	 */
		
    }],
	
	onSave: function(){
		var me = this;
			
		var arrList = [] //,jsonList = {};
		var store = me.down('grid').getStore()
		store.each(function(rec,index){
			var timely_list = rec.data.w + rec.data.h + ':' + rec.data.m
			arrList.push(timely_list)
			//arrList.push(rec.data)
			//jsonList[index] = rec.data.kclistID 
		})
		if (arrList.length == 0){	
			Ext.Msg.alert('提示','请添加上课时间！');
			return;
		}
		//arrList = JSON.stringify(arrList); //传递到后台，必须字符串
		arrList = arrList.join(',')
		
		var obj = {
			teacherID: me.parentRecord.data.teacherID, // unique
			timely_list_one2n: arrList,
		};
		console.log(obj);
		
		Ext.Msg.confirm('询问','确认保存？',function(id){
			if( id == "yes"){
				//me.close();
				//me.fireEvent('save',obj,me); //后台数据判断，才能关闭  本窗口win				
				Ext.data.JsonP.request({
		            url: Youngshine.app.getApplication().dataUrl + 'updateTeacherByOne2nKcb.php',
		            callbackKey: 'callback',
		            params:{
		                data: JSON.stringify(obj)
		            },
		            success: function(result){
						if(result.success){
							/* 更新前端store
							var model = me.down('form').getRecord();
							model.set(obj) */
							me.parentRecord.set(obj)
							me.destroy()
						}	
					},
		        });
			}
		})
	},
	
	/*添加上课时间记录 xx 作废
	onAddrow: function(){
		var me = this;	
		me.down('grid').getSelectionModel().deselectAll();
		//me.down('grid').getStore().add({w:'周日',h:'08','m':'00'});
		me.down('grid').getStore().insert(0,{w:'周日',h:'08','m':'00'});
		me.down('grid').getSelectionModel().select(0);
		//me.down('grid').getStore().add({w:'周日'},{h:'08'});
		//me.fireEvent('addrow',me); 
	}, */

	// 添加上课时间记录
	onAddnew: function(){
		var me = this;	
		var win = Ext.create('Youngshine.view.teacher.one2nkcb.Addnew')
		win.parentRecord = me.parentRecord // 传递当前教师参数teacherID
		win.parentView = me 
	},
		
	// 删除行，已经一对N排课学生的one2n_student，不能删除
	onDelete: function(record){
		var me = this; console.log(record)
		//me.down('grid').getStore().remove(record); //store选择的排除，从 检测项目.. 
		
		Ext.Msg.confirm('询问','是否删除当前行时间段？',function(btn){
			if(btn == 'yes'){
				var obj = {
					"timely"           : record.data.timely,
					"teacherID"        : me.parentRecord.data.teacherID,
					"timely_list_one2n": me.parentRecord.data.timely_list_one2n,
				}
				console.log(obj)
				
				Ext.data.JsonP.request({
		            url: Youngshine.getApplication().dataUrl + 'deleteTeacherOne2nTimely.php',
		            callbackKey: 'callback',
		            params:{
		                data: JSON.stringify(obj)
		            },
					//params: obj,
		            success: function(result){
						console.log(result)
						//var ret = Ext.JSON.decode(response.responseText)
						if(result.success){
							me.down('grid').getStore().remove(record)
							/* 更新前端store
							var model = me.down('form').getRecord();
							model.set(obj) */
							me.parentRecord.set({
								"timely_list_one2n": result.data.timely_list_one2n
							})
							//me.destroy()
						}else{
							Ext.Msg.alert('提示',result.message)
						}	
					},
		        });
			}
		});
	},
});