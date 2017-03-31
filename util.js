// module shared.js
var func = {
	teste: function(){
		console.log('teste');
	},
	toNestedJSON: function(o){
		console.log('teste');
		if(!o.j) return false;
		if(!o.l) return false;
		if(!o.f) return false;
		var ob1 = [];
		var ob2 = [];
		console.log(o.j);
		for(var i=0; i<o.j.length; i++){
			console.log('length: ',i);
			var x = 0;
			for (var j=0; j<o.j.length; j++){
				if(o.j[j].ground == o.j[i].ground_name){
					x=0;
				}
				else{
					x++;
				}
				if(x==j){
					o.j[j].ground
				}
			}
		}
		console.log(ob1.filter(function(ob1){ return ob1.ground == 'a' }));
		console.log(ob1);
		return 'hi';
	}

}


module.exports = func;