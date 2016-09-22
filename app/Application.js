Ext.define('Youngshine.Application', {
    name: 'Youngshine',

    extend: 'Ext.app.Application',

	//服务端脚本位置php, 咨询pc端
	dataUrl: 'http://www.xzpt.org/ghjy_consult_ext/script/',  

    views: [
        // TODO: add views here
    ],

    controllers: [
        // TODO: add controllers here
		'Main','Student','Teacher','Consult','Accnt','Kclist'//,'Schoolsub'
    ],

    stores: [
        // TODO: add stores here
		'Schoolsub','Student','Consult','Teacher','Kclist','Accnt','AccntDetail'
    ]
});
