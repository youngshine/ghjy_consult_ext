// 省市县
Ext.define('Youngshine.store.District', {
    extend: 'Ext.data.TreeStore',

	//autoLoad: false,
    root: {
        text: '全国省份',
		expanded: true,
        children: [
            {
                text: '福建',
                children: [
					{
	                    text: '泉州',
						children: [
							{ leaf:true, text: '鲤城区' },
							{ leaf:true, text: '丰泽区' },
							{ leaf:true, text: '洛江区' },
							{ leaf:true, text: '泉州经济技术开发区' },
							{ leaf:true, text: '晋江市' },
							{ leaf:true, text: '石狮市' },
							{ leaf:true, text: '惠安县' },
							{ leaf:true, text: '泉港区' },
							{ leaf:true, text: '台商投资区' },
							{ leaf:true, text: '南安市' },
							{ leaf:true, text: '安溪县' },
							{ leaf:true, text: '永春县' },
							{ leaf:true, text: '德化县' }
						]
					},
					{
	                    text: '厦门',
						children: [
							{ leaf:true, text: '思明区' },
							{ leaf:true, text: '湖里区' },
							{ leaf:true, text: '海沧区' },
							{ leaf:true, text: '集美区' },
							{ leaf:true, text: '同安区' },
							{ leaf:true, text: '翔安区' }
						]
					},
					{
	                    text: '三明',
						children: [
							{ leaf:true, text: '三元区' },
							{ leaf:true, text: '梅列区' },
							{ leaf:true, text: '沙县' },
							{ leaf:true, text: '将乐县' },
							{ leaf:true, text: '泰宁县' },
							{ leaf:true, text: '建宁县' },
							{ leaf:true, text: '清流县' },
							{ leaf:true, text: '宁化县' },
							{ leaf:true, text: '明溪县' },
							{ leaf:true, text: '尤溪县' },
							{ leaf:true, text: '大田县' }
						]
					}		
                ]
            },
            {
                text: '江西',
                children: [
					{
	                    text: '南昌',
						children: [
							{ leaf:true, text: '东湖区' },
							{ leaf:true, text: '西湖区' },
							{ leaf:true, text: '青云谱区' },
							{ leaf:true, text: '青山湖区' },
							{ leaf:true, text: '湾里区' },
							{ leaf:true, text: '新建区' },
							{ leaf:true, text: '南昌县' },
							{ leaf:true, text: '进贤县' },
							{ leaf:true, text: '安义县' },
							{ leaf:true, text: '红谷滩新区' },
							{ leaf:true, text: '高新区' },
							{ leaf:true, text: '南昌经济开发区' },
							{ leaf:true, text: '小蓝经济技术开发区' },
							{ leaf:true, text: '桑海经济技术开发区' },
							{ leaf:true, text: '望城新区' }
						]
					},
					{
	                    text: '厦门',
						children: [
							{ leaf:true, text: '思明区' },
							{ leaf:true, text: '湖里区' },
							{ leaf:true, text: '海沧区' },
							{ leaf:true, text: '集美区' },
							{ leaf:true, text: '同安区' },
							{ leaf:true, text: '翔安区' }
						]
					},
					{
	                    text: '三明',
						children: [
							{ leaf:true, text: '三元区' },
							{ leaf:true, text: '梅列区' },
							{ leaf:true, text: '沙县' },
							{ leaf:true, text: '将乐县' },
							{ leaf:true, text: '泰宁县' },
							{ leaf:true, text: '建宁县' },
							{ leaf:true, text: '清流县' },
							{ leaf:true, text: '宁化县' },
							{ leaf:true, text: '明溪县' },
							{ leaf:true, text: '尤溪县' },
							{ leaf:true, text: '大田县' }
						]
					}		
                ]
            },
        ]
    }
});
