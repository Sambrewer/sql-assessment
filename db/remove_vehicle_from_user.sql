update vehicles
  set ownerid = null
  where id = $2 and ownerid = $1
