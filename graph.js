var fs = require('fs'); 
var http = require('http');
var url = require('url');
var MongoClient = require('mongodb').MongoClient;
var mongoURL = "mongodb://localhost:27017/mydb";

http.createServer(function(req, res) {
	
	var q = url.parse(req.url, true);
	var string = "";
	
	if(q.pathname == "/getData") {
		MongoClient.connect(mongoURL, function(err, client) {
			if (err) throw err;
				var db = client.db('tempDatabase');
		db.collection('tempDatabase').find({}).toArray(function(err, result) {
			if (err) throw err;
				 
				for (var i = 0; i < result.length; i++) {
					string = string.concat(" " + result[i].response+ ",");
					
				}
				console.log(string);
				res.write(string);
				res.end();
				client.close();
			});
		});	
		
  } 
  
	else {
		fs.readFile('graphdisplay.html', function(err, data)
		{
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.write(data);
			res.end();
		}
		);
		}
		
	
}).listen(8888, '127.0.0.1');
console.log('Server running at http://127.0.0.1:8888');

function createGraph(){
var x = d3.scale.linear()
    .domain([0, d3.max(data)])
    .range([0, 420]);

d3.select(".chart")
  .selectAll("div")
    .data(data)
  .enter().append("div")
    .style("width", function(d) { return x(d) + "px"; })
    .text(function(d) { return d; });
}
