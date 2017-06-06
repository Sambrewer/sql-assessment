select vehicles.make, vehicles.model, vehicles.year, users.firstname, users.lastname from vehicles
join users on users.id = vehicles.ownerid
where year > 2000
order by year desc
