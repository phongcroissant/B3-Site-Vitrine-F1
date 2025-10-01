  const fetchDrivers = async () => {
    try {
        const reponse = await fetch('https://api.jolpi.ca/ergast/f1/current/driverStandings.json')
        const driverStanding = await reponse.json()
        console.log(driverStanding)
        const cardDrivers=document.querySelector("#drivers-card")
        cardDrivers.innerHTML = driverStanding.MRData.StandingsTable.StandingsLists[0].DriverStandings
            .map(driver => `
              
              `)
        
    } catch (error) {
        console.log(error)
    }
}

fetchDrivers()