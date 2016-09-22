// 分校区
Ext.define('Youngshine.store.Schoolsub',{
    extend: 'Ext.data.Store',
    model: 'Youngshine.model.Schoolsub',
	
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