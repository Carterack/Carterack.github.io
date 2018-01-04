var http = require('http');
var fs = require('fs'); 
var url = require('url');
var MongoClient = require('mongodb').MongoClient;
var mongoURL = "mongodb://localhost:27017/mydb";

http.createServer(function(req, res) 
{  
	console.log("hello");
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
				//console.log(string);
				res.write(string);
				res.end();
				client.close();
			});
		});	  
  }
	else if(q.search != "")  
  { 
		var qdata = q.query;
		//mongo
		MongoClient.connect(mongoURL, function(err, client) {
			if (err) throw err;
				var db = client.db('tempDatabase');
				db.collection('tempDatabase').insertOne({
				response: qdata.q})
				console.log("item");
				client.close();
		});		
		
		//mongo
		res.write(qdata.q);
		res.end();  
  }
  else
	{	//Mongo start
	MongoClient.connect(mongoURL, function(err, client) {
		if (err) throw err;
			var db = client.db('tempDatabase');
			var myquery = {};
			db.collection('tempDatabase').deleteMany(myquery, function(err, obj) {
		if (err) throw err;
			console.log(obj.result.n + " document(s) deleted");
			client.close();
		});
	});
		/* MongoClient.connect(mongoURL, function(err, client) {
			if (err) throw err;
			console.log("Database created!");
			client.close();
		}); */
		//mongodb code end
		fs.readFile('index.html', function(err, data)
  {
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write(data);
		res.end();
  }
  );  
  } 
}).listen(8888, '127.0.0.1');
console.log('Server running at http://127.0.0.1:8888');


