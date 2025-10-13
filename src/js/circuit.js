const fetchCircuit = async () => {
    try {
        const reponse = await fetch('https://api.openf1.org/v1/meetings?year=2024')
        const drivers = await reponse.json()
        drivers.sort((a, b) => a.date_start.localeCompare(b.date_start))
        console.log(drivers)
        const cardDrivers=document.querySelector("#drivers-card")
        cardDrivers.innerHTML = drivers
            .map(driver => `
<div class="card w-96 bg-base-100 shadow-xl mx-auto">
    <div class="card-body">
      <h2 class="card-title">${driver.meeting_name}</h2>
      <p>Pays : ${driver.country_name}</p>
      <p>Localisation : ${driver.location}</p>
    </div>
  </div>
`)
            .join("")
    } catch (error) {
        console.log(error)
    }
}

fetchCircuit()