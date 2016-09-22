Ext.define('Youngshine.store.Zsd',{
    extend: 'Ext.data.Store',
    model: 'Youngshine.model.Zsd',
	
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