const fetchRaces = async () => {
  try {
    const reponse = await fetch('https://api.jolpi.ca/ergast/f1/current/')
    const races = await reponse.json()
    console.log(races)
    const cardRace = document.querySelector("#race-card")
    cardRace.innerHTML = races.MRData.RaceTable.Races
      .map(race => `
    <div class="card w-96 bg-base-100 shadow-xl mx-auto" data-round="${race.round}" id="race">
      <div class="card-body">
        <h2 class="card-title">${race.raceName}</h2>
        <p>Pays : ${race.Circuit.Location.country}</p>
        <p>Localisation : ${race.Circuit.Location.locality}</p>
        <a href='/src/pages/resultatRace.html?round=${race.round}'>Resultat</a>
      </div>
    </div>
    `)
      .join("")
      

  } catch (error) {
    console.log(error)
  }
}

fetchRaces()

