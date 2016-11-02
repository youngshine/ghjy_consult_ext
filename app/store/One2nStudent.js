// 一对多的学生, 可以退出重新排课。？？？结束current=0不显示
Ext.define('Youngshine.store.One2nStudent',{
    extend: 'Ext.data.Store',
    model: 'Youngshine.model.One2nStudent',
	
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