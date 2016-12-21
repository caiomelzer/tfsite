function solution(N, S){
	var airplane = {
		seats : [],
		seats_used : S.split(' ').sort(),
		chars : ['A','B','C','D','E','F','G','H','J','K'],
	};
	for(var row=1;row<=N;row++){
		airplane.seats.push(row+'A'+' '+row+'B'+' '+row+'C');
		airplane.seats.push(row+'D'+' '+row+'E'+' '+row+'F'+' '+row+'G');
		airplane.seats.push(row+'H'+' '+row+'J'+' '+row+'K');
	}
	for(var p=0; p<airplane.seats_used.length; p++){
		for(var lines=0; lines<airplane.seats.length; lines++){
			if(airplane.seats[lines].split(' ').length===3){
				if(airplane.seats[lines].indexOf(airplane.seats_used[p])>-1)
					airplane.seats.splice(lines, 1);
			}
			else{
				if(airplane.seats[lines].indexOf(airplane.seats_used[p])>-1 && airplane.seats[lines].split(' ')[0]!=airplane.seats_used[p] && airplane.seats[lines].split(' ')[airplane.seats[lines].split(' ').length]!=airplane.seats_used[p])
					airplane.seats.splice(lines, 1);
			}
		}
	}
	return airplane.seats.length;
}

console.log(solution(2, '1C 1A 2F'));
console.log(solution(4, '1A 2D 2H'));