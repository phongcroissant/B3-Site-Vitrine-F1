  const fetchDrivers = async () => {
    try {
        const reponse = await fetch('https://api.jolpi.ca/ergast/f1/current/driverStandings.json')
        const driverStanding = await reponse.json()
        console.log(driverStanding)
        
    } catch (error) {
        console.log(error)
    }
}

fetchDrivers()