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

create or replace view vw_cities as
select countries.lang as lang, cities.name as city_name, states.name as state_name, countries.name as country_name, cities.id as city_id, states.id as state_id, countries.id as country_id 
from cities
inner join states on cities.state_id = states.id
inner join countries on states.country_id = countries.id;

create or replace view vw_users_tmp as select users.*, vw_cities.*, countries.name as nationality_name, genders.name as genders_name 
from users left join vw_cities on vw_cities.city_id = users.city 
left join countries on countries.id = users.nationality 
left join genders on users.gender = genders.id; 

create or replace view vw_positions as
SELECT positions.*, grounds.name as ground_name 
FROM positions 
inner join grounds on positions.ground_id = grounds.id and grounds.lang = positions.lang;

create or replace view vw_players as
select  *
from vw_users_tmp
left join players on vw_users_tmp.id = players.user_id
where vw_users_tmp.is_player = 1;


create or replace view vw_users as
SELECT vw_users_tmp.*, vw_players.alias as alias, vw_players.open_for_invites as open_for_invites, vw_players.looking_teams as looking_teams, TIMESTAMPDIFF(YEAR, vw_users_tmp.born, CURDATE()) AS age FROM vw_users_tmp 
left join vw_players on vw_players.user_id = vw_users_tmp.id ;

create or replace view vw_player_postions as
SELECT positions.*, player_positions.* FROM player_positions 
inner join positions on positions.id = player_positions.position_id
inner join vw_users on vw_users.id = player_positions.player_id;

create or replace view vw_player_ground_postions as
SELECT vw_player_postions.*, grounds.name as ground_name FROM vw_player_postions 
inner join grounds on grounds.id = vw_player_postions.ground_id;

