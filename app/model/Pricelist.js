Ext.define('Youngshine.model.Pricelist', {
    extend: 'Ext.data.Model',
    //idProperty: 'admin_id',
    fields: [
		{name: 'pricelistID'}, 
		{name: 'title'}, 
		{name: 'unitprice'}, 
		{name: 'hour'}, 
		{name: 'schoolID'}, 
		{name: 'schoolName'},		
    ]
});