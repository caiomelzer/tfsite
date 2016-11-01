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
select cities.name as city_name, states.name as state_name, countries.name as country_name, cities.id as city_id, states.id as state_id, countries.id as country_id from cities
inner join states on cities.state_id = states.id
inner join countries on states.country_id = countries.id;

drop view vw_users;
create view vw_users as
select users.*, vw_cities.*, countries.name as nationality_name, genders.name as genders_name from users
left join vw_cities on vw_cities.city_id = users.city
left join countries on countries.id = users.nationality
left join genders on users.gender = genders.id;