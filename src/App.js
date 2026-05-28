import React, { useState, useEffect } from 'react';
import './App.css';

// SVG Icons as components
const TrophyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
    <path d="M4 22h16"/>
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
  </svg>
);

const SwordIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/>
    <line x1="13" y1="19" x2="19" y2="13"/>
    <line x1="16" y1="16" x2="20" y2="20"/>
    <line x1="19" y1="21" x2="21" y2="19"/>
  </svg>
);

const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const CrownIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/>
  </svg>
);

const ChevronDown = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const ChevronUp = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15"/>
  </svg>
);

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const FlameIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
  </svg>
);

// Clan badge colors
const clanColors = [
  { bg: '#ef4444', border: '#b91c1c' },
  { bg: '#3b82f6', border: '#1d4ed8' },
  { bg: '#10b981', border: '#047857' },
  { bg: '#f59e0b', border: '#b45309' },
  { bg: '#8b5cf6', border: '#6d28d9' },
  { bg: '#ec4899', border: '#be185d' },
  { bg: '#06b6d4', border: '#0e7490' },
  { bg: '#f97316', border: '#c2410c' },
];

const getClanColor = (index) => clanColors[index % clanColors.length];

const ClanBadge = ({ name, index, size = 'md' }) => {
  const colors = getClanColor(index);
  const sizeClasses = {
    sm: { width: 32, height: 32, fontSize: 14 },
    md: { width: 40, height: 40, fontSize: 16 },
    lg: { width: 48, height: 48, fontSize: 20 },
  };
  const s = sizeClasses[size];

  return (
    <div 
      className="clan-badge"
      style={{
        width: s.width,
        height: s.height,
        backgroundColor: colors.bg,
        border: `2px solid ${colors.border}`,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: s.fontSize,
        flexShrink: 0,
        boxShadow: `0 2px 8px ${colors.bg}40`,
      }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
};

// Initial tournament data
const initialClans = [
  { id: 1, name: 'Dragon Fury', wins: 0, losses: 0, stars: 0 },
  { id: 2, name: 'Iron Wolves', wins: 0, losses: 0, stars: 0 },
  { id: 3, name: 'Shadow Legion', wins: 0, losses: 0, stars: 0 },
  { id: 4, name: 'Storm Breakers', wins: 0, losses: 0, stars: 0 },
  { id: 5, name: 'Crystal Guard', wins: 0, losses: 0, stars: 0 },
  { id: 6, name: 'Phoenix Rise', wins: 0, losses: 0, stars: 0 },
  { id: 7, name: 'Dark Knights', wins: 0, losses: 0, stars: 0 },
  { id: 8, name: 'Golden Eagles', wins: 0, losses: 0, stars: 0 },
];

const generateMatches = (clans) => {
  const shuffled = [...clans].sort(() => Math.random() - 0.5);
  const matches = [];
  for (let i = 0; i < shuffled.length; i += 2) {
    matches.push({
      id: `q${i/2 + 1}`,
      round: 'quarter',
      clan1: shuffled[i],
      clan2: shuffled[i + 1],
      score1: null,
      score2: null,
      status: 'pending',
      winner: null,
    });
  }
  return matches;
};

const App = () => {
  const [activeTab, setActiveTab] = useState('bracket');
  const [clans, setClans] = useState(initialClans);
  const [matches, setMatches] = useState(() => generateMatches(initialClans));
  const [semiMatches, setSemiMatches] = useState([]);
  const [finalMatch, setFinalMatch] = useState(null);
  const [thirdPlaceMatch, setThirdPlaceMatch] = useState(null);
  const [champion, setChampion] = useState(null);
  const [editingMatch, setEditingMatch] = useState(null);
  const [expandedRounds, setExpandedRounds] = useState({
    quarter: true,
    semi: true,
    final: true,
    third: true,
  });

  const toggleRound = (round) => {
    setExpandedRounds(prev => ({ ...prev, [round]: !prev[round] }));
  };

  const updateMatchScore = (matchId, round, score1, score2) => {
    const num1 = parseInt(score1) || 0;
    const num2 = parseInt(score2) || 0;

    if (round === 'quarter') {
      setMatches(prev => prev.map(m => {
        if (m.id === matchId) {
          const winner = num1 > num2 ? m.clan1 : num2 > num1 ? m.clan2 : null;
          return { ...m, score1: num1, score2: num2, winner, status: winner ? 'completed' : 'pending' };
        }
        return m;
      }));
    } else if (round === 'semi') {
      setSemiMatches(prev => prev.map(m => {
        if (m.id === matchId) {
          const winner = num1 > num2 ? m.clan1 : num2 > num1 ? m.clan2 : null;
          return { ...m, score1: num1, score2: num2, winner, status: winner ? 'completed' : 'pending' };
        }
        return m;
      }));
    } else if (round === 'final') {
      setFinalMatch(prev => {
        if (!prev) return prev;
        const winner = num1 > num2 ? prev.clan1 : num2 > num1 ? prev.clan2 : null;
        if (winner) setChampion(winner);
        return { ...prev, score1: num1, score2: num2, winner, status: winner ? 'completed' : 'pending' };
      });
    } else if (round === 'third') {
      setThirdPlaceMatch(prev => {
        if (!prev) return prev;
        const winner = num1 > num2 ? prev.clan1 : num2 > num1 ? prev.clan2 : null;
        return { ...prev, score1: num1, score2: num2, winner, status: winner ? 'completed' : 'pending' };
      });
    }
    setEditingMatch(null);
  };

  const generateSemiFinals = () => {
    const winners = matches.filter(m => m.winner).map(m => m.winner);
    if (winners.length !== 4) return;

    const newSemi = [
      {
        id: 's1',
        round: 'semi',
        clan1: winners[0],
        clan2: winners[1],
        score1: null,
        score2: null,
        status: 'pending',
        winner: null,
      },
      {
        id: 's2',
        round: 'semi',
        clan1: winners[2],
        clan2: winners[3],
        score1: null,
        score2: null,
        status: 'pending',
        winner: null,
      },
    ];
    setSemiMatches(newSemi);
  };

  const generateFinals = () => {
    const semiWinners = semiMatches.filter(m => m.winner).map(m => m.winner);
    const semiLosers = semiMatches.filter(m => m.winner).map(m => {
      return m.winner.id === m.clan1.id ? m.clan2 : m.clan1;
    });

    if (semiWinners.length === 2) {
      setFinalMatch({
        id: 'f1',
        round: 'final',
        clan1: semiWinners[0],
        clan2: semiWinners[1],
        score1: null,
        score2: null,
        status: 'pending',
        winner: null,
      });
    }

    if (semiLosers.length === 2) {
      setThirdPlaceMatch({
        id: 't1',
        round: 'third',
        clan1: semiLosers[0],
        clan2: semiLosers[1],
        score1: null,
        score2: null,
        status: 'pending',
        winner: null,
      });
    }
  };

  const resetTournament = () => {
    const newClans = initialClans.map(c => ({ ...c, wins: 0, losses: 0, stars: 0 }));
    setClans(newClans);
    setMatches(generateMatches(newClans));
    setSemiMatches([]);
    setFinalMatch(null);
    setThirdPlaceMatch(null);
    setChampion(null);
    setEditingMatch(null);
  };

  useEffect(() => {
    const allMatches = [...matches, ...semiMatches];
    if (finalMatch) allMatches.push(finalMatch);
    if (thirdPlaceMatch) allMatches.push(thirdPlaceMatch);

    const newClans = clans.map(clan => {
      let wins = 0, losses = 0, stars = 0;
      allMatches.forEach(m => {
        if (m.status === 'completed') {
          if (m.clan1.id === clan.id) {
            stars += m.score1 || 0;
            if (m.winner?.id === clan.id) wins++;
            else losses++;
          } else if (m.clan2.id === clan.id) {
            stars += m.score2 || 0;
            if (m.winner?.id === clan.id) wins++;
            else losses++;
          }
        }
      });
      return { ...clan, wins, losses, stars };
    });
    setClans(newClans);
  }, [matches, semiMatches, finalMatch, thirdPlaceMatch]);

  const MatchCard = ({ match, round }) => {
    const isEditing = editingMatch === match.id;
    const [tempScore1, setTempScore1] = useState(match.score1 || '');
    const [tempScore2, setTempScore2] = useState(match.score2 || '');

    const handleSave = () => {
      updateMatchScore(match.id, round, tempScore1, tempScore2);
    };

    const clan1Index = clans.findIndex(c => c.id === match.clan1.id);
    const clan2Index = clans.findIndex(c => c.id === match.clan2.id);

    return (
      <div className={`match-card ${match.status === 'completed' ? 'completed' : ''} ${match.winner ? 'has-winner' : ''}`}>
        <div className="match-header">
          <span className="match-label">
            {round === 'quarter' && 'Quarter Final'}
            {round === 'semi' && 'Semi Final'}
            {round === 'final' && 'Grand Final'}
            {round === 'third' && '3rd Place'}
          </span>
          {match.status === 'completed' && (
            <span className="match-status completed">Completed</span>
          )}
          {match.status === 'pending' && (
            <span className="match-status pending">Pending</span>
          )}
        </div>

        <div className="match-teams">
          <div className={`team-row ${match.winner?.id === match.clan1.id ? 'winner' : ''}`}>
            <div className="team-info">
              <ClanBadge name={match.clan1.name} index={clan1Index} size="sm" />
              <span className="team-name">{match.clan1.name}</span>
            </div>
            {isEditing ? (
              <input 
                type="number" 
                className="score-input"
                value={tempScore1}
                onChange={(e) => setTempScore1(e.target.value)}
                min="0"
                max="3"
              />
            ) : (
              <span className={`team-score ${match.winner?.id === match.clan1.id ? 'winner-score' : ''}`}>
                {match.score1 !== null ? match.score1 : '-'}
              </span>
            )}
          </div>

          <div className="match-divider">
            <span className="vs-text">VS</span>
          </div>

          <div className={`team-row ${match.winner?.id === match.clan2.id ? 'winner' : ''}`}>
            <div className="team-info">
              <ClanBadge name={match.clan2.name} index={clan2Index} size="sm" />
              <span className="team-name">{match.clan2.name}</span>
            </div>
            {isEditing ? (
              <input 
                type="number" 
                className="score-input"
                value={tempScore2}
                onChange={(e) => setTempScore2(e.target.value)}
                min="0"
                max="3"
              />
            ) : (
              <span className={`team-score ${match.winner?.id === match.clan2.id ? 'winner-score' : ''}`}>
                {match.score2 !== null ? match.score2 : '-'}
              </span>
            )}
          </div>
        </div>

        <div className="match-actions">
          {isEditing ? (
            <button className="btn-save" onClick={handleSave}>
              <CheckIcon /> Save
            </button>
          ) : (
            <button className="btn-edit" onClick={() => {
              setTempScore1(match.score1 || '');
              setTempScore2(match.score2 || '');
              setEditingMatch(match.id);
            }}>
              <EditIcon /> Edit Score
            </button>
          )}
        </div>
      </div>
    );
  };

  const sortedClans = [...clans].sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    if (b.stars !== a.stars) return b.stars - a.stars;
    return a.losses - b.losses;
  });

  const quarterCompleted = matches.every(m => m.status === 'completed');
  const semiCompleted = semiMatches.length > 0 && semiMatches.every(m => m.status === 'completed');

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <div className="logo-icon">
              <ShieldIcon />
            </div>
            <div className="logo-text">
              <h1>Clash Tournament</h1>
              <span>Season 2026</span>
            </div>
          </div>
          <nav className="nav">
            <button 
              className={`nav-btn ${activeTab === 'bracket' ? 'active' : ''}`}
              onClick={() => setActiveTab('bracket')}
            >
              <TrophyIcon />
              <span>Bracket</span>
            </button>
            <button 
              className={`nav-btn ${activeTab === 'standings' ? 'active' : ''}`}
              onClick={() => setActiveTab('standings')}
            >
              <CrownIcon />
              <span>Standings</span>
            </button>
            <button 
              className={`nav-btn ${activeTab === 'clans' ? 'active' : ''}`}
              onClick={() => setActiveTab('clans')}
            >
              <SwordIcon />
              <span>Clans</span>
            </button>
          </nav>
        </div>
      </header>

      {champion && (
        <div className="champion-banner">
          <div className="champion-content">
            <div className="champion-trophy">🏆</div>
            <div className="champion-info">
              <span className="champion-label">Tournament Champion</span>
              <h2>{champion.name}</h2>
            </div>
            <div className="champion-trophy">🏆</div>
          </div>
        </div>
      )}

      <main className="main">
        {activeTab === 'bracket' && (
          <div className="bracket-view">
            <div className="round-section">
              <button className="round-header" onClick={() => toggleRound('quarter')}>
                <div className="round-title">
                  <FlameIcon />
                  <h3>Quarter Finals</h3>
                  <span className="round-count">{matches.filter(m => m.status === 'completed').length}/{matches.length}</span>
                </div>
                {expandedRounds.quarter ? <ChevronUp /> : <ChevronDown />}
              </button>

              {expandedRounds.quarter && (
                <div className="matches-grid">
                  {matches.map(match => (
                    <MatchCard key={match.id} match={match} round="quarter" />
                  ))}
                </div>
              )}

              {quarterCompleted && semiMatches.length === 0 && (
                <button className="btn-generate" onClick={generateSemiFinals}>
                  Generate Semi Finals →
                </button>
              )}
            </div>

            {semiMatches.length > 0 && (
              <div className="round-section">
                <button className="round-header" onClick={() => toggleRound('semi')}>
                  <div className="round-title">
                    <FlameIcon />
                    <h3>Semi Finals</h3>
                    <span className="round-count">{semiMatches.filter(m => m.status === 'completed').length}/{semiMatches.length}</span>
                  </div>
                  {expandedRounds.semi ? <ChevronUp /> : <ChevronDown />}
                </button>

                {expandedRounds.semi && (
                  <div className="matches-grid">
                    {semiMatches.map(match => (
                      <MatchCard key={match.id} match={match} round="semi" />
                    ))}
                  </div>
                )}

                {semiCompleted && !finalMatch && (
                  <button className="btn-generate" onClick={generateFinals}>
                    Generate Finals →
                  </button>
                )}
              </div>
            )}

            {(finalMatch || thirdPlaceMatch) && (
              <div className="round-section finals-section">
                <button className="round-header" onClick={() => toggleRound('final')}>
                  <div className="round-title">
                    <TrophyIcon />
                    <h3>Grand Final</h3>
                  </div>
                  {expandedRounds.final ? <ChevronUp /> : <ChevronDown />}
                </button>

                {expandedRounds.final && finalMatch && (
                  <div className="matches-grid final-match">
                    <MatchCard match={finalMatch} round="final" />
                  </div>
                )}
              </div>
            )}

            {thirdPlaceMatch && (
              <div className="round-section">
                <button className="round-header" onClick={() => toggleRound('third')}>
                  <div className="round-title">
                    <CrownIcon />
                    <h3>3rd Place Match</h3>
                  </div>
                  {expandedRounds.third ? <ChevronUp /> : <ChevronDown />}
                </button>

                {expandedRounds.third && (
                  <div className="matches-grid">
                    <MatchCard match={thirdPlaceMatch} round="third" />
                  </div>
                )}
              </div>
            )}

            <button className="btn-reset" onClick={resetTournament}>
              Reset Tournament
            </button>
          </div>
        )}

        {activeTab === 'standings' && (
          <div className="standings-view">
            <div className="standings-card">
              <h2>Tournament Standings</h2>
              <div className="standings-table">
                <div className="table-header">
                  <span>Rank</span>
                  <span>Clan</span>
                  <span>W</span>
                  <span>L</span>
                  <span>Stars</span>
                </div>
                {sortedClans.map((clan, index) => (
                  <div key={clan.id} className={`table-row ${index < 3 ? 'top-' + (index + 1) : ''}`}>
                    <span className="rank">
                      {index === 0 && '🥇'}
                      {index === 1 && '🥈'}
                      {index === 2 && '🥉'}
                      {index > 2 && `#${index + 1}`}
                    </span>
                    <div className="clan-cell">
                      <ClanBadge name={clan.name} index={index} size="sm" />
                      <span>{clan.name}</span>
                    </div>
                    <span className="wins">{clan.wins}</span>
                    <span className="losses">{clan.losses}</span>
                    <span className="stars">{clan.stars}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'clans' && (
          <div className="clans-view">
            <h2>Participating Clans</h2>
            <div className="clans-grid">
              {clans.map((clan, index) => (
                <div key={clan.id} className="clan-card">
                  <ClanBadge name={clan.name} index={index} size="lg" />
                  <h3>{clan.name}</h3>
                  <div className="clan-stats">
                    <div className="stat">
                      <span className="stat-value">{clan.wins}</span>
                      <span className="stat-label">Wins</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">{clan.losses}</span>
                      <span className="stat-label">Losses</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">{clan.stars}</span>
                      <span className="stat-label">Stars</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>Clash of Clans Tournament Manager © 2026</p>
      </footer>
    </div>
  );
};

export default App;
