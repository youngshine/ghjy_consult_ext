Ext.define('Youngshine.store.Student',{
    extend: 'Ext.data.Store',
    model: 'Youngshine.model.Student',
	
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