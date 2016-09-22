// 测评主记录：学生、学科
Ext.define('Youngshine.store.Assess',{
    extend: 'Ext.data.Store',
    model: 'Youngshine.model.Assess',
	
    proxy: {
        type: 'jsonp',
        //url: '/users.json',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    autoLoad: false,

});