// 测评详细记录，包括题目及其对错10
Ext.define('Youngshine.store.Topic-assess',{
    extend: 'Ext.data.Store',
    model: 'Youngshine.model.Topic-assess',
	
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