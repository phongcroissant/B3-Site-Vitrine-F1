const fetchResultatRace = async () => {
    try {
        console.log(round)
        const reponse = await fetch(`https://api.jolpi.ca/ergast/f1/2025/${round}/results/`)
        const raceResult = await reponse.json()

        console.log(raceResult)
        
        const raceStanding = document.querySelector("#table-body")
        const titleRace = document.querySelector('#title-race')
        
        titleRace.innerHTML = raceResult.MRData.RaceTable.Races.map(titleRace => `${titleRace.raceName}`)
        raceStanding.innerHTML = raceResult.MRData.RaceTable.Races[0].Results
            .map(raceStanding => `
        <td class="px-4 py-4 whitespace-nowrap text-sm font-semibold">
          <span class="inline-flex items-center gap-2">
            <span class="inline-flex h-7 w-7 items-center justify-center text-sm font-bold text-black">${raceStanding.position}</span>
          </span>
        </td>
          <td class="px-4 py-4 whitespace-nowrap">
            <div class="flex items-center gap-3">
              <div>
                <div class="text-sm font-medium text-gray-900">${raceStanding.Driver.givenName} ${raceStanding.Driver.familyName}</div>
                <div class="text-xs text-gray-500">${raceStanding.Driver.code} | ${raceStanding.Driver.permanentNumber}</div>
              </div>
            </div>
        </td>
          <td class="px-4 py-4 whitespace-nowrap text-center text-sm text-gray-900">${raceStanding.Constructor.name}</td>
          <td class="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-500">${raceStanding.points}</td>
          <td class="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-500">${raceStanding.status}</td>
        </tr>
        `)
            .join('');
    } catch (error) {
        console.log(error)
    }
}
const urlParams = new URLSearchParams(window.location.search)
const round = urlParams.get('round')
fetchResultatRace()