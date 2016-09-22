// 公用类find，查找 知识点／／历年考点：出现在？？？
Ext.define('Youngshine.view.assess.Zsd' ,{ 
	extend: 'Ext.window.Window',
    alias : 'widget.zsd',
	//id: 'multiSelectZsd',

    autoShow: true,
	closable: true,
	modal: true,
	resizable: true,
	frame: true,
	collapsible: true,
	//headerPosition: 'left',
	width: 400,
	height: 350,
	//autoScroll: true,
	layout: 'fit',
	/*
    style: {
        background: '#FDF5E6'  
    }, 
	defaultFocus: 'subject',
	*/
    title : '历年考点',
	//titleAlign: 'center',
	
	record: null, // 父表的记录

	fbar: [{
		xtype: 'textfield',
		width: 100,
		itemId: 'zsd',
		//fieldLabel: '筛选',
		//labelWidth: 30,
		labelAlign: 'right',
		emptyText: '搜索...',
		//padding: '5 5',
		enableKeyEvents: true,
		listeners: {
			keypress: function(field,e){
				console.log(e.getKey())
				if(e.getKey()=='13'){ //按Enter
					field.up('window').onFilter(field.value); 
				}	
			}
		} 
	},'->',{
		text: '确定',
		tooltip: '生成题目',
		//disabled: true,
		handler: function(btn){
			btn.up('window').onOk();
		}
	},{
		text: '取消',
		handler: function(btn){
			btn.up('window').close();//hide();
		}	
	}],
	
	items: [{
		xtype: 'grid',
		//stripeRows: true,
		store: 'Zsd',
		//headerBorders: false,
		//bodyStyle: 'background:#ffe;',
/*	    viewConfig: {
	        enableTextSelection: true
	    }, */
		plugins: [
			Ext.create('Ext.grid.plugin.CellEditing', {
				clicksToEdit: 1
			})
		],
		
		columns: [{	
			//text: '打勾',
			xtype: 'checkcolumn',
            //header: '选择',
            dataIndex: 'select',
            width: 40,
			menuDisabled: true,
			sortable: false,
            stopSelection: true
		},{	
			text: '知识点',
			flex: 1,
			sortable: true,
			menuDisabled: true,
			dataIndex: 'zsdName'
		}, {
			text: '年级',
			width: 70,
			//sortable: false,
			menuDisabled: true,
			dataIndex: 'gradeName'	
		}, {
			text: '学期',
			width: 40,
			//sortable: false,
			menuDisabled: true,
			dataIndex: 'semester'				 
		}],   
	}],

	onOk: function(){
		var me = this;

		var selects = ''
		var obj = this.down('grid').getStore().data;
		for(var i = 0; i < obj.length;i++){
			if(obj.getAt(i).data.select) // 打勾选择
				selects += obj.getAt(i).data.zsdID + ',' 
		}	
		selects = selects.substring(0,selects.length-1); // 移除最后一个英文逗号,
		console.log(selects);console.log(me.record.data)
		if (selects == '' || selects.split(',').length > 9){
			Ext.Msg.alert('提示','知识点选择错误');
			return;
		}
		
		// 难度列表数理化1,2,1，转换成当前学科的
		var subjectID = me.record.data.subjectID;
		var level = me.record.data.level_list.split(',')
		level = level[subjectID-1]
		
		Ext.Msg.confirm('询问','确认测评选中的知识点？<br>当前测评记录将会被清除',function(id){
			if( id == "yes"){
				/*
				Ext.Ajax.request({ //Ext.data.JsonP.request({	
				    url: Youngshine.app.getApplication().dataUrl + 
						'createTopicAssess.php',
				    params: {
						zsdID_list: selects, //选择知识点列表,zsdID非唯一unique
						subjectID: subjectID,
						level: level
						//consultID: sessionStorage.consultID
				    },
					//crossDomain:true,
				    success: function(response){
				        //console.log(response.responseText)
						var obj = JSON.parse(response.responseText)
						console.log(obj)
						// 把当前试卷记录行移除到 已经分析的表哥
						Ext.getStore('Topic-assess').load()
						//Ext.Msg.alert('','当前行试卷分析完成！');
						me.destroy();					
						// 发送模版消息
						//me.WxTemplate(me.record)
				    }
				}); */
				Ext.MessageBox.show({
				   msg: '正在生成测评题目...',
				   width: 300,
				   wait: true,
				   waitConfig: {interval:200},
				});
				var obj = {
						zsdID_list: selects, //选择知识点列表,zsdID非唯一unique
						subjectID: subjectID,
						level: level,
						assessID: me.record.data.assessID
						//consultID: sessionStorage.consultID
				    }
				console.log(obj)	
		    	Ext.data.JsonP.request({			
				    url: Youngshine.app.getApplication().dataUrl + 
						'createTopicAssess.php',
					callbackKey: 'callback',
					//timeout: 9000,
					params:{
						data: JSON.stringify(obj)
						/* data: '{"level":"' + level + 
							'","zsdID":"' + zsdID + 
							'","studentstudyID":"' + studentstudyID + '"}' */
					},
					success: function(result){ // 服务器连接成功 
						Ext.MessageBox.hide(); 
						console.log(result)
						if (result.success){ // 返回值有success成功
							//console.log(result.data)
							// 直接添加到后台数据表ghjy_topic-teach，最新在最上面
							Ext.getStore('Topic-assess').load()
							me.close()
							//store.add(result.data).. store.insert()
							//console.log(store.data)		
						}else{
							Ext.Msg.alert(result.message);
						}
					},
				});
			}
		})
	},
		
	onFilter: function(val){
		var me = this;  console.log(val)
		var value = new RegExp("/*" + val); // 正则表达式
		console.log(value)
		var store = this.down('grid').getStore();
		store.clearFilter(true)
		store.filter([
			{property: "zsdName", value: value}
		]);
	},
});