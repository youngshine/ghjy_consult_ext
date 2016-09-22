// 学生测评知识点
Ext.define('Youngshine.view.assess.Assess' ,{
	extend: 'Ext.window.Window',
    alias : 'widget.assess',

	autoShow: true,
	closable: true,
	modal: true,
	//resizable: false,
	width: 550,
	height: 450,
	layout: 'fit',

    title : '测评知识点',
	
	record: null, // 父表参数传递，该学生信息

	fbar: ['->',{	
		xtype: 'button',
		text: '＋新增',
		tooltip: '添加测评知识点',
		action: 'addnew',
		//disabled: true,
		//scale: 'medium',
		width: 55,
		handler: function(btn,e){
			btn.up('window').onNew(btn,e); //onAdd是系统保留reserved word
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
			if(Ext.getCmp('multiSelectZsd')) // 非modal
				Ext.getCmp('multiSelectZsd').destroy();
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
		store: 'Assess',
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
	         width: 60,
	         //sortable: false,
			 menuDisabled: true,
	         dataIndex: 'subjectName'
	     }, {
	         text: '年段',
	         width: 60,
	         //sortable: false,
			 menuDisabled: true,
	         dataIndex: 'grade'	 
	     }, {
	         text: '测评日期',
	         width: 90,
			 menuDisabled: true,
	         dataIndex: 'created'
 	
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
				icon: 'resources/images/my_check_icon.png',
				tooltip: '测评3题目',
				handler: function(grid, rowIndex, colIndex) {
					grid.getSelectionModel().select(rowIndex); // 高粱
					var rec = grid.getStore().getAt(rowIndex);
					grid.up('window').onTopic(rec); 
				}	
			}]			 		 
	     }],     
	}],
	
	onNew: function(btn,e){ 
		var me = this;
		this.down('grid').getSelectionModel().deselectAll();
		
		if(Ext.getCmp('multiSelectZsd')){
			Ext.getCmp('multiSelectZsd').setActive(true)
			Ext.getCmp('multiSelectZsd').show()
			return
		}else{
			// 后面加载数据
			var win = Ext.create('Youngshine.view.assess.Zsd',{
				record: me.record //父表参数传递：学生信息
			}); 
			win.showAt(e.getX()-100,100) //win.showAt(e.getXY()) 
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
	
	onTopic: function(rec){
		console.log(rec)
		var me = this;
		var win = Ext.create("Youngshine.view.assess.Topic",{record: rec})
		// 根据学生学科报名时初始水平levelList获得
		var subjectID = rec.data.subjectID; //数理化123对应数组012
		subjectID = parseInt(subjectID)-1;
		var level = me.record.data.level_list.split(',');
		level = level[subjectID];
		level = parseInt(level)+1; // 推难度高一级的题目，最高
		level = level>3 ? 3 : level
		// 相应学科知识点的相应难度 测评题目3个
		//readTopicList(rec.data.zsdID,level)
		var obj = {
			"zsdID": rec.data.zsdID,
			"level": level
		}
        var url = Youngshine.app.dataUrl + 
			'readTopicAssessList.php?data=' + JSON.stringify(obj);
        var store = Ext.getStore('Topic-assess');
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