Ext.define('Youngshine.view.assess.ChartAssess' ,{
	extend: 'Ext.window.Window',
    alias : 'widget.chart-assess',
	id: 'winChartAssess',
	
	requires: ['Ext.chart.*'],

	closable: true,
	modal: true,
    autoShow: true,
	//resizable: false,
	autoScroll: true,
	maximizable: true,
	maximized: true,
	minWidth: 400,
	minHeight: 400,
	layout: 'fit',

    title : '测评报告',
	
	record: null,
/*	
	fbar: [{
		text: '历年考点',
		handler: function(btn){
			//btn.up('window').onChartRadar()
			var ta = Youngshine.getApplication().getController('Assess').getAssesstopic()
			console.log(ta)
			ta.onChartRadar()
		}
	},'->',{	
		text: '关闭',
		//scale: 'medium',
		width: 55,
		handler: function(btn){
			btn.up('window').close()
		}
	}],	*/
/*
    initComponent: function(){
		var chart = Ext.create('Ext.chart.Chart', {
		    width: 400,
		    height: 400,
		    animate: true,
		    shadow: true,
		    store: '',
		    renderTo: Ext.getBody(),
		    legend: {
		        position: 'right'
		    },
		    insetPadding: 25,
		    theme: 'Base:gradients',
		    series: [{
		        type: 'pie',
		        field: 'times',
		        showInLegend: true,
				tips: {
                  trackMouse: true,
                  width: 140,
                  height: 28,
                  renderer: function(storeItem, item) {
                    //calculate percentage.

                    this.setTitle(storeItem.get('zsd') + ': ' + storeItem.get('times'));
                  }
                },
		        highlight: {
		          segment: {
		            margin: 20
		          }
		        },
		        label: {
		            field: 'zsd',
		            display: 'rotate',
		            contrast: true,
		            font: '18px Arial'
		        }
		    }]
		});
		  
	  	this.items = chart;
		  
		this.callParent(arguments); //it's necessary to call in order to initialize parent components of this grid
		  
    },
*/	
});