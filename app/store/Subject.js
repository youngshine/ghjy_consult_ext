Ext.define('Youngshine.store.Subject',{
    extend: 'Ext.data.Store',
    model: 'Youngshine.model.Subject',
	
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