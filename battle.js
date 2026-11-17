/* Core battle rules. Kept independent from the DOM so the engine can be tested. */

export const playerTemplate = {
  name: 'Charizard', types: ['Fire', 'Flying'], maxhp: 120, hp: 120,
  attack: 84, defence: 78, specialAttack: 109, specialDefence: 85, speed: 100,
  moves: [
    { name: 'Flamethrower', type: 'Fire', category: 'Special', power: 90, accuracy: 1, maxPp: 15 },
    { name: 'Dragon Claw', type: 'Dragon', category: 'Physical', power: 80, accuracy: 1, maxPp: 15 },
    { name: 'Air Slash', type: 'Flying', category: 'Special', power: 75, accuracy: 0.95, maxPp: 15 },
    { name: 'Roost', type: 'Flying', category: 'Status', power: 0, accuracy: 1, maxPp: 10, effect: { type: 'heal', fraction: 0.5 } }
  ]
};

export const opponentTemplate = {
  name: 'Blastoise', types: ['Water'], maxhp: 130, hp: 130,
  attack: 83, defence: 100, specialAttack: 85, specialDefence: 105, speed: 78,
  moves: [
    { name: 'Hydro Pump', type: 'Water', category: 'Special', power: 110, accuracy: 0.8, maxPp: 5 },
    { name: 'Surf', type: 'Water', category: 'Special', power: 90, accuracy: 1, maxPp: 15 },
    { name: 'Bite', type: 'Dark', category: 'Physical', power: 60, accuracy: 1, maxPp: 25 },
    { name: 'Withdraw', type: 'Water', category: 'Status', power: 0, accuracy: 1, maxPp: 40, effect: { type: 'stat', stat: 'defence', stages: 1 } }
  ]
};

const STAGE_KEYS = ['attack', 'defence', 'specialAttack', 'specialDefence', 'speed'];
const TYPE_CHART = {
  Fire: { Fire: 0.5, Water: 0.5, Grass: 2, Ice: 2, Bug: 2, Steel: 2, Rock: 0.5, Dragon: 0.5 },
  Water: { Fire: 2, Water: 0.5, Grass: 0.5, Ground: 2, Rock: 2, Dragon: 0.5 },
  Flying: { Grass: 2, Fighting: 2, Bug: 2, Electric: 0.5, Rock: 0.5, Steel: 0.5 },
  Dragon: { Dragon: 2, Steel: 0.5 },
  Dark: { Psychic: 2, Ghost: 2, Fighting: 0.5, Dark: 0.5, Fairy: 0.5 }
};

function cloneCombatant(template) {
  return {
    ...template, types: [...template.types],
    moves: template.moves.map((move) => ({ ...move, pp: move.maxPp, effect: move.effect ? { ...move.effect } : undefined })),
    stages: Object.fromEntries(STAGE_KEYS.map((key) => [key, 0]))
  };
}

export function createInitialBattle() {
  return { player: cloneCombatant(playerTemplate), opponent: cloneCombatant(opponentTemplate), status: 'playing', turn: 1 };
}

export function getTypeEffectiveness(moveType, targetTypes) {
  const matchups = TYPE_CHART[moveType] || {};
  return targetTypes.reduce((multiplier, targetType) => multiplier * (matchups[targetType] ?? 1), 1);
}

export function getModifiedStat(combatant, stat) {
  const base = combatant[stat];
  const stage = combatant.stages?.[stat] ?? 0;
  const multiplier = stage >= 0 ? (2 + stage) / 2 : 2 / (2 - stage);
  return Math.max(1, Math.floor(base * multiplier));
}

