
/* Simple battle engine with controller & keyboard support */
const playerTemplate = {
  name: 'Charizard', maxhp: 120, hp: 120, atk: 84, def: 78, spd: 100,
  moves: [
    {name: 'Flamethrower', power: 90, acc: 1.0},
    {name: 'Dragon Claw', power: 80, acc: 1.0},
    {name: 'Air Slash', power: 75, acc: 0.95},
    {name: 'Roost', power: 0, curative:true}
  ]
};

const opponentTemplate = {
  name: 'Blastoise', maxhp: 130, hp: 130, atk: 83, def: 100, spd: 78,
  moves: [
    {name: 'Hydro Pump', power: 110, acc: 0.9},
    {name: 'Surf', power: 90, acc: 1.0},
    {name: 'Bite', power: 60, acc: 1.0},
    {name: 'Withdraw', power: 0, curative:true}
  ]
};

let player = JSON.parse(JSON.stringify(playerTemplate));
let opponent = JSON.parse(JSON.stringify(opponentTemplate));
let selectedMoveIndex = 0;
let inputLocked = false;
const logEl = document.getElementById('log');

function log(text){
  const p = document.createElement('div');
  p.textContent = text;
  logEl.prepend(p);
}

// init UI
function setStatus(){
  document.getElementById('pl-name').textContent = player.name;
  document.getElementById('pl-hp').textContent = player.hp;
  document.getElementById('pl-maxhp').textContent = player.maxhp;
  document.getElementById('pl-hpbar').value = player.hp;
  document.getElementById('pl-hpbar').max = player.maxhp;

  document.getElementById('op-name').textContent = opponent.name;
  document.getElementById('op-hp').textContent = opponent.hp;
  document.getElementById('op-maxhp').textContent = opponent.maxhp;
  document.getElementById('op-hpbar').value = opponent.hp;
  document.getElementById('op-hpbar').max = opponent.maxhp;
}

function createMoves(){
  const movesDiv = document.getElementById('moves');
  movesDiv.innerHTML = '';
  player.moves.forEach((m, i) => {
    const btn = document.createElement('button');
    btn.className = 'move-btn';
    btn.setAttribute('role','option');
    btn.setAttribute('aria-selected', i === selectedMoveIndex ? 'true' : 'false');
    btn.dataset.index = i;
    btn.innerHTML = `<div><strong>${m.name}</strong></div><div>${m.power ? m.power+' power' : (m.curative ? 'status' : '')}</div>`;
    btn.addEventListener('click', () => {
      if(inputLocked) return;
      selectedMoveIndex = i;
      updateMoveSelection();
      playerChooseMove();
    });
    btn.addEventListener('focus', ()=> { selectedMoveIndex = i; updateMoveSelection(); });
    movesDiv.appendChild(btn);
  });
  updateMoveSelection();
}

function updateMoveSelection(){
  document.querySelectorAll('.move-btn').forEach(btn => {
    btn.setAttribute('aria-selected', btn.dataset.index == selectedMoveIndex ? 'true' : 'false');
  });
}

function calcDamage(att, def, power){
  if(power === 0) return 0;
  const level = 50;
  const base = Math.floor(((((2*level)/5 + 2) * power * att)/def)/50) + 2;
  const modifier = (Math.random() * 0.15) + 0.85;
  return Math.max(1, Math.floor(base * modifier));
}

function cpuChooseMove(){
  // simple AI: random
  const i = Math.floor(Math.random()*opponent.moves.length);
  return i;
}

async function playerChooseMove(){
  if(inputLocked) return;
  inputLocked = true;
  const move = player.moves[selectedMoveIndex];
  log(`${player.name} used ${move.name}!`);
  await performTurn({actor:'player', moveIndex:selectedMoveIndex});
  inputLocked = false;
}

