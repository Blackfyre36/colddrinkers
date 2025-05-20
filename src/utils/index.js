export const statusLevels = {
    low: {
        color: "#047857",
        background: "#d1fae5",
        description: 'Caffeine levels are mild, resulting in a light boost in alertness with minimal side effects.',
        maxLevel: 100
    },
    moderate: {
        color: "#b45309",
        background: "#fef3c7",
        description: 'A moderate amount of caffeine leads to noticeable stimulation, increased focus, and potential restlessness.',
        maxLevel: 200
    },
    high: {
        color: "#e11d48",
        background: "#ffe4e6",
        description: 'Elevated caffeine levels can cause jitteriness, rapid heartbeat, and trouble concentrating, signaling an excessive intake.',
        maxLevel: 9999
    },
}

export const coldDrinkConsumptionHistory = {
    "1727579064032": { "name": "Cold Brew (16oz)", "cost": 4.85 },
    "1727629263026": { "name": "Rockstar Energy (16oz)", "cost": 6.78 },
    "1727571485301": { "name": "Monster Energy (16oz)", "cost": 5.50 },
    "1727585485245": { "name": "Coca-Cola (12oz)", "cost": 2.00 },
    "1727614392214": { "name": "Iced Latte", "cost": 4.25 },
    "1727642088808": { "name": "Red Bull (8.4oz)", "cost": 3.99 },
    "1727649088801": { "name": "Mountain Dew (12oz)", "cost": 2.15 },
    "1727653088802": { "name": "Iced Mocha", "cost": 4.65 },
    "1727657088803": { "name": "Pepsi Max (12oz)", "cost": 1.85 },
    "1727661088804": { "name": "Starbucks Doubleshot Espresso", "cost": 3.50 },
}

export const coldDrinkOptions = [
    { "name": "Cold Brew (16oz)", "caffeine": 200 },
    { "name": "Rockstar Energy (16oz)", "caffeine": 160 },
    { "name": "Monster Energy (16oz)", "caffeine": 160 },
    { "name": "Coca-Cola (12oz)", "caffeine": 34 },
    { "name": "Iced Latte", "caffeine": 80 },
    { "name": "Red Bull (8.4oz)", "caffeine": 80 },
    { "name": "Mountain Dew (12oz)", "caffeine": 54 },
    { "name": "Iced Mocha", "caffeine": 90 },
    { "name": "Pepsi Max (12oz)", "caffeine": 69 },
    { "name": "Starbucks Doubleshot Espresso", "caffeine": 120 },
]

const halfLifeHours = 5

export function calculateCurrentCaffeineLevel(historyData) {
    const currentTime = Date.now()
    const halfLife = halfLifeHours * 60 * 60 * 1000
    const maxAge = 48 * 60 * 60 * 1000

    let totalCaffeine = 0

    for (const [timestamp, entry] of Object.entries(historyData)) {
        const timeElapsed = currentTime - parseInt(timestamp)
        if (timeElapsed <= maxAge) {
            const caffeineInitial = getCaffeineAmount(entry.name)
            const remainingCaffeine = caffeineInitial * Math.pow(0.5, timeElapsed / halfLife)
            totalCaffeine += remainingCaffeine
        }
    }

    return totalCaffeine.toFixed(2)
}

export function getCaffeineAmount(drinkName) {
    const drink = coldDrinkOptions.find(c => c.name === drinkName)
    return drink ? drink.caffeine : 0
}

export function getTopThreeColdDrinks(historyData) {
    const drinkCount = {}

    for (const entry of Object.values(historyData)) {
        const drinkName = entry.name
        if (drinkCount[drinkName]) {
            drinkCount[drinkName]++
        } else {
            drinkCount[drinkName] = 1
        }
    }

    const sortedDrinks = Object.entries(drinkCount).sort((a, b) => b[1] - a[1])
    const totalDrinks = Object.values(drinkCount).reduce((sum, count) => sum + count, 0)

    return sortedDrinks.slice(0, 3).map(([drinkName, count]) => {
        const percentage = ((count / totalDrinks) * 100).toFixed(2)
        return {
            drinkName: drinkName,
            count: count,
            percentage: percentage + '%'
        }
    })
}

export function timeSinceConsumption(utcMilliseconds) {
    const now = Date.now()
    const diff = now - utcMilliseconds

    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const months = Math.floor(days / 30)

    const remainingDays = days % 30
    const remainingHours = hours % 24
    const remainingMinutes = minutes % 60
    const remainingSeconds = seconds % 60

    let result = ''
    if (months > 0) result += `${months}M `
    if (remainingDays > 0) result += `${remainingDays}D `
    if (remainingHours > 0) result += `${remainingHours}H `
    if (remainingMinutes > 0) result += `${remainingMinutes}M `
    if (remainingSeconds > 0 || result === '') result += `${remainingSeconds}S`
    return result.trim()
}

export function calculateColdDrinkStats(history) {
    const dailyStats = {}
    let totalDrinks = 0
    let totalCost = 0
    let totalCaffeine = 0
    let totalDaysWithDrinks = 0

    for (const [timestamp, drink] of Object.entries(history)) {
        const date = new Date(parseInt(timestamp)).toISOString().split('T')[0]
        const caffeine = getCaffeineAmount(drink.name)
        const cost = parseFloat(drink.cost)

        if (!dailyStats[date]) {
            dailyStats[date] = { caffeine: 0, cost: 0, count: 0 }
        }

        dailyStats[date].caffeine += caffeine
        dailyStats[date].cost += cost
        dailyStats[date].count += 1

        totalDrinks += 1
        totalCost += cost
    }

    const days = Object.keys(dailyStats).length
    for (const stats of Object.values(dailyStats)) {
        if (stats.caffeine > 0) {
            totalCaffeine += stats.caffeine
            totalDaysWithDrinks += 1
        }
    }

    const avgDailyCaffeine = totalDaysWithDrinks > 0 ? (totalCaffeine / totalDaysWithDrinks).toFixed(2) : 0
    const avgDailyCost = totalDaysWithDrinks > 0 ? (totalCost / totalDaysWithDrinks).toFixed(2) : 0

    return {
        daily_caffeine: avgDailyCaffeine,
        daily_cost: avgDailyCost,
        average_drinks: (totalDrinks / days).toFixed(2),
        total_cost: totalCost.toFixed(2),
    };
}




