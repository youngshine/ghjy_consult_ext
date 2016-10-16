// 缴费明细子表
Ext.define('Youngshine.store.AccntFee',{
    extend: 'Ext.data.Store',
    model: 'Youngshine.model.AccntFee',
	
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