const { useState, useEffect } = React;

// --- BASE DE DONNÉES DES 110+ DRESSEURS ---
const TRAINERS_DB = [
  // KANTO
  { name: "Pierre", region: "Kanto", role: "gym", type: "Roche" },
  { name: "Ondine", region: "Kanto", role: "gym", type: "Eau" },
  { name: "Major Bob", region: "Kanto", role: "gym", type: "Électrik" },
  { name: "Érika", region: "Kanto", role: "gym", type: "Plante" },
  { name: "Koga (ou Morgane)", region: "Kanto", role: "gym", type: "Poison" },
  { name: "Morgane", region: "Kanto", role: "gym", type: "Psy" },
  { name: "Auguste", region: "Kanto", role: "gym", type: "Feu" },
  { name: "Giovanni", region: "Kanto", role: "gym", type: "Sol" },
  { name: "Olga", region: "Kanto", role: "4", type: "Glace" },
  { name: "Aldo", region: "Kanto", role: "4", type: "Combat" },
  { name: "Agatha", region: "Kanto", role: "4", type: "Spectre" },
  { name: "Peter", region: "Kanto", role: "4", type: "Dragon" },
  { name: "Blue", region: "Kanto", role: "champion", type: "Normal" },
  // JOHTO
  { name: "Albert", region: "Johto", role: "gym", type: "Vol" },
  { name: "郝érald", region: "Johto", role: "gym", type: "Insecte" },
  { name: "Blanche", region: "Johto", role: "gym", type: "Normal" },
  { name: "Mortimer", region: "Johto", role: "gym", type: "Spectre" },
  { name: "Chuck", region: "Johto", role: "gym", type: "Combat" },
  { name: "Jasmine", region: "Johto", role: "gym", type: "Acier" },
  { name: "Pyroli / Prys", region: "Johto", role: "gym", type: "Glace" },
  { name: "Écho / Iris", region: "Johto", role: "gym", type: "Dragon" },
  { name: "Clément", region: "Johto", role: "4", type: "Psy" },
  { name: "Koga", region: "Johto", role: "4", type: "Poison" },
  { name: "Aldo", region: "Johto", role: "4", type: "Combat" },
  { name: "Marion", region: "Johto", role: "4", type: "Ténèbres" },
  { name: "Peter", region: "Johto", role: "champion", type: "Dragon" },
  // HOENN
  { name: "Pierre", region: "Hoenn", role: "gym", type: "Roche" },
  { name: "Bastien", region: "Hoenn", role: "gym", type: "Combat" },
  { name: "Voltiz", region: "Hoenn", role: "gym", type: "Électrik" },
  { name: "Adriane", region: "Hoenn", role: "gym", type: "Feu" },
  { name: "Norman", region: "Hoenn", role: "gym", type: "Normal" },
  { name: "Alizée", region: "Hoenn", role: "gym", type: "Vol" },
  { name: "Léo et Léa", region: "Hoenn", role: "gym", type: "Psy" },
  { name: "Juan", region: "Hoenn", role: "gym", type: "Eau" },
  { name: "Damien", region: "Hoenn", role: "4", type: "Ténèbres" },
  { name: "Spectra", region: "Hoenn", role: "4", type: "Spectre" },
  { name: "Glacia", region: "Hoenn", role: "4", type: "Glace" },
  { name: "Aragon", region: "Hoenn", role: "4", type: "Dragon" },
  { name: "Pierre Rochard", region: "Hoenn", role: "champion", type: "Acier" },
  // SINNOH
  { name: "Pierrick", region: "Sinnoh", role: "gym", type: "Roche" },
  { name: "Flo", region: "Sinnoh", role: "gym", type: "Plante" },
  { name: "Melissa", region: "Sinnoh", role: "gym", type: "Spectre" },
  { name: "achille / Lovis", region: "Sinnoh", role: "gym", type: "Eau" },
  { name: "netCHAMP / Kiméra", region: "Sinnoh", role: "gym", type: "Spectre" },
  { name: "Damsel / Tanguy", region: "Sinnoh", role: "gym", type: "Électrik" },
  { name: "Gladys", region: "Sinnoh", role: "gym", type: "Glace" },
  { name: "Lucio / Tanguy", region: "Sinnoh", role: "gym", type: "Électrik" },
  { name: "Aaron", region: "Sinnoh", role: "4", type: "Insecte" },
  { name: "Terry", region: "Sinnoh", role: "4", type: "Sol" },
  { name: "Adrien", region: "Sinnoh", role: "4", type: "Feu" },
  { name: "Lucio", region: "Sinnoh", role: "4", type: "Psy" },
  { name: "Cynthia", region: "Sinnoh", role: "champion", type: "Dragon" },
  // UNYS
  { name: "Artie", region: "Unys", role: "gym", type: "Insecte" },
  { name: "Aloé", region: "Unys", role: "gym", type: "Normal" },
  { name: "Artus", region: "Unys", role: "gym", type: "Glace" },
  { name: "Bardane", region: "Unys", role: "gym", type: "Sol" },
  { name: "Carolina", region: "Unys", role: "gym", type: "Vol" },
  { name: "Chilis", region: "Unys", role: "gym", type: "Feu" },
  { name: "Cilan", region: "Unys", role: "gym", type: "Plante" },
  { name: "Deschamps", region: "Unys", role: "gym", type: "Normal" },
  { name: "Goyah", region: "Unys", role: "gym", type: "Insecte" },
  { name: "Inezia", region: "Unys", role: "gym", type: "Électrik" },
  { name: "Kacham", region: "Unys", role: "gym", type: "Dragon" },
  { name: "Noa", region: "Unys", role: "gym", type: "Eau" },
  { name: "Rachid", region: "Unys", role: "gym", type: "Eau" },
  { name: "Zinzolin", region: "Unys", role: "gym", type: "Glace" },
  { name: "Anis", region: "Unys", role: "4", type: "Spectre" },
  { name: "Pieris", region: "Unys", role: "4", type: "Ténèbres" },
  { name: "Percila", region: "Unys", role: "4", type: "Psy" },
  { name: "Kunz", region: "Unys", role: "4", type: "Combat" },
  { name: "Iris", region: "Unys", role: "champion", type: "Dragon" },
  // KALOS
  { name: "Violette", region: "Kalos", role: "gym", type: "Insecte" },
  { name: "Lino", region: "Kalos", role: "gym", type: "Roche" },
  { name: "Cornélia", region: "Kalos", role: "gym", type: "Combat" },
  { name: "Amarille", region: "Kalos", role: "gym", type: "Plante" },
  { name: "Lem", region: "Kalos", role: "gym", type: "Électrik" },
  { name: "Valériane", region: "Kalos", role: "gym", type: "Fée" },
  { name: "Astrid", region: "Kalos", role: "gym", type: "Psy" },
  { name: "Ulysse", region: "Kalos", role: "gym", type: "Glace" },
  { name: "Thyméo", region: "Kalos", role: "4", type: "Acier" },
  { name: "Malva", region: "Kalos", role: "4", type: "Feu" },
  { name: "Dracéna", region: "Kalos", role: "4", type: "Dragon" },
  { name: "Narcisse", region: "Kalos", role: "4", type: "Eau" },
  { name: "Dianthéa", region: "Kalos", role: "champion", type: "Fée" },
  // ALOLA
  { name: "Pectorius", region: "Alola", role: "4", type: "Combat" },
  { name: "Olala", region: "Alola", role: "4", type: "Roche" },
  { name: "ninjia", region: "Alola", role: "4", type: "Spectre" },
  { name: "Kahili", region: "Alola", role: "4", type: "Vol" },
  { name: "Le Joueur", region: "Alola", role: "champion", type: "Normal" },
  // GALAR
  { name: "Percy", region: "Galar", role: "gym", type: "Plante" },
  { name: "Donna", region: "Galar", role: "gym", type: "Eau" },
  { name: "Kabu", region: "Galar", role: "gym", type: "Feu" },
  { name: "Alistair", region: "Galar", role: "gym", type: "Spectre" },
  { name: "Lona", region: "Galar", role: "gym", type: "Fée" },
  { name: "Sally", region: "Galar", role: "gym", type: "Fée" },
  { name: "Chaz", region: "Galar", role: "gym", type: "Glace" },
  { name: "Roy", region: "Galar", role: "gym", type: "Dragon" },
  { name: "Tarak", region: "Galar", role: "champion", type: "Feu" },
  // PALDEA
  { name: "Émilia", region: "Paldea", role: "gym", type: "Insecte" },
  { name: "Colza", region: "Paldea", role: "gym", type: "Plante" },
  { name: "Mashynn", region: "Paldea", role: "gym", type: "Électrik" },
  { name: "Musara", region: "Paldea", role: "gym", type: "Eau" },
  { name: "Laïm", region: "Paldea", role: "gym", type: "Spectre" },
  { name: "Tulia", region: "Paldea", role: "gym", type: "Psy" },
  { name: "Grusha", region: "Paldea", role: "gym", type: "Glace" },
  { name: "Seantique", region: "Paldea", role: "gym", type: "Givre" },
  { name: "Rika", region: "Paldea", role: "4", type: "Sol" },
  { name: "Popi", region: "Paldea", role: "4", type: "Acier" },
  { name: "Hassle", region: "Paldea", role: "4", type: "Dragon" },
  { name: "Okuba", region: "Paldea", role: "4", type: "Vol" },
  { name: "Alisma", region: "Paldea", role: "champion", type: "Psy" }
];

