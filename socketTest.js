var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var MongoClient = require('mongodb').MongoClient;
var mongoURL = "mongodb://localhost:27017/mydb";
var url = require('url');

app.get('/index.html', function(req, res){
	var q = url.parse(req.url, true);
	if(q.search != "") {
		var qdata = q.query;
		//mongo
		MongoClient.connect(mongoURL, function(err, client) {
			if (err) throw err;
			
				var db = client.db('tempDatabase');
				db.collection('tempDatabase').insertOne({response: qdata.q,input: qdata.i})
				console.log("1 doc inserted");
				//console.log(qdata.q);
				//console.log(qdata.i);
				client.close();
		});		
		
		//mongo
		res.write(qdata.q);
		res.end();
	}
		//doesnt do anything -we think-
		/* function sendDataToTable(celsius,fahrenheit) {
		var temps = celsius.concat("," + fahrenheit); 
		res.writeHead(200, {'Content-Type': 'text/event-stream',
		'Cache-Control': 'no-cache', 'Connection': 'keep-alive'});
		console.log(temps);	
		}
		sendDataToTable(qdata.q,qdata.i);} */
		//
	else{	
	res.sendFile(__dirname + '/socketIndex.html');
	}
});

app.get("/index.html/getData", function(req,res) {
		var string = "";
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
				return res.end();
				client.close();
			});
		});		  
	});

app.get("/index.html/delete", function(req,res){
		MongoClient.connect(mongoURL, function(err, client) {
			if (err) throw err;
			
			var db = client.db('tempDatabase');
			var myquery = {};
			db.collection('tempDatabase').deleteMany(myquery, function(err, obj) {
				if (err) throw err;
				
				console.log(obj.result.n + " document(s) deleted");
				res.write("");
				res.end();
				client.close();
			});
		});
	
	});
	
app.get('/graphdisplay.html', function(req, res){	
	res.sendFile(__dirname + '/socketGraphDisplay.html');
	
});

app.get("/graphdisplay.html/getTable", function(req,res){
		var string = "";
		MongoClient.connect(mongoURL, function(err, client) {
			if (err) throw err;
			
			var db = client.db('tempDatabase');
			db.collection('tempDatabase').find({}).toArray(function(err, result) {
				if (err) throw err;
				
				if(result.length != 0){
					for (var i = 0; i < result.length-1; i++) {
						string = string.concat(result[i].response + "," + result[i].input + ",");
					}
					string = string.concat(result[result.length - 1].response + "," + result[result.length -1].input);
				}
				//console.log(string);
				res.write(string);
				res.end();
				client.close();
			});
		});	
			 
	});
io.on('connection', function(socket){
  socket.on('data inputted', function(msg){
   // console.log('data inputted: ' + msg);
	io.emit('data inputted' , msg);
  });
}); 

http.listen(3000, function(){
  console.log('listening on *:3000');
});
