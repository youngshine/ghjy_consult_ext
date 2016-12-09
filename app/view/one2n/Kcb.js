Ext.define('Youngshine.view.one2n.Kcb', {
    extend: 'Ext.window.Window',
    alias : 'widget.one2n-kcb',
	
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
			btn.up('window').onCancel();
			//btn.up('window').destroy();
			//this.close();
		}
	}],	
	
	items: [{
		xtype: 'grid',
		selType: 'cellmodel',
		height: 250,
		tripeRows: true,
		store: Ext.create('Ext.data.Store', {
			fields: [
	            {name: "check", type: "boolean"}, //用于打勾选择
				{name: "w", type: "string"},
				{name: "h", type: "string"},
				{name: "m", type: "string"},
	        ],
		}),
		 
	    columns: [{
			//text: '打勾',
			xtype: 'checkcolumn',
            header: '打勾选择',
            dataIndex: 'check',
            width: 60,
			menuDisabled: true,
			sortable: false,
            stopSelection: true

		},{	
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
				icon: 'resources/images/my_user_icon.png',
				tooltip: '学生',
				handler: function(grid, rowIndex, colIndex) {
					//stopPropagation();
					grid.getSelectionModel().select(rowIndex); // 高亮当前选择行？？？不是自动？
					var rec = grid.getStore().getAt(rowIndex);
					grid.up('window').onStudent(rec); 
				}	
			}]
 		},{	
 			menuDisabled: true, hidden: true,
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

	// 取消的话，则不能选择grid行，不能提交
	onCancel: function(){
		var me = this;
		me.parentView.down('grid').getSelectionModel().deselectAll();
		me.parentView.down('button[action=choose]').setDisabled(true)
		me.destroy();
	},	
	onSave: function(){
		var me = this;
		
		/* 打勾选择上课时间，不是删除	
		var checks = ''
		var obj = this.down('grid').getStore().data;
		for(var i = 0; i < obj.length;i++){
			if(obj.getAt(i).data.check) // 打勾出错题目id
				checks += obj.getAt(i).data.tm_id + ',' 
		}	
		checks = checks.substring(0,checks.length-1); // 移除最后一个英文逗号,
		console.log(checks)
		if (checks == ''){
			Ext.Msg.alert('提示','请选择上课时间！');
			return;
		}
		*/
					
		var arrList = [] //,jsonList = {};
		var store = me.down('grid').getStore()
		store.each(function(rec,index){
			if(rec.data.check){ //打勾选择
				var timely_list = rec.data.w + rec.data.h + ':' + rec.data.m
				arrList.push(timely_list)
			}
			//arrList.push(rec.data)
			//jsonList[index] = rec.data.kclistID 
		})
		
		if (arrList.length===0){
			Ext.Msg.alert('提示','请选择上课时间！');
			return;
		}

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
	
	// 该教师的一对N学生
	onStudent: function(record){
		var me = this;
		var obj = {
			"teacherID": me.parentRecord.data.teacherID,
			"timely":    record.data.w + record.data.h + ':' + record.data.m
		}
		console.log(obj);
        Ext.data.JsonP.request({
            url: Youngshine.app.getApplication().dataUrl + 'readOne2nStudentByEach.php', 
            callbackKey: 'callback',
            params:{
                data: JSON.stringify(obj)
            },
            success: function(result){
                if(result.success){
					console.log(result.data)
					var arr = result.data,
						title = ''
					for(var i=0;i<arr.length;i++)
						title += (i+1) + '、' + arr[i].studentName + '<br>';
					Ext.MessageBox.alert('一对N学生列表',title)
                }
            },
        });
	}
});