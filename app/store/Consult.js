Ext.define('Youngshine.store.Consult',{
    extend: 'Ext.data.Store',
    model: 'Youngshine.model.Consult',
	
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