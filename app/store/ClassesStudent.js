// 班级的学生, 结束current=0不显示
Ext.define('Youngshine.store.ClassesStudent',{
    extend: 'Ext.data.Store',
    model: 'Youngshine.model.ClassesStudent',
	
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