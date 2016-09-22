Ext.define('Youngshine.store.Prepaid',{
    extend: 'Ext.data.Store',
    model: 'Youngshine.model.Prepaid',
	
    proxy: {
        type: 'jsonp',
        //url: '/users.json',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    autoLoad: false,
	
	sorters: {
		property: 'created',
		direction: 'Desc'
	}
});