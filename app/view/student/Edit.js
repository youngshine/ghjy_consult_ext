Ext.define('Youngshine.view.student.Edit', {
    extend: 'Ext.window.Window',
    alias : 'widget.student-edit',
	id: 'winStudentEdit',
	
    autoShow: true,
    modal: true,
	resizable: false,
	closable: false,
    //layout: 'fit',
	width: 400,
	//height: 300,
	title : '修改学生资料',

    fbar : ['->',{
		text: '保存',
		handler: function(btn){
			btn.up('window').onSave();
		}
	},{
		text: '取消',
		//scope: this,
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
			
		},{			
			xtype: 'hiddenfield',//修改的唯一id,隐藏
			name: 'studentID',
		}],
    }],
	
	onSave: function(){
		var me = this;
/*		
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
			schoolsubID = this.down('combo[name=schoolsubID]').getValue(),
			studentID = this.down('hiddenfield[name=studentID]').getValue() // unique

		if (studentName == ''){
			Ext.Msg.alert('提示','姓名不能空白！');
			return;
		}
		if (phone == ''){
			Ext.Msg.alert('提示','电话不能空白！');
			return;
		}
		
		
		Ext.Msg.confirm('询问','确认修改保存？',function(id){
			if( id == "yes"){
				var obj = {
					"studentName": studentName,
					"gender": gender,
					"born": born,
					"phone": phone,
					"addr": addr,
					//"district": district,
					"grade": grade,
					//"school": school,
					//"level_list": level_list,
					"note": note,
					"schoolsubID": schoolsubID,
					"studentID": studentID, // unique
					//"consultID": localStorage.consultID, 
					//微信注册的，尚未分配咨询师 consultID=0 ??未归属不显示，等待校长归属
				};
				console.log(obj);
				//me.close();
				me.fireEvent('save',obj,me); //后台数据判断，才能关闭  本窗口win
				
				/* 更新前端store
				var model = me.down('form').getRecord();
				model.set(obj) */
			}
		})
	},
	
	// 查找选择所在省市县
	onDistrict: function(e,input){
		var me = this;

		var win = Ext.create('Youngshine.view.student.District'); 
		win.showAt(e.getXY())  
		
		// 带入参数：当前js textfield，返回值显示
		win.input = input;
		//win.down('treepanel').store = store;
		
		/*
		var loader = new Ext.ux.tree.XmlTreeLoader({
			preloadChildren: true,//若为true，则loader在节点第一次访问时加载"children"的属性
			clearOnLoad: false,//（可选）默认为true。在读取数据前移除已存在的节点
			dataUrl:'resources/data/county.xml'
		}),
		console.log(loader);  */

	},
});