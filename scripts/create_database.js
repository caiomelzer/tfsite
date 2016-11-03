/**
 * Created by barrett on 8/28/14.
 */

var mysql = require('mysql');
var dbconfig = require('../config/database');

var connection = mysql.createConnection(dbconfig.connection);

connection.query('CREATE DATABASE ' + dbconfig.database);

connection.query('\
CREATE TABLE `' + dbconfig.database + '`.`' + dbconfig.users_table + '` ( \
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `username` VARCHAR(20) NOT NULL, \
    `password` CHAR(60) NOT NULL, \
        PRIMARY KEY (`id`), \
    UNIQUE INDEX `id_UNIQUE` (`id` ASC), \
    UNIQUE INDEX `username_UNIQUE` (`username` ASC) \
)');

console.log('Success: Database Created!')

connection.end();

drop view vw_cities;
create view vw_cities as
select countries.lang as lang, cities.name as city_name, states.name as state_name, countries.name as country_name, cities.id as city_id, states.id as state_id, countries.id as country_id 
from cities
inner join states on cities.state_id = states.id
inner join countries on states.country_id = countries.id;

drop view vw_users;
create view vw_users as select users.*, vw_cities.*, countries.name as nationality_name, genders.name as genders_name from users left join vw_cities on vw_cities.city_id = users.city left join countries on countries.id = users.nationality left join genders on users.gender = genders.id left join players on users.id = players.user_id inner join grounds on grounds.id = players.ground inner join positions on positions.ground_id = grounds.id


drop view vw_players;
create view vw_players as
select vw_users.*, players.*, positions.name as position_name, grounds.name as ground_name
from vw_users
left join players on vw_users.id = players.user_id
inner join grounds on grounds.id = players.ground
inner join positions on positions.ground_id = grounds.id 
where vw_users.is_player = 1;

SELECT * FROM vw_users left join vw_players on players.user_id = vw_users.id WHERE id = ? AND lang = ?







	jogador_idPrimary	int(11)			No	None	AUTO_INCREMENT	Change Change	Drop Drop	
More
	2	associado_idIndex	int(11)			No	None		Change Change	Drop Drop	
More
	3	apelido	varchar(255)			No	None		Change Change	Drop Drop	
More
	4	foto	varchar(255)			No	None		Change Change	Drop Drop	
More
	5	DtCadastro	timestamp		on update CURRENT_TIMESTAMP	No	CURRENT_TIMESTAMP	ON UPDATE CURRENT_TIMESTAMP	Change Change	Drop Drop	
More
	6	TipoFutebol_idIndex	int(11)			Yes	NULL		Change Change	Drop Drop	
More
	7	ProcurandoTime	tinyint(1)			No	0		Change Change	Drop Drop	
More
	8	AceitaConviteparaJogar	tinyint(1)			No	0		Change Change	Drop Drop	
More
	9	TamanhoTenis	int(11)			Yes	NULL		Change Change	Drop Drop	
Mo
	10	TamanhoCamisa	char(3)			Yes	M		Change Change	Drop Drop	
More
	11	TamanhoCalcao	char(3)			Yes	M		Change Change	Drop Drop	
More
	12	TamanhoCalcaAlt	int(2)			Yes	NULL		Change Change	Drop Drop	
More
	13	TamanhoCalcaLarg