"use strict";
const M = require("./monty.js");
let pass = true;
function check(n, c, d) { console.log(`${c ? "PASS" : "FAIL"}  ${n}  ${d || ""}`); if (!c) pass = false; }

// T1: host never opens the car or the picked door; switch target is the remaining door
{
  const rng = M.mulberry(3);
  let ok = true;
  for (let i = 0; i < 5000; i++) {
    const picked = Math.floor(rng() * 3);
    const r = M.playRound(rng, picked, true);
    if (r.opened === r.car || r.opened === picked) ok = false;
    if (r.finalPick === picked || r.finalPick === r.opened) ok = false;
    if (!ok) break;
  }
  check("T1 host rules", ok, "5000 rounds");
}

// T2: switch wins ~2/3, stay wins ~1/3
{
  const s1 = M.simulate(M.mulberry(7), 100000, true);
  const s2 = M.simulate(M.mulberry(11), 100000, false);
  check("T2 asymptotics", Math.abs(s1.rate - 2 / 3) < 0.01 && Math.abs(s2.rate - 1 / 3) < 0.01,
    `switch=${(s1.rate * 100).toFixed(1)}% stay=${(s2.rate * 100).toFixed(1)}%`);
}

// T3: determinism with same seed
{
  const a = M.simulate(M.mulberry(21), 1000, true);
  const b = M.simulate(M.mulberry(21), 1000, true);
  check("T3 determinism", a.wins === b.wins, `${a.wins}`);
}

console.log(pass ? "\nMONTY CORE PASS" : "\nMONTY CORE FAIL");
process.exit(pass ? 0 : 1);
