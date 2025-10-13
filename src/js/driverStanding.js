  const fetchDrivers = async () => {
    try {
        const reponse = await fetch('https://api.jolpi.ca/ergast/f1/current/driverStandings.json')
        const driverStanding = await reponse.json()
        console.log(driverStanding)
        const driverTable=document.querySelector("#drivers-standing")
        driverTable.innerHTML = driverStanding.MRData.StandingsTable.StandingsLists[0].DriverStandings
            .map(driver => `
    <div class="flex items-center justify-between bg-white/80 backdrop-blur-md border border-gray-200 shadow-md rounded-2xl p-4 mb-3 hover:scale-[1.02] transition-transform duration-200">
      <div>
        <h3 class="text-lg font-semibold text-gray-800">
          ${driver.position}. ${driver.Driver.givenName} ${driver.Driver.familyName}
        </h3>
        <p class="text-sm text-gray-600"><span class="font-medium">Écurie :</span> ${driver.Constructors[0].name}</p>
        <p class="text-sm text-gray-600"><span class="font-medium">Nationalité :</span> ${driver.Driver.nationality}</p>
      </div>
      <div class="text-right">
        <p class="text-2xl font-bold text-red-600">${driver.points}</p>
        <p class="text-xs uppercase text-gray-500">points</p>
      </div>
    </div>
  `)
  .join('');
        
    } catch (error) {
        console.log(error)
    }
}

fetchDrivers()