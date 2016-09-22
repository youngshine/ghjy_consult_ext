Ext.define('Youngshine.view.student.New', {
    extend: 'Ext.window.Window',
    alias : 'widget.student-new',
	id: 'winStudentNew',
	
	autoShow: true,
	modal: true,
	resizable: false,
	closable: false,
	width: 400,
	//height: 300,
	//layout: 'fit',
	title : '新增学生',

    fbar : ['->',{
		text: '保存',
		handler: function(btn){
			btn.up('window').onSave();
		}
	},{
		text: '取消',
		handler: function(btn){
			btn.up('window').destroy();
			//this.close();
		}
	}],	
	
	items: [{
		xtype: 'form',
		bodyPadding: 10,
		fieldDefaults: {
			labelWidth: 65,
			labelAlign: 'right',
			anchor: '100%'
		},
		items: [{
			xtype: 'textfield',
			name : 'studentName',
			fieldLabel: '姓名'
		},{
			xtype: 'combo',
			name: 'gender',
			store: {
				fields: ['value'],
				data : [
					{"value":"男"},
					{"value":"女"},
				]
			},
			valueField: 'value',
			displayField: 'value',
			editable: false,
			fieldLabel: '性别'
		},{
			xtype: 'datefield',
            fieldLabel: '出生日期',
			format: 'Y-m-d',
            name: 'born',
            allowBlank: false,	
/*
		},{
			xtype: 'textfield',
			name: 'district',
			fieldLabel: '所在地区',
			emptyText: '选择省市县',
			readOnly: true,
			listeners: {
		        click: {
		            element: 'el', //bind to the underlying el property on the panel
		            fn: function(e,opts){ 					
						Ext.getCmp('winStudentNew').onDistrict(e,opts)
					},
		        },	
		    }, */
		},{
			xtype: 'combo',
			name: 'grade',
			store: {
				fields: ['value'],
				data : [
					{"value":"一年级"},
					{"value":"二年级"},
					{"value":"三年级"},
					{"value":"四年级"},
					{"value":"五年级"},
					{"value":"六年级"},
					{"value":"七年级"},
					{"value":"八年级"},
					{"value":"九年级"},
				]
			},
			valueField: 'value',
			displayField: 'value',
			editable: false,
			fieldLabel: '年级'	
		},{
			xtype: 'textfield',
			name: 'phone',
			fieldLabel: '电话',
		},{
			xtype: 'textfield',
			name: 'addr',
			fieldLabel: '住址',	
		},{
			xtype: 'textfield',
			name: 'note',
			fieldLabel: '备注',		
		},{
			xtype: 'combo',
			name: 'schoolsubID',
			store: 'Schoolsub',
			valueField: 'schoolsubID',
			displayField: 'fullname',
			editable: false,
			fieldLabel: '所属分校区'	
/*		},{
			xtype: 'textfield',
			name: 'school',
			fieldLabel: '学校',	
	
		},{
			xtype: 'radiogroup',
	        fieldLabel: '数学成绩',
			itemId: 'sx',
	        // Arrange radio buttons into two columns, distributed vertically
	        //columns: 2,
	        vertical: true,
	        items: [
	            { boxLabel: '低', name: 'sx', inputValue: '1' },
	            { boxLabel: '中', name: 'sx', inputValue: '2' },
	            { boxLabel: '高', name: 'sx', inputValue: '3' }
	        ]
		},{
			xtype: 'radiogroup',
	        fieldLabel: '物理成绩',
			itemId: 'wl',
	        // Arrange radio buttons into two columns, distributed vertically
	        //columns: 2,
	        vertical: true,
	        items: [
	            { boxLabel: '低', name: 'wl', inputValue: '1' },
	            { boxLabel: '中', name: 'wl', inputValue: '2' },
	            { boxLabel: '高', name: 'wl', inputValue: '3' }
	        ]	
		},{
			xtype: 'radiogroup',
	        fieldLabel: '化学成绩',
			itemId: 'hx',
	        // Arrange radio buttons into two columns, distributed vertically
	        //columns: 2,
	        vertical: true,
	        items: [
	            { boxLabel: '低', name: 'hx', inputValue: '1' },
	            { boxLabel: '中', name: 'hx', inputValue: '2' },
	            { boxLabel: '高', name: 'hx', inputValue: '3' }
	        ] */
			
		},{
			xtype: 'hiddenfield',
			name: 'level' //数理化科学 测试水平，数组列表 1,1,2,3		
		}],
    }],
   
	onSave: function(){
		var me = this;  /*
		console.log(this.down('radiogroup[itemId=wl]').getChecked())
		// 有无选中
		var sx = this.down('radiogroup[itemId=sx]').getChecked()[0], 
			wl = this.down('radiogroup[itemId=wl]').getChecked()[0],
			hx = this.down('radiogroup[itemId=hx]').getChecked()[0];
		sx = sx != null ? sx.inputValue : 0
		wl = wl != null ? wl.inputValue : 0
		hx = hx != null ? hx.inputValue : 0
		// 拼接 成绩: 数组：数理化科学水平 1,1,3,2
		var level_list = sx + ',' + wl + ',' + hx //+ ',' + science
		console.log(level_list)
*/			
		var studentName = this.down('textfield[name=studentName]').getValue().trim(),
			gender = this.down('combo[name=gender]').getValue(),
			//datetime.toLocaleDateString() // 0点0分，不准确，要转换toLocal
			born = this.down('datefield[name=born]').getValue(), 
			grade = this.down('combo[name=grade]').getValue(),
			phone = this.down('textfield[name=phone]').getValue().trim(),
			addr = this.down('textfield[name=addr]').getValue().trim(),
			//district = this.down('textfield[name=district]').getValue().trim(),
			//school = this.down('textfield[name=school]').getValue().trim(),
			note = this.down('textfield[name=note]').getValue().trim(),
			schoolsubID = this.down('combo[name=schoolsubID]').getValue()
		
		if (studentName == ''){
			Ext.Msg.alert('提示','姓名不能空白！');
			return;
		}
		if (gender == null){
			Ext.Msg.alert('提示','请选择性别！');
			return;
		}	
		if (phone == ''){
			Ext.Msg.alert('提示','电话不能空白！');
			return;
		} /*
		if (district == ''){
			Ext.Msg.alert('提示','请选择所在地区！');
			return;
		} */
		if (schoolsubID == null){
			Ext.Msg.alert('提示','请选择学生所属分校区！');
			return;
		}

		Ext.Msg.confirm('询问','是否保存？',function(id){
			if( id == "yes"){
				//if(viewEF.isValid()){
					var obj = {
						"studentName": studentName,
						"gender": gender,
						"born": born,
						"grade": grade,
						//"school": school,
						//"level_list": level_list,
						"phone": phone,
						//"qq": qq,
						"addr": addr,
						//"district": district,
						"note": note,	
						"schoolsubID": schoolsubID,						
						"consultID": localStorage.consultID, //当前登录的咨询师
					};
					console.log(obj);
					//me.close();
					me.fireEvent('save',obj,me); //后台数据判断，才能关闭  本窗口win
				//}
			}
		})
	},
	
	// 查找选择所在省市县
	onDistrict: function(e,input){
		console.log(input)
		var win = Ext.create('Youngshine.view.student.District'); 
		win.showAt(e.getXY())  
		
		// 带入参数：当前js textfield，返回值显示
		win.input = input;
	},
});