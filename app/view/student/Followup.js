// 咨询师与学生沟通记录
Ext.define('Youngshine.view.student.Followup' ,{
	extend: 'Ext.window.Window',
    alias : 'widget.student-followup',
	//id: 'winPrepaidHist',

	autoShow: true,
	closable: true,
	modal: true,
	collapsible: true,
	//resizable: false,
	width: 600,
	height: 450,
	layout: 'fit',
	
    style: {
       // background: '#FDF5E6'  
    }, 

    title : '联系沟通记录',
	//titleAlign: 'center',
	
	record: null, // 父表参数传递，该学生信息

	fbar: [{
		xtype: 'combo',
		width: 100,
		itemId: 'step',
		store: {
			fields: ['value'],
			data : [
				{"value":"全部"},
				{"value":"近一周"},
				{"value":"近一月"},
			]
		},
		valueField: 'value',
		displayField: 'value',
		value: '全部',
		editable: false,
		//padding: '5 0',
		listeners: {
			change: function(cb,newValue){
				var payment = newValue
				this.up('window').onFilter(payment); 
			}
		}
	
	},'->',{	
		xtype: 'button',
		text: '＋新增',
		tooltip: '添加沟通记录',
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
		}
	}],
	
	items: [{
		xtype: 'grid',
		plugins: [
			Ext.create('Ext.grid.plugin.CellEditing', {
				clicksToEdit: 1
			})
		],
		stripeRows: true,
		allowDeselect: true,
		selType: 'cellmodel',
		store: 'Followup',
	    columns: [{
			xtype: 'rownumberer',
		}, {
			text: '时间',
			width: 70,
			menuDisabled: true,
			dataIndex: 'created',
			renderer : function(val) {
				return '<span style="color:' + '#73b51e' + ';">' + val.substr(2,8) + '</span>';
			}, 
		}, {		
			text: '内容',
			flex: 1,
			menuDisabled: true,
			dataIndex: 'content',
			editor: {
				xtype: 'textareafield',
				grow: true,
				readOnly: true
				//row: 5
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
		}],     
	}],


	onNew: function(){ 
		var me = this;
		this.down('grid').getSelectionModel().deselectAll();
		//this.fireEvent('addnew');
		//用prompt?
		Ext.MessageBox.show({
			title: '输入沟通内容',
			//msg: '输入沟通内容',
			width: 450,
			buttons: Ext.MessageBox.OKCANCEL,
			multiline: true,
			fn: showResultText,
			//animateTarget: 'mb3'
		});
		
		function showResultText(btn, text){
	        console.log(text)
			if(text.trim() != ''){
				//插入记录
				var obj = {
					content: text,
					studentID: me.record.data.studentID
					//created: '刚刚刚刚'
				}
				console.log(obj)
				/*
				Ext.Ajax.request({
				    url: 'script/createFollowup.php',
				    params: {
				        obj //id: 1
				    },
				    success: function(response){
				        var text = response.responseText; //JSON.parse
				        // process server response here
				    }
				}); */
				Ext.MessageBox.show({
				   msg: '正在保存',
				   width: 300,
				   wait: true,
				   waitConfig: {interval:200},
				});
				Ext.data.JsonP.request({
		            url: Youngshine.app.getApplication().dataUrl + 'createFollowup.php',
		            callbackKey: 'callback',
		            params:{
		                data: JSON.stringify(obj)
		            },
		            success: function(result){
						Ext.MessageBox.hide(); console.log(result)
						if(result.success){
							obj.studentfollowID = result.data.studentfollowID; 
							obj.created = '刚刚刚刚'
							me.down('grid').getStore().insert(0,obj)
						}else{		
							Ext.Msg.alert('提示',result.message);
						}	
					},
					failure: function(result){
						Ext.MessageBox.hide();
						Ext.Msg.alert('网络错误','服务请求失败');
					}
		        });
			}
	    }
	},
	onDelete: function(rec){
		var me = this;
		console.log(rec);
		Ext.Msg.confirm('提示','是否删除当前行？',function(btn){
			if(btn == 'yes'){
				me.fireEvent('del',rec);
			}
		});
	},
	onFilter: function(val){
		var me = this;
		//var payment = new RegExp("/*" + payment); // 正则表达式
		var store = this.down('grid').getStore();
		store.clearFilter(); // filter is additive
		if(val != '全部' ){
			store.filter([
				{property: "created", value: val},
			]);			
		}

	},
/*	
	initComponent: function(){
		this.callParent()
		this.on('deactivate',function(e){
			this.close()
		})
	} */
});