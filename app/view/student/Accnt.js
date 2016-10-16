// 学生付款记录
Ext.define('Youngshine.view.student.Accnt' ,{
	extend: 'Ext.window.Window',
    alias : 'widget.student-accnt',
	//id: 'winPrepaidHist',

	autoShow: true,
	closable: true,
	modal: true,
	//collapsible: true,
	//resizable: false,
	width: 700,
	height: 450,
	layout: 'fit',

    title : '购买课程记录',
	//titleAlign: 'center',
	
	record: null, // 父表参数传递，该学生信息

	fbar: [{
		xtype: 'label',
		html: '合计(元)：',
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
		//selType: 'cellmodel',
		store: 'Accnt',
	    columns: [{
			xtype: 'rownumberer',
	     }, {
	         text: '单据号',
	         width: 80,
			 menuDisabled: true,
	         dataIndex: 'accntID'
	     }, {
	         text: '日期',
	         width: 80,
			 menuDisabled: true,
	         dataIndex: 'accntDate'
	     }, {
	         text: '类型',
	         width: 60,
			 menuDisabled: true,
	         dataIndex: 'accntType'	,
	     }, {
	         text: '金额',
	         width: 60,
			 menuDisabled: true,
	         dataIndex: 'amount',
			 align: 'right' 
	     }, {
	         text: '欠费(元)',
	         width: 60,
			 menuDisabled: true,
	         dataIndex: 'balance',
			 align: 'right' 
	     }, {
	         text: '归属咨询师',
	         width: 80,
			 menuDisabled: true,
	         dataIndex: 'consultName_owe'
	     }, {
	         text: '备注',
	         flex: 1,
			 menuDisabled: true,
	         dataIndex: 'note'			
	     }, {
			menuDisabled: true,
			sortable: false,
			xtype: 'actioncolumn',
			width: 30,
			items: [{
				//iconCls: 'add',
				icon: 'resources/images/my_kclist_icon.png',
				tooltip: '课程明细',
				handler: function(grid, rowIndex, colIndex) {
					grid.getSelectionModel().select(rowIndex); // 高亮
					var rec = grid.getStore().getAt(rowIndex);
					grid.up('window').onAccntDetail(rec); 
				}	
			}] 
	     }, {
			menuDisabled: true,
			sortable: false,
			xtype: 'actioncolumn',
			width: 30,
			items: [{
				//iconCls: 'add',
				icon: 'resources/images/my_pay_icon.png',
				tooltip: '缴款明细',
				handler: function(grid, rowIndex, colIndex) {
					grid.getSelectionModel().select(rowIndex); // 高亮
					var rec = grid.getStore().getAt(rowIndex);
					grid.up('window').onAccntFee(rec); 
				}	
			}] 			 			 
	    }],     
	}],

	// 缴费的子表明细
	onAccntDetail: function(record){
		var obj = {
			"accntID": record.get('accntID')
		}
		console.log(obj)
        Ext.data.JsonP.request({
            url: Youngshine.app.getApplication().dataUrl + 'readAccntDetailByAccnt.php', 
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
						title += (i+1) + '、' + arr[i].title + '：' + 
							arr[i].hour+'课时'+ arr[i].amount+'元' + '<br>';
					Ext.MessageBox.alert('课程明细',title)
                }
            },
        });
	},
	
	// 缴款记录
	onAccntFee: function(record){
		var obj = {
			"accntID": record.get('accntID')
		}
		console.log(obj)
        Ext.data.JsonP.request({
            url: Youngshine.app.getApplication().dataUrl + 'readAccntFee.php', 
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
						title += (i+1) + '、' + arr[i].feeDate + arr[i].payment + 
							'：' + arr[i].amount+'元' + '<br>';
					Ext.MessageBox.alert('缴款记录',title)
                }
            },
        });
	},
/*	
	initComponent: function(){
		this.callParent()
		this.on('deactivate',function(e){
			this.close()
		})
	} */
});