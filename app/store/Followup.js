Ext.define('Youngshine.store.Followup',{
    extend: 'Ext.data.Store',
    model: 'Youngshine.model.Followup',
	
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