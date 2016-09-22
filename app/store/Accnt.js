// 缴费及其明细
Ext.define('Youngshine.store.Accnt',{
    extend: 'Ext.data.Store',
    model: 'Youngshine.model.Accnt',
	
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