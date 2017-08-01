window.onload = function() {
	Vue.prototype.$ajax = axios;

	// axios.get('sever/user/dept.json').then(function(){
	//     console.log('1111111111');
	// });
	// axios.get('sever/user/staff.json').then(function(){
	//     console.log('2222222222');
	// });

	// 分页组件
	var paging = {
			props: ['page'],
			template: '<div class="page"><a href="javascript:void(0);" @click="prev">上一页</a><div><ul v-if="page.openSkip"><li v-for="index in page.totalPage" @click="changePage(index)">第{{index}}页</li></ul><a href="javascript:void(0);" @click="toggleSkip">第{{page.pageNo}}页</a></div><a href="javascript:void(0);" @click="next">下一页</a><div class="page-size"><span>每页显示</span><ul v-if="page.openSize"><li v-for="index in page.size" @click="changeSize(index)">{{index}}</li></ul><a href="javascript:void(0);" @click="toggleSize">{{page.pageSize}}</a><span>条</span></div></div>',
			methods: {
				updateStaff: function(da) {
					da.staffs = da._staffs.slice((da.page.pageNo - 1) * da.page.pageSize, da.page.pageNo * da.page.pageSize);
				},
				prev: function() {
					var da = this.$parent.$data;
					if (da.page.pageNo <= 1) {
						return;
					}
					da.page.pageNo--;
					this.updateStaff(da);
					// da.staffs = da._staffs.splice((da.page.pageNo-1) * da.page.pageSize, da.page.pageNo * da.page.pageSize);
				},
				next: function() {
					var da = this.$parent.$data;
					if (da.page.pageNo >= da.page.totalPage) {
						return;
					}
					da.page.pageNo++;
					this.updateStaff(da);
					// da.staffs = da._staffs.splice((da.page.pageNo-1) * da.page.pageSize, da.page.pageNo * da.page.pageSize);
				},
				changePage: function(pageNo) {
					var da = this.$parent.$data;
					da.page.pageNo = pageNo;
					this.toggleSkip();
					this.updateStaff(da);
					console.log(arguments);
				},
				changeSize: function(pageSize) {
					var da = this.$parent.$data;
					da.page.pageSize = pageSize;
					da.page.totalPage = Math.ceil(da._staffs.length / pageSize);
					if (da.page.pageNo > da.page.totalPage) {
						da.page.pageNo = da.page.totalPage;
					}
					this.toggleSize();
					this.updateStaff(da);
					console.log(arguments);
				},
				toggleSkip: function() {
					this.$parent.$data.page.openSkip = !this.$parent.$data.page.openSkip;
				},
				toggleSize: function() {
					this.$parent.$data.page.openSize = !this.$parent.$data.page.openSize;
				}
			}
			// template: '<div>{{page}}</div>'
		}
		// 部门树组件
	var deptTree = {
			props: ['depts'],
			render: function(createElement) {
				var self = this;
				var vNode = '<ul>';
				var createDeptEl = function(depts) {
					var html = '';
					var i = 0;
					if (depts.children.length) {
						html = '<label index="' + JSON.stringify(depts.index) + '" ' + (depts.id == self.$parent.$data.currentDept ? 'class="select"' : '') + '>' + depts.deptName + '</label>';
						if (depts.open) {
							html += '<ul class="expanded">';
						} else {
							html += '<ul class="collapsed">';
						}
						while (depts.children[i]) {
							html += createDeptEl(depts.children[i++]);
						}
						html += '</ul>';
					} else {
						html = '<li index="' + JSON.stringify(depts.index) + '">' + depts.deptName + '</li>'
					}
					return html;
				};
				vNode += createDeptEl(self.depts) + '</ul>';
				return createElement('div', {
					'domProps': {
						'innerHTML': vNode
					},
					'on': {
						'click': function(ev) {
							self.expandDept(ev);
						}
					}
				});
			},
			methods: {
				expandDept: function(ev) {
					var self = this;
					var target = ev.target;
					var i = 0;
					var index = target.getAttribute('index');
					index = JSON.parse(index);
					var temp = self.depts;
					if (index.length > 0) {
						while (index[i] >= 0) {
							temp = temp.children[index[i++]];
						}
					}
					var toggleDept = false;
					if (self.$parent.$data.currentDept == temp.id) {
						toggleDept = true;
					}
					toggleDept && (temp.open = !temp.open);
					Vue.prototype.$emit.call(self.$parent, 'changeDept', temp);
					/*
					// 直接修改父组件的data更新人员列表
					var data = self.$parent.$data;
					data._staffs = getDeptStaff(data.staffs, temp.id);
					data.page.pageSize = 20;
					data.page.pageNo = 1;
					data.page.totalPage = Math.ceil(data._staffs.length / data.page.pageSize);
					data.staffs = data._staffs.splice(0, 20);*/
				}
			}
		}
		// 员工列表组件
	var staffList = {
		props: ['staffs'],
		template: '<div><ul class="title"><li>姓名</li><li>部门</li><li>职务</li><li>手机号</li><li>邮箱</li></ul><div class="items"><template v-for="staff in staffs"><ul><li>{{staff.staffName}}</li><li>{{staff.deptId}}</li><li>{{staff.dutyName}}</li><li>{{staff.mobile}}</li><li>{{staff.email}}</li></ul></template></div></div>'
	}

	axios.all([axios.get('sever/user/dept.json'), axios.get('sever/user/staff.json')]).then(function(data) {
		var depts = data[0].data.data.dept;
		var staffs = data[1].data.data.list;
		var index = [],
			temp;
		var addDeptsPramer = function(depts, index) {
			var i = 0;
			depts.open = false;
			depts.index = index;
			if (depts.children.length > 0) {
				while (depts.children[i]) {
					temp = [].concat(index);
					temp.push(i);
					addDeptsPramer(depts.children[i++], temp);
				}
			}
		};
		addDeptsPramer(depts, index);
		depts.open = true;
		var getDeptStaff = function(staffs, d_id) {
			var i = 0;
			var staff = staffs[i];
			var result = [];
			while (staff) {
				if (d_id == 1) {
					result.push(staff);
				} else if (staff.deptId == d_id && !staff.partTime) {
					result.push(staff);
				}
				staff = staffs[++i];
			}
			return result;
		};
		var vm = window.vm = new Vue({
			el: '#container',
			data: {
				'page': {
					'size': [20, 40, 60, 80],
					'pageNo': 1,
					'pageSize': 20,
					'totalPage': Math.ceil(staffs.length / 20),
					'openSkip': false,
					'openSize': false
				},
				'depts': depts,
				'currentDept': depts.id,
				'staffs': staffs.slice(0, 20),
				'_staffs': staffs
			},
			components: {
				'paging': paging,
				'deptTree': deptTree,
				'staffList': staffList
			}
		});
		vm.$on('changeDept', function(depts, index) {
			this.$data.currentDept = depts.id;
			this.$data._staffs = getDeptStaff(staffs, depts.id);
			this.$data.page.pageSize = 20;
			this.$data.page.pageNo = 1;
			this.$data.page.totalPage = Math.ceil(this.$data._staffs.length / this.$data.page.pageSize);
			this.$data.staffs = this.$data._staffs.splice(0, 20);
		});
	});

};