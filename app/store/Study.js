Ext.define('Youngshine.store.Study',{
    extend: 'Ext.data.Store',
    model: 'Youngshine.model.Study',
	
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