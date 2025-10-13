const fetchDrivers = async () => {
  try {
    const reponse = await fetch('https://api.openf1.org/v1/drivers?session_key=latest')
    const drivers = await reponse.json()
    drivers.sort((a, b) => a.team_name.localeCompare(b.team_name))
    const cardDrivers = document.querySelector("#drivers-card")
    cardDrivers.innerHTML = drivers
      .map(driver => `
    <div class="card w-96 bg-base-100 shadow-xl mx-auto">
      <figure><img src="${driver.headshot_url}" alt="${driver.name_acronym}" /></figure>
      <div class="card-body">
        <h2 class="card-title">${driver.full_name}</h2>
        <p>Écurie : ${driver.team_name}</p>
        <p>Numéro : ${driver.driver_number}</p>
      </div>
    </div>
`)
      .join("")
  } catch (error) {
    console.log(error)
  }
}

fetchDrivers()