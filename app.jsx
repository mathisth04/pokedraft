import React, { useState, useEffect, useRef } from 'react';
import { Settings, RefreshCw, Home, RotateCcw, Swords, User, Users } from 'lucide-react';

const REGIONS = [
  { name: 'Kanto', range: [1, 151] }, { name: 'Johto', range: [152, 251] },
  { name: 'Hoenn', range: [252, 386] }, { name: 'Sinnoh', range: [387, 493] },
  { name: 'Unys', range: [494, 649] }, { name: 'Kalos', range: [650, 721] },
  { name: 'Alola', range: [722, 809] }, { name: 'Galar', range: [810, 898] },
  { name: 'Paldea', range: [906, 1025] }
];

const TYPES = {
  Feu: 'fire', Eau: 'water', Plante: 'grass', Électrik: 'electric',
  Glace: 'ice', Normal: 'normal', Combat: 'fighting', Poison: 'poison',
  Sol: 'ground', Vol: 'flying', Psy: 'psychic', Insecte: 'bug',
  Roche: 'rock', Spectre: 'ghost', Dragon: 'dragon', Ténèbres: 'dark',
  Acier: 'steel', Fée: 'fairy'
};

const DIFFICULTIES = {
  easy: { label: 'Easy', baseWinRate: 80 },
  normal: { label: 'Normal', baseWinRate: 65 },
  hard: { label: 'Hard', baseWinRate: 50 }
};

const LEGENDARIES = [144,145,146,150,243,244,245,249,250,377,378,379,380,381,382,383,384,480,481,482,483,484,485,486,487,488,638,639,640,641,642,643,644,645,646,716,717,718,772,773,785,786,787,788,789,790,791,792,800,888,889,890,891,892,894,895,896,897,898,1001,1002,1003,1004,1014,1015,1016,1017];
const MYTHICALS = [151,251,385,386,489,490,491,492,493,494,647,648,649,719,720,721,801,802,807,808,809,893];
const PSEUDOS = [149,248,373,376,445,635,706,784,887,998];

// Structure simplifiée des dresseurs pour l'exemple (normalement 110)
const TRAINERS = [
  { name: 'Pierre', region: 'Kanto', rank: 'gym', sprite: 'https://play.pokemonshowdown.com/sprites/trainers/brock.png' },
  { name: 'Ondine', region: 'Kanto', rank: 'gym', sprite: 'https://play.pokemonshowdown.com/sprites/trainers/misty.png' },
  { name: 'Peter', region: 'Kanto', rank: 'champion', sprite: 'https://play.pokemonshowdown.com/sprites/trainers/lance.png' },
  { name: 'Blanche', region: 'Johto', rank: 'gym', sprite: 'https://play.pokemonshowdown.com/sprites/trainers/whitney.png' },
  { name: 'Sandra', region: 'Johto', rank: 'gym', sprite: 'https://play.pokemonshowdown.com/sprites/trainers/clair.png' },
  { name: 'Cynthia', region: 'Sinnoh', rank: 'champion', sprite: 'https://play.pokemonshowdown.com/sprites/trainers/cynthia.png' },
  { name: 'Goyah', region: 'Unys', rank: 'champion', sprite: 'https://play.pokemonshowdown.com/sprites/trainers/alder.png' },
  // ... autres dresseurs ajoutés dynamiquement ou via une base de données complète
];

// Helper pour générer une liste étendue pour la démo
const generateMockTrainers = (selectedRegions) => {
    let list = [];
    selectedRegions.forEach(r => {
        list.push({ name: `Champion 1 ${r}`, region: r, rank: 'gym', sprite: 'https://play.pokemonshowdown.com/sprites/trainers/ash.png' });
        list.push({ name: `Champion 8 ${r}`, region: r, rank: 'gym', sprite: 'https://play.pokemonshowdown.com/sprites/trainers/blue.png' });
        list.push({ name: `Membre C4 ${r}`, region: r, rank: '4', sprite: 'https://play.pokemonshowdown.com/sprites/trainers/karen.png' });
        list.push({ name: `Maître ${r}`, region: r, rank: 'champion', sprite: 'https://play.pokemonshowdown.com/sprites/trainers/red.png' });
    });
    return list;
};

