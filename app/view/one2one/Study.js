// 课程内容：学生报读的知识点
Ext.define('Youngshine.view.one2one.Study' ,{
	extend: 'Ext.window.Window',
    alias : 'widget.one2one-study',

	autoShow: true,
	closable: true,
	modal: true,
	//resizable: false,
	width: 600,
	height: 350,
	layout: 'fit',

    title : '课程内容（知识点）',
	
	parentRecord: null, // 父表参数传递，该学生信息

	fbar: [{
		xtype: 'button',
		text: '＋报读知识点',
		tooltip: '添加',
		action: 'addnew',
		//disabled: true,
		//scale: 'medium',
		//width: 55,
		handler: function(btn,e){
			btn.up('window').onAddrow(e); //onAdd是系统保留reserved word
		}	
	},'->',{	
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
	         text: '上课时间',
	         width: 120,
	         //sortable: false,
			 menuDisabled: true,
	         dataIndex: 'timely_list'	 
	     }, {
	         text: '教师',
	         width: 80,
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
					grid.up('window').onKcb(rec); 
				}	
			}]		 		 
	     }],     
	}],
	
	onAddrow: function(e){ 
		//this.fireEvent('addnew');
		var me = this;
		
		this.down('grid').getSelectionModel().deselectAll();

		var win = Ext.create('Youngshine.view.one2one.Zsd',{
			parentRecord: me.parentRecord, //父表参数传递：学生信息
			parentView: me
		}); 
		win.showAt(e.getX()+200,e.getY()-200)
		//win.showAt(e.getX(),0) //win.showAt(e.getXY()) 
        //var store = Ext.getStore('Zsd');
		//store.clearFilter(true)
		// 清除原有数据
		Ext.getStore('Zsd').removeAll()
	
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
	
	onKcb: function(rec){
		var me = this
		me.fireEvent('kcb',rec, me);
	},
});