// 选择学生所在地区，xml tree-list
Ext.define('Youngshine.view.student.District' ,{ 
	extend: 'Ext.window.Window',
    alias : 'widget.district',
	id: 'winSelectDistrict',
	
	requires: [
        'Ext.tree.*',
    ],

    autoShow: false,
	closable: true,
	modal: true,
	resizable: false,
	//frame: true,
	//collapsible: true,
	//headerPosition: 'left',
	width: 350,
	height: 350,
	//autoScroll: true,
	layout: 'fit',
	
    title : '选择所在地区',
	
	initComponent: function(){
		//Ext.applyIf(this, {
            this.items = [{
				xtype: 'treepanel',
				store: 'District',
				rootVisible: false,
			//	id: 'tree',
				height: '100%',
				width: 350,
				useArrows: true,
				listeners: {
			/*		celldblclick: function(panel, td, cellIndex, record, tr, rowIndex, e, eOpts){
						if(record.data.is_room){
							alert(record.data.text);
						}
					},*/
					itemdblclick: function(panel, record, item, index, e, eOpts ){
						console.log(record)
						if(record.data.leaf){
							panel.up('window').onItemdblclick(record);
						}
					}
				},	
			}]
		//});
		
		this.callParent(arguments);
	},
	
	onItemdblclick:function(rec){
		var me = this;	
		var xian  = rec.data.text,
			shi   = rec.parentNode.data.text,
			sheng = rec.parentNode.parentNode.data.text
		var district = sheng+'•' + shi+'•' + xian
		//Ext.getCmp('winStudentEdit').down('textfield[name=district]').setValue(district)
		console.log(me.input.value)
		me.input.value = district;
		//me.input.setValue(district)
		this.close()	
	}
});