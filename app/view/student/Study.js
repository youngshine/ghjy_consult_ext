// particular学生报读的知识点，所有历史记录，不可编辑
Ext.define('Youngshine.view.student.Study' ,{
	extend: 'Ext.window.Window',
    alias : 'widget.student-study',
	id: 'winStudyHist',

	autoShow: true,
	closable: true,
	modal: true,
	collapsible: true,
	//resizable: false,
	width: 700,
	height: 450,
	layout: 'fit',
	
    style: {
        background: '#FDF5E6'  
    }, 

    title : '课程内容历史记录',
	//titleAlign: 'center',
	
	record: null, // 父表参数传递，该学生信息

	fbar: [{
		xtype: 'combo',
		width: 100,
		itemId: 'subject',
		store: {
			fields: ['value'],
			data : [
				{"value":"全部"},
				{"value":"通过学习"},
				{"value":"通过考试"},
				{"value":"家长付款"},
				{"value":"家长退费"},
			]
		},
		valueField: 'value',
		displayField: 'value',
		value: '全部',
		//autoSelect: true,
		editable: false,
		//padding: '5 0',
		listeners: {
			change: function(cb,newValue){
				var phase = newValue
				this.up('window').onFilter(phase); 
			}
		}
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
		selType: 'cellmodel',
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
	         text: '课时',
	         width: 30,
	         //sortable: false,
			 menuDisabled: true,
	         dataIndex: 'times',
			 align: 'center'
	     }, {
	         text: '学科',
	         width: 50,
	         //sortable: false,
			 menuDisabled: true,
	         dataIndex: 'subjectName'
	     }, {
	         text: '年级',
	         width: 50,
			 menuDisabled: true,
	         dataIndex: 'gradeName',
	     }, {
	         text: '上课日',
	         width: 50,
	         //sortable: false,
			 menuDisabled: true,
	         dataIndex: 'teach_weekday'	 
	     }, {
	         text: '时间段',
	         width: 50,
	         //sortable: false,
			 menuDisabled: true,
	         dataIndex: 'teach_timespan'	
	     }, {
	         text: '教师',
	         width: 60,
	         //sortable: false,
			 menuDisabled: true,
	         dataIndex: 'teacherName'
	     }, {
	         text: 'OrderID',
	         width: 110,
			 menuDisabled: true,
	         dataIndex: 'OrderID'
	     }, {
	         text: '学习',
	         width: 30,
			 menuDisabled: true,
	         dataIndex: 'pass'
	     }, {
	         text: '考试',
	         width: 30,
			 menuDisabled: true,
	         dataIndex: 'test'
	     }, {
	         text: '付款',
	         width: 30,
			 menuDisabled: true,
	         dataIndex: 'paid'
	     }, {
	         text: '报读时间',
	         width: 70,
			 menuDisabled: true,
	         dataIndex: 'created',
			 renderer : function(val) {
                 return '<span style="color:' + '#73b51e' + ';">' + val.substr(2,8) + '</span>';
                 return val;
             },		 		 
	     }],     
	}],
	
	onFilter: function(phase){
		var me = this;
		//var studentName = new RegExp("/*" + studentName); // 正则表达式
		var store = this.down('grid').getStore();
		store.clearFilter(); // filter is additive
		if(phase != '全部' ){
			switch(phase){
				case '通过学习':
					phase = 'pass';
					break;
				case '通过考试':
					phase = 'test';
					break;
				case '家长付款':
					phase = 'paid';
					break;	
			}
			store.filter([
				{property: phase, value: 1},
				//{property: "studentName", value: studentName}, // 姓名模糊查找？？
			]);
		}	
	},
	
	initComponent: function(){
		this.callParent()
		this.on('deactivate',function(e){
			this.hide()
		})
	}
});