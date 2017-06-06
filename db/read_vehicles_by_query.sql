select * from vehicles
join users on users.id = vehicles.ownerid
where firstname like $1;
