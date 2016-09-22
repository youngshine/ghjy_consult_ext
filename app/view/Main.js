Ext.define('Youngshine.view.Main', {
    extend: 'Ext.container.Container',
    xtype: 'app-main',
	
    requires:[
        'Ext.tab.Panel',
        'Ext.layout.container.Border',

		'Youngshine.view.West',
    ],

    layout: {
        type: 'border'
    },

    items: [{
        region: 'north',
		xtype: 'container',
        //title: '导航菜单',
		html: null,
        height: 30,
		padding: '5 10',
		style: {
			backgroundColor: '#333', 
			color: '#ccc',                
		},

    },{
		region: 'west',
        //xtype: 'panel',
		xtype: 'mywest',
        //title: '导航菜单',
        width: 200,
    },{
        region: 'center',
		//title: '新课堂教育－－理科提分智能系统',
	    layout: {
	        //type: 'vbox',
			//align: 'center',
			//pack: 'center'
	    },
		bodyStyle: {
            //background: 'center',
			backgroundImage: 'url(resources/images/bg.jpg)',
			backgroundRepeat:'no-repeat',
			//backgroundColor: '#f9f9f9',
			backgroundPosition: 'left top',
			//backgroundSize: '100% 100%',
			backgroundSize: '100% 100%',                  
		},
		//xtype: 'register-form',
        //xtype: 'tabpanel',
        //items:[{
        //    title: 'Center Tab 1'
			//xtype: 'login-form',
		//}]
		border: 0
   
    }],
	

});