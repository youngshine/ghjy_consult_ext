// 缴费明细子表
Ext.define('Youngshine.store.AccntDetail',{
    extend: 'Ext.data.Store',
    model: 'Youngshine.model.AccntDetail',
	
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