Ext.define('Youngshine.store.Kclist',{
    extend: 'Ext.data.Store',
    model: 'Youngshine.model.Kclist',
	
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