async function performTurn({actor, moveIndex}){
  // determine order by speed
  let pFirst = player.spd >= opponent.spd ? 'player' : 'opponent';
  if(actor === 'opponent') pFirst = opponent.spd >= player.spd ? 'opponent' : 'player';

  const movesThisTurn = [];
  movesThisTurn.push({who: pFirst, moveIndex: pFirst === 'player' ? moveIndex : cpuChooseMove()});
  const other = pFirst === 'player' ? 'opponent' : 'player';
  movesThisTurn.push({who: other, moveIndex: other === 'player' ? moveIndex : cpuChooseMove()});

  for(const m of movesThisTurn){
    const who = m.who;
    const moveIdx = m.moveIndex;
    const user = who === 'player' ? player : opponent;
    const target = who === 'player' ? opponent : player;
    const move = user.moves[moveIdx];

    await sleep(500);
    if(move.curative){
      // simple heal / increase def
      const heal = Math.min(user.maxhp - user.hp, Math.floor(user.maxhp * 0.25));
      user.hp += heal;
      setStatus();
      log(`${user.name} healed ${heal} HP!`);
    } else {
      // check accuracy
      if(Math.random() > (move.acc || 1)){
        log(`${user.name}'s ${move.name} missed!`);
      } else {
        const damage = calcDamage(user.atk, target.def, move.power);
        target.hp = Math.max(0, target.hp - damage);
        setStatus();
        log(`${target.name} took ${damage} points!`);
      }
    }

    // check faint
    if(target.hp <= 0){
      log(`${target.name} fainted!`);
      inputLocked = true;
      return;
    }
  }
}

function sleep(ms){ return new Promise(res=>setTimeout(res, ms)); }

// simple keyboard navigation
document.addEventListener('keydown', (e)=>{
  if(e.key === 'ArrowDown' || e.key === 'ArrowRight'){
    selectedMoveIndex = (selectedMoveIndex + 1) % player.moves.length;
    updateMoveSelection();
    document.querySelector('.move-btn[aria-selected="true"]').focus();
  } else if(e.key === 'ArrowUp' || e.key === 'ArrowLeft'){
    selectedMoveIndex = (selectedMoveIndex - 1 + player.moves.length) % player.moves.length;
    updateMoveSelection();
    document.querySelector('.move-btn[aria-selected="true"]').focus();
  } else if(e.key === 'Enter' || e.key === ' '){
    playerChooseMove();
  }
});

// buttons
document.getElementById('btn-reset').addEventListener('click', ()=>{
  player = JSON.parse(JSON.stringify(playerTemplate));
  opponent = JSON.parse(JSON.stringify(opponentTemplate));
  setStatus(); createMoves(); log('Battle reset.');
  inputLocked = false;
});

document.getElementById('btn-next').addEventListener('click', ()=>{
  // quick CPU turn for testing
  if(inputLocked) return;
  inputLocked = true;
  (async ()=>{
    const idx = cpuChooseMove();
    log(`${opponent.name} used ${opponent.moves[idx].name}!`);
    await performTurn({actor:'opponent', moveIndex: idx});
    inputLocked = false;
  })();
});

// gamepad support
let gpState = {buttons:[], axes:[]};
function pollGamepads(){
  const gps = navigator.getGamepads ? navigator.getGamepads() : [];
  for(const gp of gps){
    if(!gp) continue;
    // simple mapping: dpad buttons 12-15, buttons[0] = A, 1=B
    if(gp.buttons[12] && gp.buttons[12].pressed) { // up
      selectedMoveIndex = (selectedMoveIndex - 1 + player.moves.length) % player.moves.length;
      updateMoveSelection();
      document.querySelector('.move-btn[aria-selected="true"]').focus();
    }
    if(gp.buttons[13] && gp.buttons[13].pressed) { // down
      selectedMoveIndex = (selectedMoveIndex + 1) % player.moves.length;
      updateMoveSelection();
      document.querySelector('.move-btn[aria-selected="true"]').focus();
    }
    if(gp.buttons[0] && gp.buttons[0].pressed){ // A
      playerChooseMove();
    }
    // B cancels - no-op for now
  }
  requestAnimationFrame(pollGamepads);
}

// initialize
setStatus();
createMoves();
log('A wild battle started!');
requestAnimationFrame(pollGamepads);
