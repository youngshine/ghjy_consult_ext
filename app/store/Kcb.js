Ext.define('Youngshine.store.Kcb',{
    extend: 'Ext.data.Store',
    model: 'Youngshine.model.Kcb',
	
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