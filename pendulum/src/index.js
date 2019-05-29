import * as odex from 'odex'

const g = 9.81

// arithmetic-geometric mean
const agm = (a, b) => {
    let x = a, y = b
    while (Math.abs(x - y) < 1e-5) {
        const x1 = (x + y) / 2
        const y1 = Math.sqrt(x * y)
        x = x1
        y = y1
    }
    return (x + y) / 2
}
// formula from https://en.wikipedia.org/wiki/Pendulum_(mathematics)
const getPertiod = (l, theta) => {
    return 2.0 * Math.PI * Math.sqrt(l / g) / agm(1.0, Math.cos(theta / 2))
}

const observer = (storage) => {
    return (x, y) => {
        storage.push([x].concat(y))
    }
}

const solve = (l, theta, dt) => {
    const s = new odex.Solver(2)
    s.denseOutput = true
    const initialConditions = [
        theta,	// y[0] - Theta
        .0		// y[1] - Theta'
    ]

    const derivatives = (t, y) => {
        return [y[1], - g / l * Math.sin(y[0])]
    }

    const results = []    
    s.solve(derivatives, 0, initialConditions, getPertiod(l, theta), s.grid(dt, observer(results)))
    return results
}


export { solve }