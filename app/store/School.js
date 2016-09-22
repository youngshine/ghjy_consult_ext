Ext.define('Youngshine.store.School',{
    extend: 'Ext.data.Store',
    model: 'Youngshine.model.School',
	
    proxy: {
        type: 'jsonp',
        //url: 'script/readSchoolList.php',//'/users.json',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    autoLoad: false,

});