Ext.define('Youngshine.store.Teacher',{
    extend: 'Ext.data.Store',
    model: 'Youngshine.model.Teacher',
	
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