export default function App() {
  const [gameState, setGameState] = useState('menu');
  const [mode, setMode] = useState(null); // 'solo', 'ordi', '1v1'
  
  const [config, setConfig] = useState({
    regions: REGIONS.map(r => r.name),
    types: Object.keys(TYPES),
    rerolls: 3,
    difficulty: 'normal',
    allowReuse: false
  });

  const [draftState, setDraftState] = useState({
    team1: [],
    team2: [],
    activePlayer: 1,
    currentRoll: null,
    rerollsLeft: 0,
    availablePokemon: [],
    loading: false,
    rolling: false,
    usedPokemonIds: []
  });

  const [battleResults, setBattleResults] = useState(null);
  const rollIntervalRef = useRef(null);

  const themeColors = {
    solo: 'bg-gradient-to-br from-cyan-600 via-blue-800 to-indigo-900',
    ordi: 'bg-gradient-to-br from-red-600 via-orange-800 to-red-950',
    '1v1': 'bg-gradient-to-br from-purple-600 via-fuchsia-800 to-indigo-950',
    default: 'bg-gradient-to-br from-slate-700 via-gray-800 to-slate-900'
  };

  const currentTheme = mode ? themeColors[mode] : themeColors.default;
  const glassCard = "bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.1)] rounded-2xl";

  const startDraft = () => {
    setGameState('draft');
    setDraftState({
      team1: [], team2: [], activePlayer: 1, currentRoll: null, 
      rerollsLeft: config.rerolls, availablePokemon: [], loading: false, 
      rolling: false, usedPokemonIds: []
    });
    executeRoll(1);
  };

  const executeRoll = (playerNum) => {
    if (config.regions.length === 0 || config.types.length === 0) return;
    setDraftState(prev => ({ ...prev, rolling: true, availablePokemon: [] }));

    let ticks = 0;
    rollIntervalRef.current = setInterval(() => {
      const randReg = config.regions[Math.floor(Math.random() * config.regions.length)];
      const randTyp = config.types[Math.floor(Math.random() * config.types.length)];
      setDraftState(prev => ({ ...prev, currentRoll: { region: randReg, type: randTyp } }));
      
      ticks++;
      if (ticks > 15) {
        clearInterval(rollIntervalRef.current);
        fetchPokemonForRoll(randReg, randTyp, playerNum);
      }
    }, 100);
  };

  const fetchPokemonForRoll = async (regionName, typeName, playerNum) => {
    setDraftState(prev => ({ ...prev, rolling: false, loading: true }));
    const regionData = REGIONS.find(r => r.name === regionName);
    const typeEn = TYPES[typeName];

    try {
      const res = await fetch(`https://pokeapi.co/api/v2/type/${typeEn}`);
      const data = await res.json();
      
      const filtered = data.pokemon
        .map(p => {
          const id = parseInt(p.pokemon.url.split('/').slice(-2, -1)[0]);
          return { id, name: p.pokemon.name };
        })
        .filter(p => p.id >= regionData.range[0] && p.id <= regionData.range[1]);

      const detailed = await Promise.all(filtered.map(async p => {
        const pRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${p.id}`);
        const pData = await pRes.json();
        return {
          id: p.id,
          name: pData.name,
          sprite: pData.sprites.front_default || pData.sprites.other['official-artwork'].front_default,
          types: pData.types.map(t => Object.keys(TYPES).find(key => TYPES[key] === t.type.name) || t.type.name),
          stats: pData.stats
        };
      }));

      setDraftState(prev => {
        const newState = { ...prev, availablePokemon: detailed, loading: false };
        if (mode === 'ordi' && playerNum === 2) {
           setTimeout(() => handleCPUTurn(newState), 1000);
        }
        return newState;
      });
    } catch (error) {
      console.error("Fetch error:", error);
      setDraftState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleCPUTurn = (currentState) => {
      const validPokemon = currentState.availablePokemon.filter(p => config.allowReuse || !currentState.usedPokemonIds.includes(p.id));
      
      if (validPokemon.length > 0) {
          // Heuristic weights
          const scored = validPokemon.map(p => {
              let score = 10;
              if (LEGENDARIES.includes(p.id)) score = 100;
              else if (MYTHICALS.includes(p.id) || PSEUDOS.includes(p.id)) score = 80;
              else {
                  // Approximation for fully evolved (BST > 450)
                  const bst = p.stats.reduce((acc, stat) => acc + stat.base_stat, 0);
                  if (bst > 450) score = 50;
                  else score = 20;
              }
              return { ...p, score };
          });

          // Weighted random selection
          const totalScore = scored.reduce((acc, p) => acc + p.score, 0);
          let randomVal = Math.random() * totalScore;
          let selected = scored[0];
          for (let p of scored) {
              randomVal -= p.score;
              if (randomVal <= 0) {
                  selected = p;
                  break;
              }
          }
          selectPokemon(selected, 2, currentState);
      } else if (currentState.rerollsLeft > 0) {
          handleReroll(2);
      } else {
          // CPU passes turn if forced
          selectPokemon(null, 2, currentState);
      }
  };

  const selectPokemon = (pokemon, playerNum, forceState = null) => {
    const stateToUse = forceState || draftState;
    if (pokemon && !config.allowReuse && stateToUse.usedPokemonIds.includes(pokemon.id)) return;

    setDraftState(prev => {
      const isP1 = playerNum === 1;
      const newTeam1 = isP1 && pokemon ? [...prev.team1, pokemon] : prev.team1;
      const newTeam2 = !isP1 && pokemon ? [...prev.team2, pokemon] : prev.team2;
      const newUsed = pokemon ? [...prev.usedPokemonIds, pokemon.id] : prev.usedPokemonIds;

      const p1Done = newTeam1.length >= 6;
      const p2Done = (mode === 'solo' ? true : newTeam2.length >= 6);

      if (p1Done && p2Done) {
        simulateBattles(newTeam1, newTeam2);
        return { ...prev, team1: newTeam1, team2: newTeam2, usedPokemonIds: newUsed };
      }

      let nextPlayer = 1;
      if (mode === '1v1') nextPlayer = isP1 ? (p2Done ? 1 : 2) : (p1Done ? 2 : 1);
      if (mode === 'ordi') nextPlayer = isP1 ? 2 : 1;

      setTimeout(() => executeRoll(nextPlayer), 100);

      return {
        ...prev,
        team1: newTeam1, team2: newTeam2, usedPokemonIds: newUsed,
        activePlayer: nextPlayer, rerollsLeft: config.rerolls
      };
    });
  };

  const handleReroll = (playerNum = draftState.activePlayer) => {
    if (draftState.rerollsLeft > 0 && !draftState.rolling) {
      setDraftState(prev => ({ ...prev, rerollsLeft: prev.rerollsLeft - 1 }));
      executeRoll(playerNum);
    }
  };

  const simulateBattles = (team1, team2) => {
    const trainers = generateMockTrainers(config.regions);
    
    const calcWinRate = (team) => {
        let rate = DIFFICULTIES[config.difficulty].baseWinRate;
        team.forEach(p => {
            if (LEGENDARIES.includes(p.id)) rate += 3;
            if (MYTHICALS.includes(p.id)) rate += 2;
            if (PSEUDOS.includes(p.id)) rate += 2;
        });
        return Math.min(100, rate);
    };

    const rate1 = calcWinRate(team1);
    const rate2 = mode === 'solo' ? 0 : calcWinRate(team2);

    let w1 = 0, l1 = 0, w2 = 0, l2 = 0;
    const battleLog = trainers.map(trainer => {
        const t1Win = (Math.random() * 100) <= rate1;
        const t2Win = mode !== 'solo' ? ((Math.random() * 100) <= rate2) : false;
        
        if (t1Win) w1++; else l1++;
        if (mode !== 'solo') {
            if (t2Win) w2++; else l2++;
        }
        return { trainer, t1Win, t2Win };
    });

    setBattleResults({ 
        team1: { wins: w1, losses: l1, rate: rate1 },
        team2: { wins: w2, losses: l2, rate: rate2 },
        log: battleLog,
        trainers
    });
    setGameState('results');
  };

  if (gameState === 'menu') {
    return (
      <div className={`min-h-screen p-4 transition-colors duration-1000 ${currentTheme} text-white font-sans`}>
        <div className={`max-w-2xl mx-auto space-y-6 pt-10 p-8 ${glassCard}`}>
          <h1 className="text-4xl font-bold text-center mb-8 drop-shadow-md">Poké Draft Simulator</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {['solo', 'ordi', '1v1'].map((m) => (
                <button 
                key={m} onClick={() => setMode(m)}
                className={`p-4 rounded-xl flex flex-col items-center gap-2 border-2 transition-all duration-300 ${mode === m ? 'border-white bg-white/30 scale-105' : 'border-transparent bg-black/20 hover:bg-white/10'}`}
                >
                {m === 'solo' ? <User size={32} /> : m === 'ordi' ? <Swords size={32} /> : <Users size={32} />}
                <span className="capitalize">{m === 'ordi' ? "Vs Ordi" : m}</span>
                </button>
            ))}
          </div>

          {mode && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div>
                <h3 className="font-semibold mb-2">Options de jeu</h3>
                <label className="flex items-center gap-2 text-sm bg-black/20 p-3 rounded-lg cursor-pointer w-fit">
                    <input type="checkbox" checked={config.allowReuse} onChange={(e) => setConfig({...config, allowReuse: e.target.checked})} />
                    Autoriser les doublons (même Pokémon)
                </label>
              </div>

              <div>
                <h3 className="font-semibold mb-2 flex justify-between">Régions <span className="text-xs opacity-70">Sélectionnez au moins une</span></h3>
                <div className="flex flex-wrap gap-2">
                  {REGIONS.map(r => (
                    <label key={r.name} className={`flex items-center gap-1 text-sm p-2 rounded-lg cursor-pointer border transition-colors ${config.regions.includes(r.name) ? 'bg-white/20 border-white/50' : 'bg-black/20 border-transparent opacity-60'}`}>
                      <input type="checkbox" className="hidden" checked={config.regions.includes(r.name)} onChange={(e) => {
                          const newReg = e.target.checked ? [...config.regions, r.name] : config.regions.filter(x => x !== r.name);
                          setConfig({...config, regions: newReg});
                        }}
                      />
                      {r.name}
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                    <h3 className="font-semibold mb-2">Difficulté</h3>
                    <select className="w-full p-3 rounded-lg bg-black/30 text-white border border-white/20 outline-none focus:border-white"
                        value={config.difficulty} onChange={e => setConfig({...config, difficulty: e.target.value})}>
                        {Object.entries(DIFFICULTIES).map(([k, v]) => (
                            <option key={k} value={k} className="text-black">{v.label} ({v.baseWinRate}%)</option>
                        ))}
                    </select>
                </div>
                <div>
                    <h3 className="font-semibold mb-2">Re-rolls</h3>
                    <input type="number" min="0" max="10" className="w-full p-3 rounded-lg bg-black/30 text-white border border-white/20 outline-none focus:border-white"
                        value={config.rerolls} onChange={e => setConfig({...config, rerolls: parseInt(e.target.value) || 0})} />
                </div>
              </div>

              <button onClick={startDraft} className="w-full py-4 mt-4 bg-white/20 hover:bg-white/30 border border-white/40 text-white rounded-xl font-bold text-lg shadow-lg backdrop-blur-md transition-all active:scale-95">
                Lancer la partie
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (gameState === 'draft') {
      const TeamSlots = ({ team, label, isActive }) => (
          <div className={`p-4 rounded-xl transition-all duration-500 ${isActive ? 'bg-white/20 border-white/50 ring-2 ring-white ring-offset-2 ring-offset-transparent' : 'bg-black/20 border-transparent opacity-80'} border`}>
              <h2 className="font-bold mb-2 text-center text-white">{label} ({team.length}/6)</h2>
              <div className={`flex flex-wrap gap-2 justify-center ${mode === 'solo' ? 'md:gap-4' : ''}`}>
                  {[...Array(6)].map((_, i) => (
                      <div key={i} className={`${mode === 'solo' ? 'w-16 h-16 md:w-24 md:h-24' : 'w-12 h-12'} rounded-lg bg-black/40 border border-white/20 flex items-center justify-center overflow-hidden`}>
                          {team[i] && <img src={team[i].sprite} alt={team[i].name} className="w-full h-full object-contain drop-shadow-lg" />}
                      </div>
                  ))}
              </div>
          </div>
      );

      return (
          <div className={`min-h-screen flex flex-col text-white transition-colors duration-500 ${currentTheme}`}>
              <div className="sticky top-0 z-10 p-4 backdrop-blur-xl border-b border-white/10 shadow-lg bg-black/10">
                  <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-center gap-4">
                      <TeamSlots team={draftState.team1} label="Joueur 1" isActive={draftState.activePlayer === 1} />
                      {mode !== 'solo' && (
                          <TeamSlots team={draftState.team2} label={mode === 'ordi' ? "Ordinateur" : "Joueur 2"} isActive={draftState.activePlayer === 2} />
                      )}
                  </div>
              </div>

              <div className="flex-1 p-6 max-w-4xl mx-auto w-full flex flex-col items-center">
                  <div className={`w-full md:w-2/3 ${glassCard} p-6 text-center mb-8`}>
                      <h3 className="text-xl opacity-80 mb-4">
                          {draftState.activePlayer === 2 && mode === 'ordi' ? "L'ordinateur réfléchit..." : "Tirage en cours"}
                      </h3>
                      <div className="text-4xl md:text-5xl font-black tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 drop-shadow-md mb-6 h-16 flex items-center justify-center">
                          {draftState.currentRoll ? `${draftState.currentRoll.region} - ${draftState.currentRoll.type}` : "..."}
                      </div>
                      
                      {draftState.activePlayer !== 2 || mode !== 'ordi' ? (
                        <div className="flex justify-center items-center gap-6">
                            <span className="text-lg bg-black/30 px-4 py-2 rounded-lg">Rerolls: {draftState.rerollsLeft}</span>
                            <button onClick={() => handleReroll()} disabled={draftState.rerollsLeft === 0 || draftState.loading || draftState.rolling}
                                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-6 py-2 rounded-lg font-bold disabled:opacity-40 transition-colors">
                                <RefreshCw size={20} className={draftState.rolling ? "animate-spin" : ""} /> Relancer
                            </button>
                        </div>
                      ) : null}
                  </div>

                  <div className="w-full">
                      {draftState.loading || draftState.rolling ? (
                          <div className="text-center py-12 text-2xl animate-pulse">Chargement des données...</div>
                      ) : (
                          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 pb-20">
                              {draftState.availablePokemon.length === 0 ? (
                                  <div className="col-span-full text-center py-10 text-xl opacity-60">Aucun Pokémon trouvé. Utilisez un reroll !</div>
                              ) : (
                                  draftState.availablePokemon.map(p => {
                                      const isUsed = !config.allowReuse && draftState.usedPokemonIds.includes(p.id);
                                      return (
                                          <button key={p.id} disabled={isUsed || (draftState.activePlayer === 2 && mode === 'ordi')}
                                              onClick={() => selectPokemon(p, draftState.activePlayer)}
                                              className={`relative flex flex-col items-center p-3 rounded-xl transition-all duration-200 
                                                  ${isUsed ? 'bg-red-900/40 border-red-500/50 grayscale cursor-not-allowed' : 'bg-white/10 hover:bg-white/20 border-white/20 hover:scale-105 active:scale-95 cursor-pointer'} border backdrop-blur-sm shadow-md`}>
                                              
                                              {isUsed && <div className="absolute inset-0 bg-red-900/20 rounded-xl z-10 pointer-events-none" />}
                                              <img src={p.sprite} alt={p.name} className="w-24 h-24 object-contain drop-shadow-md z-0" loading="lazy" />
                                              <span className="font-bold capitalize text-sm truncate w-full text-center mt-2 z-0">{p.name}</span>
                                              <div className="flex gap-1 mt-1 z-0">
                                                  {p.types.map(t => <span key={t} className="text-[10px] px-2 py-0.5 bg-black/40 rounded-full opacity-80">{t}</span>)}
                                              </div>
                                          </button>
                                      );
                                  })
                              )}
                          </div>
                      )}
                  </div>
              </div>
          </div>
      );
  }

  if (gameState === 'results') {
      const getWinner = () => {
          if (mode === 'solo') return null;
          if (battleResults.team1.wins > battleResults.team2.wins) return "Joueur 1 Gagne !";
          if (battleResults.team2.wins > battleResults.team1.wins) return mode === 'ordi' ? "L'Ordinateur Gagne !" : "Joueur 2 Gagne !";
          return "Égalité !";
      };

      const groupedTrainers = battleResults.trainers.reduce((acc, t, i) => {
          if (!acc[t.region]) acc[t.region] = [];
          acc[t.region].push({ ...t, index: i });
          return acc;
      }, {});

      return (
          <div className={`min-h-screen p-4 md:p-8 text-white transition-colors duration-1000 ${currentTheme}`}>
              <div className="max-w-6xl mx-auto space-y-8">
                  
                  <div className="flex justify-between items-center bg-black/20 p-4 rounded-2xl backdrop-blur-md">
                      <h1 className="text-3xl font-bold">Rapport de Combat</h1>
                      <div className="flex gap-3">
                          <button onClick={startDraft} className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"><RotateCcw size={20}/> Rejouer</button>
                          <button onClick={() => setGameState('menu')} className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-xl hover:bg-white/30 transition-colors"><Home size={20}/> Menu</button>
                      </div>
                  </div>

                  {mode !== 'solo' && (
                      <div className={`text-center py-8 rounded-3xl text-5xl font-black uppercase tracking-widest ${glassCard} border-white/40 shadow-2xl bg-white/20`}>
                          {getWinner()}
                      </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Joueur 1 Stats */}
                      <div className={`${glassCard} p-6 text-center`}>
                          <h2 className="text-2xl font-bold mb-4">Joueur 1</h2>
                          <div className="text-6xl font-black mb-2">{battleResults.team1.wins} - {battleResults.team1.losses}</div>
                          <p className="opacity-70 mb-6">Taux de victoire : {battleResults.team1.rate}%</p>
                          <div className="flex flex-wrap justify-center gap-2">
                              {draftState.team1.map((p, i) => (
                                  <div key={i} className="w-16 h-16 bg-black/30 rounded-xl p-1 border border-white/20"><img src={p.sprite} alt={p.name} className="w-full h-full object-contain drop-shadow-md"/></div>
                              ))}
                          </div>
                      </div>

                      {/* Joueur 2 Stats */}
                      {mode !== 'solo' && (
                          <div className={`${glassCard} p-6 text-center`}>
                              <h2 className="text-2xl font-bold mb-4">{mode === 'ordi' ? "Ordinateur" : "Joueur 2"}</h2>
                              <div className="text-6xl font-black mb-2">{battleResults.team2.wins} - {battleResults.team2.losses}</div>
                              <p className="opacity-70 mb-6">Taux de victoire : {battleResults.team2.rate}%</p>
                              <div className="flex flex-wrap justify-center gap-2">
                                  {draftState.team2.map((p, i) => (
                                      <div key={i} className="w-16 h-16 bg-black/30 rounded-xl p-1 border border-white/20"><img src={p.sprite} alt={p.name} className="w-full h-full object-contain drop-shadow-md"/></div>
                                  ))}
                              </div>
                          </div>
                      )}
                  </div>

                  {/* Liste des Combats */}
                  <div className={`${glassCard} p-6`}>
                      <h2 className="text-2xl font-bold mb-6 text-center">Détails des Combats par Région</h2>
                      
                      <div className="space-y-12">
                          {Object.entries(groupedTrainers).map(([region, trainers]) => (
                              <div key={region}>
                                  <h3 className="text-xl font-bold uppercase tracking-wider mb-4 border-b border-white/20 pb-2 text-white/90">{region}</h3>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                      {trainers.map((t) => {
                                          const res1 = battleResults.log[t.index].t1Win;
                                          const res2 = mode !== 'solo' ? battleResults.log[t.index].t2Win : null;

                                          return (
                                              <div key={t.index} className="bg-black/30 rounded-xl overflow-hidden border border-white/10 flex flex-col relative">
                                                  <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 rounded text-[10px] uppercase font-bold tracking-wider z-10">
                                                      {t.rank}
                                                  </div>
                                                  <div className="h-32 w-full bg-black/40 flex items-center justify-center p-2">
                                                      {/* Placeholder sprite using UI avatars for robustness if link fails */}
                                                      <img src={t.sprite} alt={t.name} className="h-full object-contain pixelated drop-shadow-md" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}/>
                                                      <div className="hidden h-full w-full items-center justify-center text-3xl font-black text-white/20">{t.name[0]}</div>
                                                  </div>
                                                  <div className="p-3 bg-white/5">
                                                      <p className="font-bold text-center mb-2 truncate">{t.name}</p>
                                                      <div className="flex flex-col gap-1 text-sm font-semibold">
                                                          <div className={`p-1 text-center rounded ${res1 ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                                                              J1: {res1 ? 'VICTOIRE' : 'DÉFAITE'}
                                                          </div>
                                                          {mode !== 'solo' && (
                                                              <div className={`p-1 text-center rounded ${res2 ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                                                                  {mode === 'ordi' ? 'CPU' : 'J2'}: {res2 ? 'VICTOIRE' : 'DÉFAITE'}
                                                              </div>
                                                          )}
                                                      </div>
                                                  </div>
                                              </div>
                                          );
                                      })}
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  return null;
}
