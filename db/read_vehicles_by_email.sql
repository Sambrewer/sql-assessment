select * from vehicles
join users on users.id = vehicles.ownerid
where users.email = $1;
