const fetchDriverStanding = async () => {
  try {
    const reponse = await fetch('https://api.jolpi.ca/ergast/f1/current/driverStandings.json')
    const driverStanding = await reponse.json()
    console.log(driverStanding)
    const driverTable = document.querySelector("#drivers-standing")
    driverTable.innerHTML = driverStanding.MRData.StandingsTable.StandingsLists[0].DriverStandings
      .map(driver => `
      <div class="flex flex-col sm:flex-row items-center justify-between bg-white/80 backdrop-blur-md border border-gray-200 shadow-md rounded-2xl p-4 mb-4 hover:scale-[1.02] transition-transform duration-200 w-full max-w-2xl mx-auto">
        <div class="text-center sm:text-left">
          <h3 class="text-lg font-semibold text-gray-800">
            ${driver.position}. ${driver.Driver.givenName} ${driver.Driver.familyName}
          </h3>
          <p class="text-sm text-gray-600"><span class="font-medium">Écurie :</span> ${driver.Constructors[0].name}</p>
        </div>
        <div class="text-center sm:text-right mt-3 sm:mt-0">
          <p class="text-2xl font-bold text-red-600">${driver.points}</p>
          <p class="text-xs uppercase text-gray-500">points</p>
        </div>
      </div>
`)
      .join('')
  } catch (error) {
    console.log(error)
  }
}

fetchDriverStanding()