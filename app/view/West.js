Ext.define('Youngshine.view.West', {
    extend: 'Ext.Container',
    //alias: 'widget.pageHeader',
	xtype: 'mywest',
	
	title: '功能导航',
	layout: {
		// layout-specific configs go here
		type: 'accordion',
		titleCollapse: true,
		animate: true,
		//activeOnTop: true
	},
	collapsed: false,
	collapsible: true,

	items: [{
		title: '咨询师',
		html: '<div style="margin:10px 5px;cursor:pointer">'+
			'<div class="menuitem" title="student" style="margin:5px;">学生</div>'+

			'<div style="margin:10px 0;cursor:auto;"><hr></div>'+
			'<div class="menuitem" title="consult" style="margin:5px;">咨询师</div>'+
			'<div class="menuitem" title="teacher" style="margin:5px;">教师</div>'+
		
			'<div style="margin:10px 0;cursor:auto;"><hr></div>'+
			'<div class="menuitem" title="kclist" style="margin:5px;">课程</div>'+
			'<div class="menuitem" title="one2onePk" style="margin:5px;">一对一排课</div>'+
			'<div class="menuitem" title="classesPk" style="margin:5px;">学生分班</div>'+
			'<div class="menuitem" title="classes" style="margin:5px;">班级管理</div>'+
		
			'<div style="margin:10px 0;cursor:auto;"><hr></div>'+
			'<div class="menuitem" title="accnt" style="margin:5px;">报读缴费</div>'+
			'<div class="menuitem" title="accntconsult" style="margin:5px;">咨询师业绩统计</div>'+
			'<div class="menuitem" title="accntteacher" style="margin:5px;">教师课时统计</div>'+

			'<div style="margin:10px 0;cursor:auto;"><hr></div>'+
			'<div class="menuitem" title="pswreset" style="margin:5px;">账号设置</div>'+
			'<div class="menuitem" title="logout" style="margin:5px;">退出</div>'+
		    '</div>'
    }],
	listeners: {
		el: {
			delegate: 'div.menuitem',
			click: function(e,obj){
				Ext.getCmp(this.id).onNav(obj);
			},
		}
	},
	onNav: function(obj){
		var me = this;
		if(obj.title == 'logout'){
			Ext.Msg.confirm('询问', '是否退出系统？', function(btn){
				if(btn=='yes'){
					me.fireEvent('logout');
				}
			});	
		}else{
			me.fireEvent(obj.title);
		}
	}
});