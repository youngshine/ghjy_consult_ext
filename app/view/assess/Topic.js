// 测评的题目，一个知识点一个，随机获取
Ext.define('Youngshine.view.assess.Topic' ,{
	extend: 'Ext.window.Window',
    alias : 'widget.assess-topic',

	autoShow: true,
	closable: true,
	modal: true,
	resizable: true,
	frame: true,
	width: 800,
	height: 600,
	autoScroll: true,
	//maximizable: true,
	layout: 'fit',

    title : '测评题目',
	//titleAlign: 'center',
	
	record: null, // 当前记录 变量，来自父类的 setRecord(rec)
	//cellIndex: null, // 判断是哪个图片字段

	fbar: [{
		text: '历年考点',
		handler: function(btn){
			btn.up('window').onChartRadar()
		}
	},{	
		text: '测评报告',
		//scale: 'medium',
		width: 55,
		handler: function(btn){
			btn.up('window').onReport()
		}
	},'->',{	
		xtype: 'button',
		text: '选择知识点',
		//tooltip: '添加测评',
		width: 55,
		handler: function(btn,e){
			btn.up('window').onZsd(e); //onAdd是系统保留reserved word
		}
	},{	
		text: '关闭',
		//scale: 'medium',
		width: 55,
		handler: function(btn){
			btn.up('window').close()
		}
	}],	
	
	items: [{ 
		xtype: 'grid',
		//height: 400, // grid can be scrollable
		stripeRows: true,
		store: 'Topic-assess',
		columns: [{
			xtype: 'rownumberer'
		},{	
			text: '题目',
			flex: 1,
			sortable: false,
			menuDisabled: true,
			dataIndex: 'content',
			/*renderer: function(value){
				return '<img src=' + value + ' width=auto height=20 />';
			}, */
			//tooltip: '单击图片放大'
		}, {
			text: '知识点',
			width: 120,
			menuDisabled: true,
			dataIndex: 'zsdName'
		}, {
			text: '评分',
			width: 40,
			menuDisabled: true,
			dataIndex: 'fullDone',
			align: 'center'	

 		},{	 
 			menuDisabled: true,
 			sortable: false,
 			xtype: 'actioncolumn',
 			width: 30,
 			items: [{
 				//iconCls: 'add',
 				icon: 'resources/images/my_input_icon.png',
 				tooltip: '答案',
 				handler: function(grid, rowIndex, colIndex) {
 					// msgbox 客观选择题目a,b,c,d答案 以及 评分对错
					grid.getSelectionModel().select(rowIndex); // 高亮
					var rec = grid.getStore().getAt(rowIndex);
					//rec.set('done',1) // record = model
					grid.up('window').onAnswer(rec); 
 				}	
 			}] 		 
		}], /*
		listeners: {
			cellclick: function( grid, td, cellIndex, record, tr, rowIndex, e, eOpts ){
				console.log(record)
				console.log(cellIndex)
				if(cellIndex == 1){
					grid.up('window').onPhoto(record.data.pic_teach,'题目图片',cellIndex)
				}
				
			}, 
		}, 	*/
	}],

	// 选择知识点
	onZsd: function(e){ 
		//this.fireEvent('examEdit',rec);
		var me = this; 
		//var win = Ext.widget('product-pic')	
		var win = Ext.create('Youngshine.view.assess.Zsd'); 
		win.record = me.record; 
		//win.showAt(e.getXY())
        
		var store = Ext.getStore('Zsd');
		store.removeAll();
		store.clearFilter();
		/*
		var obj = {
			"subject": me.record.data.subjectName
		}
		var url = Youngshine.getApplication().dataUrl + 'readZsdList.php?data='+ JSON.stringify(obj); ;
		*/
		// 历年考点 ghjy_hist
		var obj = {
			subjectID: me.record.data.subjectID,
			gradeID: me.record.data.gradeID,
			semester: me.record.data.semester,
			schoolID: localStorage.schoolID
		} 
		var url = Youngshine.getApplication().dataUrl + 'readHistList.php?data='+ JSON.stringify(obj); ;
		
		store.getProxy().url = url;
        store.load({
            callback: function(records, operation, success) {
				console.log(records);
            },
            scope: this
        }); // end store知识点
	},	
	
	// 答案及评分对1错0
	onAnswer: function(rec){
		var me = this; 
		console.log(rec);
		var done = null; 
		
		Ext.Msg.show({
		     title:'答题',
		     msg: '答案：'+rec.data.objective_answer + '<hr>是否做对？',
		     buttons: Ext.Msg.YESNOCANCEL,
		     icon: Ext.Msg.QUESTION,
			fn: showResult
		});
		
		function showResult(btn){
			if(btn == 'yes'){
				done = 1
				fullDone = '对' //前端显示
			}else if(btn == 'no'){
				done = 0
				fullDone = '错'
			}else{
				return false
			}
			// 前端更新显示
			rec.set('done',done);
			rec.set('fullDone',fullDone)
			me.fireEvent('done',done,fullDone,rec);
	    }

/*		Ext.Msg.confirm('题目答案及评分','答案：'+rec.data.objective_answer + 
		'<hr>是否做对？',function(btn){
			if(btn == 'yes'){
				done = 1
				fullDone = '对' //前端显示
			}else{
				done = 0
				fullDone = '错'
			}
			// 前端更新显示
			rec.set('done',done);
			rec.set('fullDone',fullDone)
			me.fireEvent('done',done,fullDone,rec);
		}); */
		
	},
	/* 单个pic
	onPhoto: function(pic,title){
		var me = this; 		
		var win = Ext.widget('photo')	
		win.setTitle(title)
		win.down('image').setSrc( pic )
		win.showAt(0,0,true)	
	}, */
	
	// 生成历年考点图表
	onChartRadar: function(){
		var me = this;
		var rec = me.record;
		console.log(rec)
		var win = Ext.create('Youngshine.view.assess.Chart');
		win.record = rec; 
		
		// 图表chart使用的数据
	    var store = Ext.create('Ext.data.Store', {
			fields: [
				{name: 'zsdName', type: 'string'},
				{name: 'Y1'},
				{name: 'Y2'},
				{name: 'Y3'},
				{name: 'Yavg'}
			], 
			//data : []
	    });

		/*
		Ext.Ajax.request({
		    url: Youngshine.getApplication().dataUrl + 
				'readExammbtmList.php',
		    params: {
		        mb_id: this.record.data.mb_id,
		    },
		    success: function(response){
		        console.log(response.responseText)
				var obj = JSON.parse(response.responseText)
		    }
		}); */
		var obj = {
			subjectID: rec.data.subjectID,
			gradeID: rec.data.gradeID,
			semester: rec.data.semester,
			schoolID: localStorage.schoolID
		} 
		console.log(obj);
		
		Ext.data.JsonP.request({
            url: Youngshine.getApplication().dataUrl + 
				'readHistList.php',
            callbackKey: 'callback',
            params:{
                data: JSON.stringify(obj)
            },
            success: function(result){
				console.log(result.data)
				/*if(result.success){
					for(var i=0;i<result.data.length;i++){
						store.add({
							zsd: item,
							times: 1
						})
					}				
					chartPie()
                } */
				store.add(result.data); //批量添加？？
				console.log(store.data);
				chartRadar()
            }
        });
				
		var chartRadar = function(){
			/* filled radar
		    var chart = Ext.create('Ext.chart.Chart', {
		            style: 'background:#fff',
		            theme: 'Category2',
		            insetPadding: 20,
		            animate: true,
		            store: store,
		            legend: {
		                position: 'right'
		            },
		            axes: [{
		                type: 'Radial',
		                position: 'radial',
		                label: {
		                    display: true
		                }
		            }],
		            series: [{
		                showInLegend: true,
		                type: 'radar',
		                xField: 'zsdName',
		                yField: 'Y2013',
		                style: {
		                    opacity: 0.4
		                }
		            },{
		                showInLegend: true,
		                type: 'radar',
		                xField: 'zsdName',
		                yField: 'Y2014',
		                style: {
		                    opacity: 0.4
		                }
		            },{
		                showInLegend: true,
		                type: 'radar',
		                xField: 'zsdName',
		                yField: 'Y2015',
		                style: {
		                    opacity: 0.4
		                }
		            }]
		        });
			*/
		    var chart = Ext.create('Ext.chart.Chart', {
		            style: 'background:#fff',
		            theme: 'Category2',
		            insetPadding: 20,
		            animate: true,
		            store: store,
		            legend: {
		                position: 'right'
		            },
		            axes: [{
		                type: 'Radial',
		                position: 'radial',
		                label: {
		                    display: true
		                }
		            }],
		            series: [{
		                showInLegend: true,
						showMarkers: true,
			            markerConfig: {
			                radius: 5,
			                size: 5
			            },
		                type: 'radar',
		                xField: 'zsdName',
		                yField: 'Y1',
		                style: {
							'stroke-width': 2,
							fill: 'none'
		                },
						tips: {
			                trackMouse: true,
			                width: 100,
			                height: 28,
			                renderer: function(storeItem, item) {
			                    this.setTitle(storeItem.get('Y1')+'分');
			                }
			            },
		            },{
		                showInLegend: true,
						showMarkers: true,
			            markerConfig: {
			                radius: 5,
			                size: 5
			            },
		                type: 'radar',
		                xField: 'zsdName',
		                yField: 'Y2',
		                style: {
							'stroke-width': 2,
							fill: 'none'
		                },
						tips: {
			                trackMouse: true,
			                width: 100,
			                height: 28,
			                renderer: function(storeItem, item) {
			                    this.setTitle(storeItem.get('Y2')+'分');
			                }
			            },
		            },{
		                showInLegend: true,
						showMarkers: true,
			            markerConfig: {
			                radius: 5,
			                size: 5
			            },
		                type: 'radar',
		                xField: 'zsdName',
		                yField: 'Y3',
		                style: {
							'stroke-width': 2,
							fill: 'none'
		                },
						tips: {
			                trackMouse: true,
			                width: 100,
			                height: 28,
			                renderer: function(storeItem, item) {
			                    this.setTitle(storeItem.get('Y3')+'分');
			                }
			            },
		            }]
		        });

			win.add([chart]); //items
		}
	},	
	
	// 生成测评报告:多个图表
	onReport: function(){
		var me = this;
		var rec = me.record;
		console.log(rec)
/*		
		var storeTopicAssess = me.down('grid').getStore(),
			wrongs = ''
		for(var i=0;i<storeTopicAssess.getCount();i++){
			if (storeTopicAssess.getAt(i).get('done')==0){
				//做错
				wrongs += storeTopicAssess.getAt(i).get('zsdName')+'｜'
			}
		}
		console.log(wrongs)	*/
		if (Ext.getStore('Topic-assess').getCount() == 0){
			Ext.Msg.alert('提示','没有测评题目，不能生成报告');
			return;
		}

		var win = Ext.create('Youngshine.view.assess.ChartAssess');
		win.record = rec; 
		
		//0 title
		var title = {
			xtype: 'component',
			maxHeight: 60,
			html: '<div style="text-align:center;font-size:1.5em;margin:10px;">测评报告书</div>' + 
				'<div style="text-align:center;">' + me.record.data.studentName + '｜' +
				me.record.data.subjectName + 
				me.record.data.gradeName + me.record.data.semester + '学期</div>'
		}
		win.add([title])
		
		// 历年考点图表chart使用的数据
	    var store = Ext.create('Ext.data.Store', {
			fields: [
				{name: 'zsdName', type: 'string'},
				{name: 'Y1'},
				{name: 'Y2'},
				{name: 'Y3'},
				{name: 'Yavg'}
			], 
			//data : []
	    });

		var obj = {
			subjectID: rec.data.subjectID,
			gradeID: rec.data.gradeID,
			semester: rec.data.semester,
			schoolID: localStorage.schoolID
		} 
		console.log(obj);
		
		Ext.data.JsonP.request({
            url: Youngshine.getApplication().dataUrl + 
				'readHistList.php',
            callbackKey: 'callback',
            params:{
                data: JSON.stringify(obj)
            },
            success: function(result){
				console.log(result.data)
				store.add(result.data); //批量添加？？
				console.log(store.data);
				
				// 1.历年考点
				chartRadar()	
				
				// 2.测评题目及其答案，评分	
				var grid = {
					xtype: 'grid',
					title: '测评内容',
					store: 'Topic-assess',
				    columns: [
				        { text: '知识点',  dataIndex: 'zsdName' },
				        { text: '题目', dataIndex: 'content', flex: 1 },
						{ text: '答案', dataIndex: 'answer'},
						{ text: '评分', dataIndex: 'fullDone'},
				    ],
					//height: 200
				}
				win.add([grid]); 		
				
				/* 历年考点表，仅仅保留当前测试的知识点记录
				store.filter([
					{filterFn: function(item) { 
						return wrongs.indexOf(item.get("zsdName"))>=0; 
					}}
				]); */
				// 3.测评内容的考点分
				var arrAssess = []
				me.down('grid').getStore().each(function(record){
					var zsdName = record.get('zsdName')
					for(var i=0;i<store.getCount();i++){
						if (store.getAt(i).get('zsdName')== zsdName){
							arrAssess.push(store.getAt(i))
						}
					}
				})
				console.log(arrAssess)
				chartBar(arrAssess)
				
				// 4. 预测图表，avg
				chartColumn()

            }
        });
				
		var chartBar = function(arrAssess){
		    var chart = Ext.create('Ext.chart.Chart', {
		            style: 'background:#fff',
		            animate: true,
		            shadow: true,
		            store: Ext.create('Ext.data.Store', {
						fields: [
								{name: 'zsdName', type: 'string'},
								{name: 'Y1'},
								{name: 'Y2'},
								{name: 'Y3'}
							], 
							data : arrAssess
					    }),
		            legend: {
		              position: 'right'  
		            },
		            axes: [{
		                type: 'Numeric',
		                position: 'bottom',
		                fields: ['Y1', 'Y2', 'Y3'],
		                minimum: 0,
		                label: {
		                    renderer: Ext.util.Format.numberRenderer('0,0')
		                },
		                grid: true,
		                title: '分数'
		            }, {
		                type: 'Category',
		                position: 'left',
		                fields: ['zsdName'],
		                title: '测评知识点'
		            }],
		            series: [{
		                type: 'bar',
		                axis: 'bottom',
		                xField: 'zsdName',
		                yField: ['Y1', 'Y2', 'Y3']
		            }]
		        });

			win.add([chart]); //items
		}
		// 历年考点雷达
		var chartRadar = function(){
		    var chart = Ext.create('Ext.chart.Chart', {
		            style: 'background:#fff',
		            theme: 'Category2',
		            insetPadding: 20,
		            animate: true,
		            store: store,
		            legend: {
		                position: 'right'
		            },
		            axes: [{
		                type: 'Radial',
		                position: 'radial',
		                label: {
		                    display: true
		                }
		            }],
		            series: [{
		                showInLegend: true,
						showMarkers: true,
			            markerConfig: {
			                radius: 5,
			                size: 5
			            },
		                type: 'radar',
		                xField: 'zsdName',
		                yField: 'Y1',
		                style: {
							'stroke-width': 2,
							fill: 'none'
		                },
						tips: {
			                trackMouse: true,
			                width: 100,
			                height: 28,
			                renderer: function(storeItem, item) {
			                    this.setTitle(storeItem.get('Y1')+'分');
			                }
			            },
		            },{
		                showInLegend: true,
						showMarkers: true,
			            markerConfig: {
			                radius: 5,
			                size: 5
			            },
		                type: 'radar',
		                xField: 'zsdName',
		                yField: 'Y2',
		                style: {
							'stroke-width': 2,
							fill: 'none'
		                },
						tips: {
			                trackMouse: true,
			                width: 100,
			                height: 28,
			                renderer: function(storeItem, item) {
			                    this.setTitle(storeItem.get('Y2')+'分');
			                }
			            },
		            },{
		                showInLegend: true,
						showMarkers: true,
			            markerConfig: {
			                radius: 5,
			                size: 5
			            },
		                type: 'radar',
		                xField: 'zsdName',
		                yField: 'Y3',
		                style: {
							'stroke-width': 2,
							fill: 'none'
		                },
						tips: {
			                trackMouse: true,
			                width: 100,
			                height: 28,
			                renderer: function(storeItem, item) {
			                    this.setTitle(storeItem.get('Y3')+'分');
			                }
			            },
		            }]
		        });

			win.add([chart]); //items
		}
		
		// 预测平均分
		var chartColumn = function(){
		    var chart = Ext.create('Ext.chart.Chart', {
		            style: 'background:#fff',
		            animate: true,
		            shadow: true,
		            store: store,
		            axes: [{
		                type: 'Numeric',
		                position: 'left',
		                fields: ['Yavg'],
		                label: {
		                    renderer: Ext.util.Format.numberRenderer('0,0')
		                },
		                title: '今年预测分数',
		                grid: true,
		                minimum: 0
		            }, {
		                type: 'Category',
		                position: 'bottom',
		                fields: ['zsdName'],
		                title: '知识点'
		            }],
		            series: [{
		                type: 'column',
		                axis: 'left',
		                highlight: true,
		                tips: {
		                  trackMouse: true,
		                  width: 140,
		                  height: 28,
		                  renderer: function(storeItem, item) {
		                    this.setTitle(storeItem.get('zsdName') + ': ' + storeItem.get('Yavg') + ' 分');
		                  }
		                },
		                label: {
		                  display: 'insideEnd',
		                  'text-anchor': 'middle',
		                    field: 'Yavg',
		                    renderer: Ext.util.Format.numberRenderer('0'),
		                    orientation: 'vertical',
		                    color: '#333'
		                },
		                xField: 'zsdName',
		                yField: 'Yavg'
		            }]
		        });

			win.add([chart]); //items
		}
	},	
});