export function calculateDamage(attacker, defender, move, random = Math.random) {
  if (move.power <= 0 || move.category === 'Status') return 0;
  const attackStat = move.category === 'Physical' ? 'attack' : 'specialAttack';
  const defenceStat = move.category === 'Physical' ? 'defence' : 'specialDefence';
  const attack = getModifiedStat(attacker, attackStat);
  const defence = getModifiedStat(defender, defenceStat);
  const base = Math.floor(((((2 * 50) / 5 + 2) * move.power * attack) / defence) / 50) + 2;
  const stab = attacker.types.includes(move.type) ? 1.5 : 1;
  const effectiveness = getTypeEffectiveness(move.type, defender.types);
  if (effectiveness === 0) return 0;
  const randomFactor = 0.85 + Math.min(0.999999, Math.max(0, random())) * 0.15;
  return Math.max(1, Math.floor(base * stab * effectiveness * randomFactor));
}

export function getTurnOrder(battle) {
  return battle.player.speed >= battle.opponent.speed ? ['player', 'opponent'] : ['opponent', 'player'];
}

export function chooseCpuMove(user, target, random = Math.random) {
  const choices = user.moves.map((move, index) => ({ move, index })).filter(({ move }) => move.pp > 0);
  if (!choices.length) return -1;
  const scored = choices.map(({ move, index }) => {
    let score;
    if (move.effect?.type === 'heal') {
      const missingRatio = (user.maxhp - user.hp) / user.maxhp;
      score = missingRatio >= 0.45 ? 100 * missingRatio : -5;
    } else if (move.effect?.type === 'stat') {
      const currentStage = user.stages[move.effect.stat] ?? 0;
      score = currentStage < 2 ? 22 - currentStage * 5 : -5;
    } else {
      score = move.power * move.accuracy * getTypeEffectiveness(move.type, target.types) * (user.types.includes(move.type) ? 1.5 : 1);
    }
    return { index, score };
  });
  const bestScore = Math.max(...scored.map((entry) => entry.score));
  const bestChoices = scored.filter((entry) => entry.score === bestScore);
  return bestChoices[Math.floor(Math.min(0.999999, Math.max(0, random())) * bestChoices.length)].index;
}

export function applyMove(battle, actor, moveIndex, random = Math.random) {
  if (battle.status !== 'playing') return { messages: [], ended: true };
  if (actor !== 'player' && actor !== 'opponent') throw new Error(`Unknown battle actor: ${actor}`);
  const user = battle[actor];
  const target = battle[actor === 'player' ? 'opponent' : 'player'];
  const move = user.moves[moveIndex];
  if (!move || move.pp <= 0) return { messages: [`${user.name} cannot use that move.`], ended: false };
  move.pp -= 1;
  const messages = [`${user.name} used ${move.name}!`];
  if (random() >= move.accuracy) {
    messages.push(`${user.name}'s ${move.name} missed!`);
    return { messages, ended: false };
  }
  if (move.effect?.type === 'heal') {
    const amount = Math.min(user.maxhp - user.hp, Math.floor(user.maxhp * move.effect.fraction));
    user.hp += amount;
    messages.push(amount > 0 ? `${user.name} restored ${amount} HP!` : `${user.name} is already at full HP.`);
  } else if (move.effect?.type === 'stat') {
    const stat = move.effect.stat;
    const before = user.stages[stat] ?? 0;
    const after = Math.max(-6, Math.min(6, before + move.effect.stages));
    user.stages[stat] = after;
    messages.push(after === before ? `${user.name}'s ${stat} cannot go any higher!` : `${user.name}'s ${stat} rose!`);
  } else {
    const effectiveness = getTypeEffectiveness(move.type, target.types);
    if (effectiveness === 0) messages.push(`It had no effect on ${target.name}.`);
    else {
      const damage = calculateDamage(user, target, move, random);
      target.hp = Math.max(0, target.hp - damage);
      messages.push(`${target.name} took ${damage} damage!`);
      if (effectiveness > 1) messages.push("It's super effective!");
      if (effectiveness < 1) messages.push("It's not very effective...");
    }
  }
  if (target.hp <= 0) {
    messages.push(`${target.name} fainted!`);
    battle.status = actor === 'player' ? 'playerWon' : 'opponentWon';
    messages.push(actor === 'player' ? 'You won the battle!' : 'You were defeated.');
  }
  return { messages, ended: battle.status !== 'playing' };
}