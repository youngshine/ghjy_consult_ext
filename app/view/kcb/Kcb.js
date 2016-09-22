// 报读课程排课表：先指定每周上课时间，再指定教师
Ext.define('Youngshine.view.kcb.Kcb' ,{
	extend: 'Ext.window.Window',
    alias : 'widget.kcb',
	
    requires:[
		//'Youngshine.view.study.Zsd',
    ],

	autoShow: true,
	closable: false,
	modal: true,
	//resizable: false,
	width: 550,
	height: 450,
	layout: 'fit',

    title : '课程',
	
	record: null, // 父表参数传递，该学生信息

	fbar: [
	'->',{	
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
	         width: 50,
	         //sortable: false,
			 menuDisabled: true,
	         dataIndex: 'subject'
	     }, {
	         text: '年段',
	         width: 50,
	         //sortable: false,
			 menuDisabled: true,
	         dataIndex: 'grade'	
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
					//var me = this;
					var rec = grid.getStore().getAt(rowIndex);
					grid.up('window').onKcb(rec); 
				}	
			}]				 		 
	     }],     
	}],
	
	onKcb: function(){ 
		//this.fireEvent('addnew');
		var me = this;
		
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
			var win = Ext.create('Youngshine.view.kcb.Kcb-detail',{
				record: me.record //父表参数传递：学生信息
			}); 
			win.showAt(500,50) //win.showAt(e.getXY()) 
	        //var store = Ext.getStore('Zsd');
			//store.clearFilter(true)
		}
	},

});