import { useMemo, useState, useEffect } from 'react';
import './App.css';
const defaultPlayers = [];

const STORAGE_KEY = 'clash-tournament-state';

const roundLabels = {
  quarter: 'Quarter Finals',
  semi: 'Semi Finals',
  final: 'Grand Final',
};

const createMatches = (players, round) => {
  return players.reduce((acc, player, index) => {
    if (index % 2 === 0) {
      acc.push({
        id: `${round}-${index / 2 + 1}`,
        round,
        player1: players[index],
        player2: players[index + 1],
        winner: null,
      });
    }
    return acc;
  }, []);
};

const shuffle = (array) => {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const formatRoundLabel = (roundStr) => {
  if (!roundStr) return '';
  const m = String(roundStr).match(/round-(\d+)/);
  if (m) {
    const n = Number(m[1]);
    if (n === 2) return 'Grand Final';
    if (n === 4) return 'Semi Finals';
    if (n === 8) return 'Quarter Finals';
    return `Round of ${n}`;
  }
  return roundLabels[roundStr] || roundStr;
};

const nextPow2 = (n) => {
  if (n <= 1) return 1;
  return 1 << Math.ceil(Math.log2(n));
};

const createMatchesWithByes = (players, round) => {
  const seeded = shuffle(players);
  const target = nextPow2(seeded.length);
  const matchCount = target / 2;

  // initialize matches
  const slots = Array.from({ length: matchCount }, (_, i) => ({ player1: null, player2: null, id: `${round}-${i + 1}`, round }));

  // assign first slot to up to matchCount players
  for (let i = 0; i < Math.min(seeded.length, matchCount); i++) {
    slots[i].player1 = seeded[i];
  }

  // assign remaining players into second slots
  const remaining = seeded.slice(matchCount);
  for (let i = 0; i < remaining.length; i++) {
    const idx = i % matchCount;
    slots[idx].player2 = remaining[i];
  }

  // fill BYEs and compute winners for BYE matches
  return slots.map((s, idx) => {
    const player1 = s.player1 ?? { id: `bye-p1-${idx}`, name: 'BYE', isBye: true };
    const player2 = s.player2 ?? { id: `bye-p2-${idx}`, name: 'BYE', isBye: true };
    const winner = player1.isBye && !player2.isBye ? player2 : (!player1.isBye && player2.isBye ? player1 : null);
    return {
      id: s.id,
      round: s.round,
      player1,
      player2,
      winner,
    };
  });
};

const prevPow2 = (n) => {
  if (n <= 1) return 1;
  return 1 << Math.floor(Math.log2(n));
};

const createPlayInMatches = (players, _round) => {
  const seeded = shuffle(players);
  const n = seeded.length;
  const target = prevPow2(n);
  const playInMatches = n - target; // number of matches needed
  if (playInMatches <= 0) {
    return { matches: createMatches(seeded, _round), remainingSeeds: [] };
  }

  const playInPlayersCount = playInMatches * 2;
  const playInPlayers = seeded.slice(0, playInPlayersCount);
  const remainingSeeds = seeded.slice(playInPlayersCount);

  const matches = [];
  for (let i = 0; i < playInPlayersCount; i += 2) {
    matches.push({
      id: `playin-${i / 2 + 1}`,
      round: 'playin',
      player1: playInPlayers[i],
      player2: playInPlayers[i + 1],
      winner: null,
    });
  }

  return { matches, remainingSeeds };
};

function App() {
  // Simple auth state: user = { username, role }
  const [user, setUser] = useState(null);
  
  const [players, setPlayers] = useState(defaultPlayers);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState([]);
  const [bracketSize, setBracketSize] = useState(8);
  const [prelimMode, setPrelimMode] = useState('playin'); // 'playin' or 'byes'
  const [phase, setPhase] = useState('selection');
  const [round, setRound] = useState('quarter');
  const [matches, setMatches] = useState([]);
  const [champion, setChampion] = useState(null);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [prelimSeeds, setPrelimSeeds] = useState([]);
  const [playInPreviewIds, setPlayInPreviewIds] = useState([]);

  const selectedPlayers = useMemo(
    () => players.filter((player) => selectedPlayerIds.includes(player.id)),
    [selectedPlayerIds, players]
  );

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.players) setPlayers(parsed.players);
        if (parsed.selectedPlayerIds) setSelectedPlayerIds(parsed.selectedPlayerIds);
        if (parsed.phase) setPhase(parsed.phase);
        if (parsed.round) setRound(parsed.round);
        if (parsed.bracketSize) setBracketSize(parsed.bracketSize);
        if (parsed.prelimMode) setPrelimMode(parsed.prelimMode);
        if (parsed.matches) setMatches(parsed.matches);
        if (parsed.champion) setChampion(parsed.champion);
      } else {
        // fallback: load players from dedicated key if full state isn't present
        const pRaw = localStorage.getItem('clash-players');
        if (pRaw) {
          try {
            const p = JSON.parse(pRaw);
            if (Array.isArray(p)) setPlayers(p);
          } catch (e) {}
        }
      }
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    // on load, if token exists, validate with server
    const token = localStorage.getItem('clash-token');
    if (!token) return;
    (async () => {
      try {
        const resp = await fetch('/api/me', { headers: { Authorization: `Bearer ${token}` } });
        if (!resp.ok) {
          localStorage.removeItem('clash-token');
          localStorage.removeItem('clash-user');
          return;
        }
        const u = await resp.json();
        setUser(u);
        localStorage.setItem('clash-user', JSON.stringify(u));
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  useEffect(() => {
    const toStore = { players, selectedPlayerIds, phase, round, matches, champion, bracketSize, prelimMode };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
    } catch (e) {
      // ignore
    }
  }, [players, selectedPlayerIds, phase, round, matches, champion, bracketSize, prelimMode]);

  useEffect(() => {
    try {
      if (user) localStorage.setItem('clash-user', JSON.stringify(user));
      else {
        localStorage.removeItem('clash-user');
        localStorage.removeItem('clash-token');
      }
    } catch (e) {}
  }, [user]);

  useEffect(() => {
    // clear preview when selection changes
    setPlayInPreviewIds([]);
  }, [selectedPlayerIds, prelimMode]);

  const togglePlayer = (id) => {
    if (phase !== 'selection') return;
    setSelectedPlayerIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= bracketSize) return prev;
      return [...prev, id];
    });
  };

  const startTournament = () => {
    if (selectedPlayers.length < 2) return;
    const roundStr = `round-${selectedPlayers.length}`;
    let initial = [];
    if (prelimMode === 'byes') {
      initial = createMatchesWithByes(selectedPlayers, roundStr);
      setMatches(initial);
      setPrelimSeeds([]);
    } else {
      const res = createPlayInMatches(selectedPlayers, roundStr);
      setMatches(res.matches);
      setPrelimSeeds(res.remainingSeeds || []);
    }
    setPlayInPreviewIds([]);
    setPhase('bracket');
    setRound(roundStr);
    setChampion(null);
  };

  const addPlayer = () => {
    if (!user) return;
    const name = newPlayerName.trim();
    if (!name) return;
    const maxId = players.reduce((m, p) => Math.max(m, p.id), 0);
    const next = { id: maxId + 1, name };
    setPlayers((p) => [...p, next]);
    setNewPlayerName('');
    try {
      const pRaw = localStorage.getItem('clash-players');
      const current = pRaw ? JSON.parse(pRaw) : players;
      const updated = Array.isArray(current) ? [...current, next] : [next];
      localStorage.setItem('clash-players', JSON.stringify(updated));
    } catch (e) {}
  };

  const logout = () => {
    localStorage.removeItem('clash-token');
    localStorage.removeItem('clash-user');
    setUser(null);
  };

  const previewPlayIn = () => {
    if (prelimMode !== 'playin') return;
    if (selectedPlayers.length < 3) return;
    const res = createPlayInMatches(selectedPlayers, 'preview');
    const playinIds = res.matches.flatMap((m) => [m.player1?.id, m.player2?.id]).filter(Boolean);
    setPlayInPreviewIds(playinIds);
  };

  const setWinner = (matchId, playerId) => {
    setMatches((prevMatches) =>
      prevMatches.map((match) => {
        if (match.id !== matchId) return match;
        return {
          ...match,
          winner: match.player1.id === playerId ? match.player1 : match.player2,
        };
      })
    );
  };

  const canAdvance = matches.length > 0 && matches.every((match) => match.winner !== null);

  const advanceRound = () => {
    if (!canAdvance) return;
    const winners = matches.map((match) => match.winner);

    // If we're completing play-in matches, build the main bracket
    if (matches.length > 0 && matches[0].round === 'playin') {
      const mainSeeds = [...(prelimSeeds || []), ...winners];
      const nextRoundStr = `round-${mainSeeds.length}`;
      setRound(nextRoundStr);
      setMatches(createMatches(shuffle(mainSeeds), nextRoundStr));
      setPrelimSeeds([]);
      return;
    }

    if (winners.length === 1) {
      setChampion(winners[0]);
      setPhase('complete');
      return;
    }

    const nextRoundStr = `round-${winners.length}`;
    setRound(nextRoundStr);
    setMatches(createMatches(winners, nextRoundStr));
  };

  const resetTournament = () => {
    setSelectedPlayerIds([]);
    setPhase('selection');
    setRound('quarter');
    setMatches([]);
    setChampion(null);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <div className="logo-icon">🏆</div>
            <div className="logo-text">
              <h1>Clash Tournament</h1>
              <span>Player Pool Bracket</span>
            </div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            {user ? (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div style={{ color: '#f59e0b', fontWeight: 700 }}>{user.role.toUpperCase()}</div>
                <button onClick={logout} className="btn-reset">Logout</button>
              </div>
            ) : (
              <div>
                <a href="/login" style={{ color: '#f59e0b', fontWeight: 700 }}>Login</a>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="main">
        {phase === 'selection' && (
          <section className="selection-view">
            <div className="section-header">
              <div>
                <h2>Select {bracketSize} Players</h2>
                <p>Pick players from the pool. If the count is not a power of two, random BYEs will be assigned.</p>
              </div>
              <div className="selection-status">
                <label style={{ marginRight: 8 }}>Bracket size:</label>
                <select value={bracketSize} onChange={(e) => setBracketSize(Number(e.target.value))}>
                  <option value={4}>4</option>
                  <option value={8}>8</option>
                  <option value={16}>16</option>
                  <option value={32}>32</option>
                </select>
                <span style={{ marginLeft: 12 }}>{selectedPlayers.length}/{bracketSize} selected</span>
                {user && (
                  <>
                    <div style={{ marginLeft: 12, display: 'inline-block' }}>
                      <label style={{ marginRight: 8 }}>Prelim:</label>
                      <label style={{ marginRight: 6 }}>
                        <input type="radio" name="prelim" value="playin" checked={prelimMode === 'playin'} onChange={() => setPrelimMode('playin')} /> Play-in
                      </label>
                      <label>
                        <input type="radio" name="prelim" value="byes" checked={prelimMode === 'byes'} onChange={() => setPrelimMode('byes')} /> BYEs
                      </label>
                    </div>
                    <button className="btn-start" onClick={startTournament} disabled={selectedPlayers.length < 2}>
                      Start Tournament
                    </button>
                    {prelimMode === 'playin' && (
                      <button className="btn-generate" onClick={previewPlayIn} style={{ marginLeft: 8 }} type="button">
                        Preview Play-in
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
            {user ? (
              <div className="player-controls" style={{ marginBottom: 12 }}>
                <input
                  type="text"
                  placeholder="Add player name"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
                  style={{ padding: '0.5rem', borderRadius: 8, marginRight: 8 }}
                />
                <button className="btn-generate" onClick={addPlayer} type="button">
                  Add Player
                </button>
              </div>
            ) : (
              <div style={{ marginBottom: 12, color: '#94a3b8' }}>Login as admin to add players and start the tournament.</div>
            )}

            <div className="player-pool">
              {players.map((player) => {
                const selected = selectedPlayerIds.includes(player.id);
                const isPlayIn = playInPreviewIds.includes(player.id);
                return (
                  <button
                    key={player.id}
                    className={`player-card ${selected ? 'selected' : ''}`}
                    type="button"
                    onClick={() => togglePlayer(player.id)}
                  >
                    <span>{player.name}</span>
                    {selected && <span className="player-flag">Selected</span>}
                    {isPlayIn && <span style={{ marginLeft: 8, color: '#f59e0b', fontWeight: 700 }}>Play-in</span>}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {(phase === 'bracket' || phase === 'complete') && (
          <section className="bracket-view">
            <div className="section-header bracket-header">
              <div>
                <h2>{formatRoundLabel(round)}</h2>
                <p>Pick the winner for each match to advance to the next stage.</p>
              </div>
              <div className="action-group">
                {user && (
                  <button className="btn-reset" onClick={resetTournament} type="button">
                    Reset
                  </button>
                )}
                {user && phase === 'bracket' && (
                  <button className="btn-advance" onClick={advanceRound} disabled={!canAdvance} type="button">
                    Advance Winners
                  </button>
                )}
                {user?.role === 'superadmin' && (
                  <button
                    className="btn-reset"
                    onClick={() => {
                      localStorage.clear();
                      location.reload();
                    }}
                    type="button"
                  >
                    Reset All (Super)
                  </button>
                )}
              </div>
            </div>

            <div className="matches-grid">
              {matches.map((match) => (
                <div key={match.id} className="match-card">
                  <div className="match-header">
                    <span>{match.id.toUpperCase()}</span>
                    <span>{match.round === 'playin' ? 'Play-in' : formatRoundLabel(match.round)}</span>
                  </div>
                  <button
                    type="button"
                    className={`match-player ${match.winner?.id === match.player1.id ? 'winner' : ''}`}
                    onClick={() => setWinner(match.id, match.player1.id)}
                  >
                    <span>{match.player1.name}</span>
                    {match.winner?.id === match.player1.id && <span className="match-winner">Winner</span>}
                  </button>
                  <button
                    type="button"
                    className={`match-player ${match.winner?.id === match.player2.id ? 'winner' : ''}`}
                    onClick={() => setWinner(match.id, match.player2.id)}
                  >
                    <span>{match.player2.name}</span>
                    {match.winner?.id === match.player2.id && <span className="match-winner">Winner</span>}
                  </button>
                </div>
              ))}
            </div>

            {phase === 'complete' && champion && (
              <div className="champion-banner">
                <div className="champion-content">
                  <div className="champion-trophy">🏅</div>
                  <div>
                    <p>Champion</p>
                    <h2>{champion.name}</h2>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}
      </main>

      <footer className="footer">
        <p>Clash Tournament Manager © 2026</p>
      </footer>
    </div>
  );
}

export default App;
