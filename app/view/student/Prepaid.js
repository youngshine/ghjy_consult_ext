// 学生付款记录
Ext.define('Youngshine.view.student.Prepaid' ,{
	extend: 'Ext.window.Window',
    alias : 'widget.student-prepaid',
	id: 'winPrepaidHist',

	autoShow: true,
	closable: true,
	modal: true,
	collapsible: true,
	//resizable: false,
	width: 600,
	height: 450,
	layout: 'fit',
	
    style: {
        background: '#FDF5E6'  
    }, 

    title : '购买课程历史记录',
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
				{"value":"现金"},
				{"value":"刷卡"},
				{"value":"扫码"},
				{"value":"微信"},
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
	},{
		xtype: 'splitter'
	},{
		xtype: 'label',
		html: '合计：',
	},{	
		xtype: 'displayfield',
		itemId: 'subtotal',
		//padding: '0 0 0 5'	
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
		stripeRows: true,
		allowDeselect: true,
		selType: 'cellmodel',
		store: 'Prepaid',
	    columns: [{
			xtype: 'rownumberer',
	     }, {
	         text: '套餐',
	         flex: 1,
			 menuDisabled: true,
	         dataIndex: 'taocan'	,
	     }, {
	         text: '课时',
	         width: 30,
			 menuDisabled: true,
	         dataIndex: 'times',
			 align: 'center'
	     }, {
	         text: '价格',
	         width: 50,
			 menuDisabled: true,
	         dataIndex: 'amt',
			 align: 'right' 
	     }, {
	         text: '代金券',
	         width: 50,
			 menuDisabled: true,
	         dataIndex: 'coupon',
			 align: 'right' 
	     }, {
	         text: '金额',
	         width: 50,
			 menuDisabled: true,
	         dataIndex: 'amount',
			 align: 'right' 
	     }, {
	         text: '支付',
	         width: 40,
			 menuDisabled: true,
	         dataIndex: 'payment'
 		},{	
 			 text: 'OrderID',
 	         width: 110,
 	         sortable: true,
 			 menuDisabled: true,
 	         dataIndex: 'OrderID' 	
 		},{	 
 	         text: '时间',
 	         width: 70,
 			 menuDisabled: true,
 	         dataIndex: 'created',
 			 renderer : function(val) {
 	                return '<span style="color:' + '#73b51e' + ';">' + val.substr(2,8) + '</span>';
 	                //return val;
 	            }, 
				/*
	     }, {
			menuDisabled: true,
			sortable: false,
			xtype: 'actioncolumn',
			width: 30,
			items: [{
				//iconCls: 'add',
				icon: 'resources/images/my_right_icon.png',
				tooltip: '课程',
				handler: function(grid, rowIndex, colIndex) {
					grid.getSelectionModel().select(rowIndex); // 高亮
					var rec = grid.getStore().getAt(rowIndex);
					grid.up('window').onZsd(rec); 
				}	
			}]  	*/ 		 
	     }],     
	}],
/*	
	// 缴费对应知识点
	onZsd: function(rec){
		var obj = {
			"study_list": rec.get('study_list')
		}
		console.log(obj)
        Ext.data.JsonP.request({
            url: Youngshine.app.getApplication().dataUrl + 'readZsdName.php', 
            callbackKey: 'callback',
            params:{
                data: JSON.stringify(obj)
            },
            success: function(result){
                if(result.success){
					console.log(result.data)
					var arr = result.data,
						zsdName = ''
					for(var i=0;i<arr.length;i++)
						zsdName += (i+1) + '、' + arr[i].zsdName + '<br>';
					Ext.MessageBox.alert('知识点',zsdName)
                }
            },
        });
	},
*/	
	onFilter: function(payment){
		var me = this;
		//var payment = new RegExp("/*" + payment); // 正则表达式
		var store = this.down('grid').getStore();
		store.clearFilter(); // filter is additive
		if(payment != '全部' ){
			store.filter([
				{property: "payment", value: payment},
			]);			
		}

	},
	
	initComponent: function(){
		this.callParent()
		this.on('deactivate',function(e){
			this.close()
		})
	}
});