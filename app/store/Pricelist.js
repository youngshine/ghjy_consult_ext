Ext.define('Youngshine.store.Pricelist',{
    extend: 'Ext.data.Store',
    model: 'Youngshine.model.Pricelist',
	
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