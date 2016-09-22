Ext.define('Youngshine.store.Classes',{
    extend: 'Ext.data.Store',
    model: 'Youngshine.model.Classes',
	
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