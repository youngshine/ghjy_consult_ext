Ext.define('Youngshine.view.one2n.One2nKcb', {
    extend: 'Ext.window.Window',
    alias : 'widget.one2n-kcb-x',
	
    autoShow: true,
    modal: true,
	resizable: false,
	closable: false,
    //layout: 'fit',
	width: 350,
	//height: 300,
	title : '调整一对N上课时间',
	
	parentRecord: null, //parent view
	parentView: null,

    fbar : [{
		text: '保存',
		handler: function(btn){
			btn.up('window').onSave();
		}
	},{
		text: '取消',
		//scope: this,
		handler: function(btn){
			btn.up('window').destroy();
			//this.close();
		}
	}],	
	
	items: [{
		xtype: 'grid',
		height: 250,
		tripeRows: true,
		store: Ext.create('Ext.data.Store', {
			fields: [
	            //{name: "timely_list", type: "string"},
				{name: "w", type: "string"},
				{name: "h", type: "string"},
				{name: "m", type: "string"},
	        ],
		}),
		 
	    columns: [{
			text: '上课星期',
			flex: 1,
			sortable: false,
			menuDisabled: true,
			dataIndex: 'w',
 		},{	 
			text: '时',
			width: 80,
			sortable: false,
			menuDisabled: true,
			dataIndex: 'h',
 		},{	
			text: '分',
			width: 80,
			sortable: false,
			menuDisabled: true,
			dataIndex: 'm',
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

		//arrList = JSON.stringify(arrList); //传递到后台，必须字符串
		arrList = arrList.join(',')
		
		var obj = {
			timely_list_one2n: arrList,
		};
		console.log(obj);

		/* 更新前端store
		var model = me.down('form').getRecord();
		model.set(obj) */
		me.parentRecord.set(obj)
		me.destroy()
	},
	
	// 删除行
	onDelete: function(record){
		var me = this; console.log(record)
		me.down('grid').getStore().remove(record); //store选择的排除，从 检测项目.. 
	},
});