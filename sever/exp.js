var http = require('http');
var url = require('url');
var fs = require("fs");

var hostname = '127.0.0.1';
var port = 3230;

var route = function(urlObj) {
	var result = [];
	/*if (urlObj.pathname === "/change") {
		console.log('change');
		var text = fs.readFileSync('./user/dept.json');
		var content = JSON.parse(text);
		var i = 0;
		var changeDeptData = function (dept) {
			dept.deptName = '测试部门_0_' + (i++);
			var k = 0;
			if (dept.children.length > 0) {
				var item = dept.children[k];
				while (item) {
					changeDeptData(dept.children[k]);
					item = dept.children[++k];
				}
			}
		};
		changeDeptData(content.data.dept); 
		for (var item = null, i = 0, len = content.data.list.length; i < len ; i++) {
			item =  content.data.list[i];
			item.staffName = '测试_' + i;
			item.mobile = item.mobile.slice(0, 3) + '****' + item.mobile.slice(7);
			item.email = 'test' + i + '@test.com';
		}
		fs.writeFileSync('./user/dept.json', JSON.stringify(content));
	}*/
	if (urlObj.pathname === "/user") {
		result.type = "json";
		// result.content = '{"code":0,"msg":"OK","data":{"page":{"pageNo":1,"pageSize":20,"totalRecord":55,"totalPage":3,"paraListJson":"{}","paraJson":"{}"},"list":[{"id":3,"authName":" 看大门的","authDesc":"角色","ctime":1472021830000},{"id":4,"authName":" 总经理助理","authDesc":"帮助总经理处理日常事务","ctime":1476325353000},{"id":6,"authName":"TEST","authDesc":"TTSSTTSSTTSS","ctime":1476326216000},{"id":39,"authName":"CEO-1","authDesc":"测试职位描述测试职位描述 测试职位描述 测试职位描述 测试职位描述2222222222222222222222sdffer2342424234234242342342342342342342","ctime":1477041263000},{"id":40,"authName":"CEO助理","authDesc":"1、帮助CEO处理日常事务 2、工作","ctime":1477363618000},{"id":41,"authName":"CEO-2","authDesc":"ceo111ceo111ceo111 ceo111ceo111ceo111 ceo111ceo111ceo111 ceo111ceo111ceo111 ceo111ceo111ceo111","ctime":1477363685000},{"id":43,"authName":"CEO-3","authDesc":"ceo2222ceo2222ceo2222 ceo2222ceo2222ceo2222ceo2222ceo2222ceo2222 ceo2222ceo2222ceo2222","ctime":1477363872000},{"id":44,"authName":"ceo22","authDesc":"十分大发发发打发的撒范德萨十分大发发发打发的撒范德萨十分大发发发打发的撒范德萨十分大发发发打发的撒范德萨十分大发发发打发的撒范德萨","ctime":1477363939000},{"id":50,"authName":"前端开发工程师","authDesc":"前端开发工程师","ctime":1477381454000},{"id":51,"authName":"后端开发工程师","authDesc":"后端开发工程师","ctime":1477381472000},{"id":52,"authName":"财务会计","authDesc":"财务会计","ctime":1477381487000},{"id":53,"authName":"dpt test","authDesc":"dpetestdpetestdpetestdpetestdpetestdpetestdpetestdpetest","ctime":1477381521000},{"id":54,"authName":" dpt test2","authDesc":"dpt test22222222","ctime":1477381528000},{"id":55,"authName":" dpt test3","authDesc":"dpt test333333","ctime":1477381536000},{"id":56,"authName":"dpt test4","authDesc":"dpt test4","ctime":1477381546000},{"id":61,"authName":"测试","authDesc":"测试工作","ctime":1477389920000},{"id":62,"authName":"Java开发工程师","authDesc":"Java开发测试","ctime":1477390533000},{"id":65,"authName":"php","authDesc":"php test","ctime":1477391167000},{"id":66,"authName":"C#开发工程师","authDesc":"C#开发","ctime":1477392281000},{"id":67,"authName":"node工程师","authDesc":"node工程师","ctime":1477446230000}]}}';
		result.content = urlObj.query;
		/*var arr = urlObj.query.split("&"),json = {};
		for(var i = 0 ; i < arr.length ; i++){
			json[arr[i].split("=")[0]] = arr[i].split("=")[1];
		}
		result.content = json;*/
	} else if (/.json$/.test(urlObj.pathname)) {
		result.type = "json";
		console.log("/mySource" + urlObj.pathname);
		result.content = fs.readFileSync("/mySource/" + urlObj.pathname);
	}  else if (/.html$/.test(urlObj.pathname)) {
		result.type = "html";
		result.content = fs.readFileSync("/mySource/" + urlObj.pathname);
	} else if (/.css$/.test(urlObj.pathname)) {
		result.type = "css";
		result.content = fs.readFileSync("/mySource/" + urlObj.pathname);
	} else if (/.js$/.test(urlObj.pathname)) {
		result.type = "javascript";
		result.content = fs.readFileSync("/mySource/" + urlObj.pathname);
	} else if (urlObj.pathname === "/test"){
		console.log("/mySource/" + urlObj.pathname + ".js");
		result.content = new Function(fs.readFileSync("/mySource/" + urlObj.pathname + ".js"))();
	}
	return result;
};

var server = http.createServer((req, res) => {
	var urlObj = url.parse(req.url);
	var pathname = urlObj.pathname;
	res.statusCode = 200;
	/*for(var index in req){
		(typeof req[index] !== "function") && console.log("req." + index + ": " + req[index]);	
	}*/
	
	console.log("pathname: " + pathname);
	var response = route(urlObj);
	switch(response.type){
		case "css":
			res.setHeader('Content-Type', 'text/css');
			break;
		case "html":
			res.setHeader('Content-Type', 'text/html');
			break;
		case "javascript":
			res.setHeader('Content-Type', 'application/javascript');
			break;
		case "json":
			res.setHeader('Content-Type', 'application/json;charset=UTF-8');
			break;
		default:
			res.setHeader('Content-Type', 'application/json;charset=UTF-8');

	};
	res.end(response.content);
	// res.json(response.content);
});

server.listen(port, hostname, function() {
	console.dir(`Server running at http://${hostname}:${port}/`);
});
console.log("程序执行结束");