const REGIONS = ['Kanto', 'Johto', 'Hoenn', 'Sinnoh', 'Unys', 'Kalos', 'Alola', 'Galar', 'Paldea'];
const TYPES = ['Feu', 'Eau', 'Plante', 'Électrik', 'Glace', 'Normal', 'Combat', 'Poison', 'Sol', 'Vol', 'Psy', 'Insecte', 'Roche', 'Spectre', 'Dragon', 'Ténèbres', 'Acier', 'Fée'];

// Base de données simulée pour une réponse instantanée sans requêtes complexes
const MOCK_POKEDEX = Array.from({ length: 400 }, (_, i) => ({
  id: i + 1,
  name: `Pokémon ${i + 1}`,
  types: [TYPES[Math.floor(Math.random() * TYPES.length)]],
  region: REGIONS[Math.floor(Math.random() * REGIONS.length)],
  sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i + 1}.png`,
  isLegendary: Math.random() < 0.05,
  isMythical: Math.random() < 0.03,
  isFullyEvolved: Math.random() < 0.3
}));

function PokemonApp() {
  const [phase, setPhase] = useState('menu'); // menu, draft, battle
  const [mode, setMode] = useState('solo'); // solo, pc, 1v1
  
  const [selectedRegions, setSelectedRegions] = useState([...REGIONS]);
  const [selectedTypes, setSelectedTypes] = useState([...TYPES]);
  const [allowDuplicates, setAllowDuplicates] = useState(true);
  const [maxRerolls, setMaxRerolls] = useState(3);
  const [difficulty, setDifficulty] = useState('normal');

  const [currentRerolls, setCurrentRerolls] = useState(0);
  const [currentRollTarget, setCurrentRollTarget] = useState({ region: null, type: null });
  const [isRolling, setIsRolling] = useState(false);
  const [availablePokemon, setAvailablePokemon] = useState([]);
  
  const [team1, setTeam1] = useState(Array(6).fill(null));
  const [team2, setTeam2] = useState(Array(6).fill(null));
  const [currentTurn, setCurrentTurn] = useState(1);

  const [battleResults, setBattleResults] = useState([]);
  const [revealedCount, setRevealedCount] = useState(0);

  const getThemeClasses = () => {
    switch(mode) {
      case 'solo': return 'bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600';
      case 'pc': return 'bg-gradient-to-br from-rose-500 via-red-600 to-orange-700';
      case '1v1': return 'bg-gradient-to-br from-emerald-400 via-green-500 to-teal-700';
      default: return 'bg-gradient-to-br from-gray-700 to-gray-900';
    }
  };

  const handleRoll = () => {
    if (currentRerolls <= 0 && currentRollTarget.region) return;
    setIsRolling(true);
    
    let rollCount = 0;
    const rollInterval = setInterval(() => {
      setCurrentRollTarget({
        region: selectedRegions[Math.floor(Math.random() * selectedRegions.length)],
        type: selectedTypes[Math.floor(Math.random() * selectedTypes.length)]
      });
      rollCount++;
      if (rollCount > 10) {
        clearInterval(rollInterval);
        setIsRolling(false);
        if (currentRollTarget.region) setCurrentRerolls(prev => prev - 1);
        
        setTimeout(() => {
          setAvailablePokemon(MOCK_POKEDEX.slice(0, 10 + Math.floor(Math.random() * 5)));
        }, 300);
      }
    }, 100);
  };

  const selectPokemon = (pokemon) => {
    if (mode === 'solo') {
      const newTeam = [...team1];
      const emptyIndex = newTeam.findIndex(p => p === null);
      if (emptyIndex !== -1) {
        newTeam[emptyIndex] = pokemon;
        setTeam1(newTeam);
        if (emptyIndex === 5) prepareBattle(newTeam, null);
        else resetRollForNext();
      }
    } else if (mode === '1v1') {
      if (currentTurn === 1) {
        const newTeam = [...team1];
        const idx = newTeam.findIndex(p => p === null);
        newTeam[idx] = pokemon;
        setTeam1(newTeam);
        setCurrentTurn(2);
      } else {
        const newTeam = [...team2];
        const idx = newTeam.findIndex(p => p === null);
        newTeam[idx] = pokemon;
        setTeam2(newTeam);
        setCurrentTurn(1);
        if (idx === 5) prepareBattle(team1, newTeam);
      }
      resetRollForNext();
    } else if (mode === 'pc') {
      const newTeam1 = [...team1];
      const idx = newTeam1.findIndex(p => p === null);
      newTeam1[idx] = pokemon;
      setTeam1(newTeam1);
      
      const pcChoice = MOCK_POKEDEX[Math.floor(Math.random() * MOCK_POKEDEX.length)]; 
      
      const newTeam2 = [...team2];
      newTeam2[idx] = pcChoice;
      setTeam2(newTeam2);
      
      if (idx === 5) prepareBattle(newTeam1, newTeam2);
      else resetRollForNext();
    }
  };

  const resetRollForNext = () => {
    setAvailablePokemon([]);
    setCurrentRollTarget({ region: null, type: null });
    setCurrentRerolls(maxRerolls);
  };

  const calculateTeamWinRate = (team) => {
    const baseProb = difficulty === 'easy' ? 80 : difficulty === 'normal' ? 65 : 50;
    let bonus = 0;
    team.forEach(p => {
      if (p && p.isLegendary) bonus += 3;
      if (p && p.isMythical) bonus += 2;
    });
    return baseProb + bonus;
  };

  const prepareBattle = (t1, t2) => {
    const p1Prob = calculateTeamWinRate(t1);
    const p2Prob = t2 ? calculateTeamWinRate(t2) : 0;
    
    const relevantTrainers = TRAINERS_DB.filter(t => selectedRegions.includes(t.region));
    
    const results = relevantTrainers.map(trainer => {
      const p1Win = (Math.random() * 100) < p1Prob;
      const p2Win = t2 ? (Math.random() * 100) < p2Prob : false;
      return { trainer, p1Win, p2Win };
    });
    
    setBattleResults(results);
    setPhase('battle');
    setRevealedCount(0);
  };

  useEffect(() => {
    if (phase === 'battle' && battleResults.length > 0) {
      const timer = setInterval(() => {
        setRevealedCount(prev => {
          if (prev < battleResults.length) return prev + 1;
          clearInterval(timer);
          return prev;
        });
      }, 150); // Révélation progressive rapide
      
      return () => clearInterval(timer);
    }
  }, [phase, battleResults.length]);

  const resetGame = () => {
    setTeam1(Array(6).fill(null));
    setTeam2(Array(6).fill(null));
    setCurrentTurn(1);
    resetRollForNext();
    setPhase('draft');
  };

  const renderMenu = () => (
    <div className="flex flex-col items-center p-6 space-y-6 w-full max-w-lg mx-auto">
      <h1 className="text-5xl text-white font-bold mb-4 drop-shadow-lg text-center" style={{fontFamily: "'VT323', monospace"}}>POKÉ DRAFT</h1>
      
      <div className="glass-panel p-4 flex gap-2 w-full justify-center">
        {['solo', 'pc', '1v1'].map(m => (
          <button 
            key={m}
            onClick={() => setMode(m)}
            className={`px-6 py-2 rounded-xl transition-all duration-300 ${mode === m ? 'bg-white/30 border-2 border-white/60 shadow-[inset_0_0_10px_rgba(255,255,255,0.5)]' : 'bg-black/20 hover:bg-black/30'} text-white font-bold uppercase tracking-wider`}
            style={{fontFamily: "'VT323', monospace", fontSize: '1.2rem'}}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="glass-panel p-6 w-full space-y-4 text-white">
        <div>
          <label className="block text-xl mb-2 font-bold" style={{fontFamily: "'VT323', monospace"}}>Difficulté</label>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full bg-black/30 border border-white/20 rounded p-2 text-white outline-none">
            <option value="easy">Easy (80% Base)</option>
            <option value="normal">Normal (65% Base)</option>
            <option value="hard">Hard (50% Base)</option>
          </select>
        </div>
        
        <div>
          <label className="block text-xl mb-2 font-bold" style={{fontFamily: "'VT323', monospace"}}>Nombre de Rerolls ({maxRerolls})</label>
          <input type="range" min="0" max="10" value={maxRerolls} onChange={(e) => setMaxRerolls(Number(e.target.value))} className="w-full accent-white" />
        </div>

        <button 
          onClick={() => { resetRollForNext(); setPhase('draft'); }}
          className="w-full py-4 mt-6 bg-white/20 hover:bg-white/30 border border-white/40 rounded-2xl text-2xl font-bold transition-all shadow-lg backdrop-blur-md"
          style={{fontFamily: "'VT323', monospace"}}
        >
          LANCER LA PARTIE
        </button>
      </div>
    </div>
  );

  const renderDraft = () => (
    <div className="flex flex-col h-full w-full max-w-2xl mx-auto p-4 space-y-4">
      <div className="glass-panel p-4 space-y-4">
        <div className={`transition-all duration-300 ${currentTurn === 1 ? 'scale-105 shadow-[0_0_15px_rgba(255,255,255,0.5)] rounded-xl' : 'opacity-70'}`}>
          <p className="text-white text-center font-bold mb-2" style={{fontFamily: "'VT323', monospace", fontSize: '1.2rem'}}>
            {mode === 'solo' ? 'TON ÉQUIPE' : 'ÉQUIPE JOUEUR 1'}
          </p>
          <div className="flex gap-2 justify-center">
            {team1.map((p, i) => (
              <div key={i} className={`w-12 h-12 md:w-16 md:h-16 rounded bg-black/40 border ${p ? 'border-white/40' : 'border-white/10 border-dashed'} flex items-center justify-center`}>
                {p && <img src={p.sprite} alt="poke" className="w-full h-full object-contain drop-shadow-md" />}
              </div>
            ))}
          </div>
        </div>

        {mode !== 'solo' && (
          <div className={`transition-all duration-300 ${currentTurn === 2 ? 'scale-105 shadow-[0_0_15px_rgba(255,100,100,0.5)] rounded-xl' : 'opacity-70'}`}>
            <p className="text-white text-center font-bold mb-2" style={{fontFamily: "'VT323', monospace", fontSize: '1.2rem'}}>
              {mode === 'pc' ? 'ÉQUIPE ORDI' : 'ÉQUIPE JOUEUR 2'}
            </p>
            <div className="flex gap-2 justify-center">
              {team2.map((p, i) => (
                <div key={i} className={`w-12 h-12 md:w-16 md:h-16 rounded bg-black/40 border ${p ? 'border-white/40' : 'border-white/10 border-dashed'} flex items-center justify-center`}>
                  {p && <img src={p.sprite} alt="poke" className="w-full h-full object-contain drop-shadow-md" />}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="glass-panel p-6 flex flex-col items-center justify-center">
        <div className="flex gap-4 mb-6">
          <div className="bg-black/50 border-2 border-white/30 rounded-lg p-4 w-32 h-20 flex items-center justify-center overflow-hidden">
            <span className={`text-2xl text-white font-bold ${isRolling ? 'animate-pulse' : ''}`} style={{fontFamily: "'VT323', monospace"}}>
              {currentRollTarget.region || '???'}
            </span>
          </div>
          <div className="bg-black/50 border-2 border-white/30 rounded-lg p-4 w-32 h-20 flex items-center justify-center overflow-hidden">
            <span className={`text-2xl text-white font-bold ${isRolling ? 'animate-pulse' : ''}`} style={{fontFamily: "'VT323', monospace"}}>
              {currentRollTarget.type || '???'}
            </span>
          </div>
        </div>
        
        <button 
          onClick={handleRoll}
          disabled={isRolling || (currentRerolls <= 0 && currentRollTarget.region)}
          className="px-8 py-3 bg-white/20 hover:bg-white/30 disabled:opacity-50 border border-white/50 rounded-full text-white font-bold text-2xl transition-all active:scale-95"
          style={{fontFamily: "'VT323', monospace"}}
        >
          {currentRollTarget.region ? `RE-ROLL (${currentRerolls})` : 'ROLL !'}
        </button>
      </div>

      {availablePokemon.length > 0 && (
        <div className="glass-panel p-4 flex-1 overflow-y-auto">
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
            {availablePokemon.map(p => (
              <div 
                key={p.id} 
                onClick={() => selectPokemon(p)}
                className="bg-black/20 hover:bg-white/10 border border-white/10 rounded-lg p-2 cursor-pointer transition-all flex flex-col items-center hover:scale-105 active:scale-95"
              >
                <img src={p.sprite} alt={p.name} className="w-16 h-16 drop-shadow-lg" />
                <span className="text-white text-sm mt-1 text-center" style={{fontFamily: "'VT323', monospace"}}>{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderBattle = () => {
    const p1Wins = battleResults.filter(r => r.p1Win).length;
    const p2Wins = battleResults.filter(r => r.p2Win).length;
    const total = battleResults.length;

    const revealedResults = battleResults.slice(0, revealedCount);
    const resultsByRegion = revealedResults.reduce((acc, result) => {
      if (!acc[result.trainer.region]) acc[result.trainer.region] = [];
      acc[result.trainer.region].push(result);
      return acc;
    }, {});

    return (
      <div className="flex flex-col h-full w-full max-w-4xl mx-auto p-4 space-y-4">
        <div className="glass-panel p-4 flex justify-between items-center text-white" style={{fontFamily: "'VT323', monospace"}}>
          <div className="flex flex-col items-center">
            <span className="text-xl">JOUEUR 1</span>
            <span className="text-3xl text-emerald-400">{p1Wins} - {total - p1Wins}</span>
          </div>
          
          <div className="flex gap-4">
            <button onClick={resetGame} className="px-4 py-2 bg-white/20 rounded hover:bg-white/30 border border-white/30 transition-all">RETRY</button>
            <button onClick={() => setPhase('menu')} className="px-4 py-2 bg-white/20 rounded hover:bg-white/30 border border-white/30 transition-all">HOME</button>
          </div>

          {mode !== 'solo' && (
            <div className="flex flex-col items-center">
              <span className="text-xl">{mode === 'pc' ? 'ORDI' : 'JOUEUR 2'}</span>
              <span className="text-3xl text-rose-400">{p2Wins} - {total - p2Wins}</span>
            </div>
          )}
        </div>

        <div className="glass-panel flex-1 p-4 overflow-y-auto space-y-6">
          {Object.entries(resultsByRegion).map(([region, results]) => (
            <div key={region} className="space-y-2">
              <h2 className="text-2xl text-white border-b border-white/20 pb-1 mb-3" style={{fontFamily: "'VT323', monospace"}}>{region}</h2>
              <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2">
                {results.map((r, i) => (
                  <div key={i} className="bg-black/30 rounded flex flex-col overflow-hidden border border-white/10 animate-fade-in">
                    <div className="h-12 w-full bg-black/40 flex items-center justify-center p-1 relative">
                       <img src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${r.trainer.name}`} alt={r.trainer.name} className="h-full w-full object-contain" />
                       <span className="absolute bottom-0 right-0 bg-black/80 text-[8px] text-white px-1 font-bold" style={{fontFamily: "'VT323', monospace"}}>{r.trainer.role.toUpperCase()}</span>
                    </div>
                    
                    <div className="p-1 flex flex-col items-center bg-black/50">
                      <span className="text-white text-xs truncate w-full text-center" style={{fontFamily: "'VT323', monospace"}}>{r.trainer.name}</span>
                      <div className="flex gap-1 mt-1 w-full h-1.5">
                        <div className={`flex-1 rounded-sm ${r.p1Win ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        {mode !== 'solo' && (
                          <div className={`flex-1 rounded-sm ${r.p2Win ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {revealedCount < battleResults.length && (
            <div className="text-center text-white/50 text-xl animate-pulse py-4" style={{fontFamily: "'VT323', monospace"}}>
              Combats en cours...
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen w-full transition-colors duration-700 ${getThemeClasses()} overflow-hidden`}>
      <div className="h-screen w-full flex flex-col">
        {phase === 'menu' && renderMenu()}
        {phase === 'draft' && renderDraft()}
        {phase === 'battle' && renderBattle()}
      </div>
    </div>
  );
}

// Lancement de l'application (spécifique à la méthode GitHub sans Vite)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<PokemonApp />);
