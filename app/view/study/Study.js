// 课程内容：学生报读的知识点
Ext.define('Youngshine.view.study.Study' ,{
	extend: 'Ext.window.Window',
    alias : 'widget.study',
	
    requires:[
		'Youngshine.view.study.Zsd',
    ],

	autoShow: true,
	closable: true,
	modal: true,
	//resizable: false,
	width: 600,
	height: 350,
	layout: 'fit',

    title : '课程内容（知识点）',
	
	record: null, // 父表参数传递，该学生信息

	fbar: [{
		xtype: 'label',
		html: '合计:',
	},{
		xtype: 'displayfield',
		itemId: 'subtotal',
		value: 0,
		//padding: '0 0 0 5'	
	},'->',{	
		xtype: 'button',
		text: '＋新增',
		tooltip: '添加课程内容',
		action: 'addnew',
		//disabled: true,
		//scale: 'medium',
		width: 55,
		handler: function(btn,e){
			btn.up('window').onNew(e); //onAdd是系统保留reserved word
		}
	},{	
		xtype: 'button',
		text: '关闭',
		//scale: 'medium',
		width: 55,
		style: {
			//background: 'transparent',
			border: 1 //'1px solid #fff'
		},
		handler: function(btn){
			btn.up('window').close()
			// 非modal of zsd
			if(Ext.getCmp('multiSelectZsd')){
				Ext.getCmp('multiSelectZsd').down('grid').getStore().removeAll()
				Ext.getCmp('multiSelectZsd').destroy();
			} 				
		}
	}],
	
	items: [{
		xtype: 'grid',
		plugins: [
			Ext.create('Ext.grid.plugin.CellEditing', {
				clicksToEdit: 1
			})
		],
		listeners: {
			edit:function(editor, e) {
				//this.up('window').onSaveItem(e.record);
				//console.log(editor)
				//console.log(e.record)
			}
		},
		stripeRows: true,
		store: 'Study',
	    columns: [{
			xtype: 'rownumberer',
		},{	
			 text: '知识点',
	         flex: 1,
	         sortable: true,
			 menuDisabled: true,
	         dataIndex: 'zsdName'
	     }, {
	         text: '学科',
	         width: 40,
	         //sortable: false,
			 menuDisabled: true,
	         dataIndex: 'subjectName'
	     }, {
	         text: '年级',
	         width: 50,
	         //sortable: false,
			 menuDisabled: true,
	         dataIndex: 'gradeName'	  
	     }, {
	         text: '课时',
	         width: 30,
			 menuDisabled: true,
	         dataIndex: 'times',
			 align: 'center' 
	     }, {
	         text: '上课日',
	         width: 50,
	         //sortable: false,
			 menuDisabled: true,
	         dataIndex: 'teach_weekday'	 
	     }, {
	         text: '时间段',
	         width: 50,
			 menuDisabled: true,
	         dataIndex: 'teach_timespan'
	     }, {
	         text: '教师',
	         width: 60,
			 menuDisabled: true,
	         dataIndex: 'teacherName'	

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
					grid.getSelectionModel().select(rowIndex); // 高粱
					var rec = grid.getStore().getAt(rowIndex);
					grid.up('window').onDelete(rec); 
				}	
			}]	
		},{	 
			menuDisabled: true,
			sortable: false,
			xtype: 'actioncolumn',
			width: 30,
			items: [{
				//iconCls: 'add',
				icon: 'resources/images/my_input_icon.png',
				tooltip: '排课',
				handler: function(grid, rowIndex, colIndex) {
					grid.getSelectionModel().select(rowIndex); // 高粱
					var rec = grid.getStore().getAt(rowIndex);
					grid.up('window').onStudyKcb(rec); 
				}	
			}]		 		 
	     }],     
	}],
	
	onNew: function(e){ 
		//this.fireEvent('addnew');
		var me = this;
		
		this.down('grid').getSelectionModel().deselectAll();
		
		if(Ext.getCmp('multiSelectZsd')){
			Ext.getCmp('multiSelectZsd').setActive(true)
			Ext.getCmp('multiSelectZsd').show()
			return
		}else{
			/*
	        var store = Ext.getStore('Zsd');
			store.removeAll();
			store.clearFilter();
			var obj = {
				"subject": me.record.data.km // 考试内容知识点，会跨年级grade
			}
			var url = Youngshine.getApplication().dataUrl + 
				'readZsdList.php?data='+ JSON.stringify(obj); ;
			store.getProxy().url = url;
	        store.load({
	            callback: function(records, operation, success) {
					//console.log(records);
	            },
	            scope: this
	        }); // end store知识点
			*/
			var win = Ext.create('Youngshine.view.study.Zsd',{
				record: me.record //父表参数传递：学生信息，包括购买id
			}); 
			win.showAt(e.getX()-200,100)
			//win.showAt(e.getX(),0) //win.showAt(e.getXY()) 
	        //var store = Ext.getStore('Zsd');
			//store.clearFilter(true)
			// 清除原有数据
			Ext.getStore('Zsd').removeAll()
		}
	},

	onDelete: function(rec){
		var me = this;
		console.log(rec);
		Ext.Msg.confirm('提示','是否删除当前行？',function(btn){
			if(btn == 'yes'){
				me.fireEvent('del',rec, me);
			}
		});
	},
	
	onStudyKcb: function(rec){
		console.log(rec)
		var win = Ext.create("Youngshine.view.study.Study-kcb",{record: rec})
		win.down('form').loadRecord(rec) // form绑定记录
		/*
		// 读取当前知识点的学科的校区教师，
		var obj = {
			"zsdID": rec.data.zsdID,
			"schoolID": localStorage.schoolID
		}
        var url = Youngshine.app.getApplication().dataUrl + 
			'readTeacherList.php?data=' + JSON.stringify(obj);
        var store = Ext.getStore('Teacher');
		store.removeAll();
		store.clearFilter();
		store.getProxy().url = url;
        store.load({
            callback: function(records, operation, success) {
				console.log(records);
            },
            scope: this
        });  */
	},
	
	/* 合并预缴费
	onPrepay: function(){
		this.down('grid').getSelectionModel().deselectAll();
		// prepaid,checked 缴费审核 ＝1, paid是家长确认付款
		var subtotal = this.down('displayfield[itemId=subtotal]').getValue()
		var win = Ext.create("Youngshine.view.study.Prepay")
		win.down('displayfield[itemId=subtotal]').setValue(subtotal)
		win.down('displayfield[itemId=actualtotal]').setValue(subtotal)
		// 当前学生
		win.down('hiddenfield[name=studentID]').setValue(this.record.get('studentID'))
	} */
});