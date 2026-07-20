"use strict";
// monty core: one round of Monty Hall + batch simulation. Shared with tests.
(function (root) {
  function mulberry(seed) { let a = seed >>> 0;
    return function () { a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

  // returns {car, picked, opened, finalPick, win}
  function playRound(rng, picked, doSwitch) {
    const car = Math.floor(rng() * 3);
    // host opens a goat door that is neither picked nor the car
    const options = [0, 1, 2].filter(d => d !== picked && d !== car);
    const opened = options[Math.floor(rng() * options.length)];
    const finalPick = doSwitch ? [0, 1, 2].find(d => d !== picked && d !== opened) : picked;
    return { car, picked, opened, finalPick, win: finalPick === car };
  }

  function simulate(rng, n, doSwitch) {
    let wins = 0;
    const trail = [];
    for (let i = 0; i < n; i++) {
      const r = playRound(rng, Math.floor(rng() * 3), doSwitch);
      if (r.win) wins++;
      trail.push(wins / (i + 1));
    }
    return { wins, n, rate: wins / n, trail };
  }

  const api = { mulberry, playRound, simulate };
  if (typeof module !== 'undefined') module.exports = api;
  else root.MONTY = api;
})(typeof window !== 'undefined' ? window : globalThis);
