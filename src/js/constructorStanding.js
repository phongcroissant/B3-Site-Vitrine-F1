  const fetchDrivers = async () => {
    try {
        const reponse = await fetch('https://api.jolpi.ca/ergast/f1/current/constructorStandings.json')
        const constructorStanding= await reponse.json()
        console.log(constructorStanding)
        const constructorTable=document.querySelector("#constructors-standing")
        constructorTable.innerHTML = constructorStanding.MRData.StandingsTable.StandingsLists[0].ConstructorStandings
        .map(constructor => `
    <div class="flex items-center justify-between bg-white/80 backdrop-blur-md border border-gray-200 shadow-md rounded-2xl p-4 mb-3 hover:scale-[1.02] transition-transform duration-200">
      <div>
        <h3 class="text-lg font-semibold text-gray-800">
          ${constructor.position}. ${constructor.Constructor.name}
        </h3>
      </div>
      <div class="text-right">
        <p class="text-2xl font-bold text-red-600">${constructor.points}</p>
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