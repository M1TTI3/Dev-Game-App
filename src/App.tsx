import { useMemo, useState } from 'react';
import { ProgressBar } from './components/ProgressBar';
import { buildGoals, confidenceLevels, learnReasons } from './data/options';

type Screen =
  | 'welcome'
  | 'onboarding'
  | 'path'
  | 'dashboard'
  | 'mission'
  | 'challenge'
  | 'reward';

type OnboardingAnswers = {
  codedBefore: 'yes' | 'no' | null;
  buildGoal: string | null;
  reason: string | null;
  confidence: string | null;
};

type PlayerState = {
  xp: number;
  coins: number;
  streak: number;
  level: number;
  missionDone: boolean;
};

const defaultAnswers: OnboardingAnswers = {
  codedBefore: null,
  buildGoal: null,
  reason: null,
  confidence: null,
};

const defaultPlayer: PlayerState = {
  xp: 40,
  coins: 120,
  streak: 1,
  level: 1,
  missionDone: false,
};

export function App() {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [answers, setAnswers] = useState<OnboardingAnswers>(defaultAnswers);
  const [challengeInput, setChallengeInput] = useState('');
  const [player, setPlayer] = useState<PlayerState>(defaultPlayer);
  const [error, setError] = useState('');
  const [rewardBurst, setRewardBurst] = useState(false);

  // Scope decision for V1: one guided path keeps the product focused.
  const selectedPath = useMemo(() => {
    return {
      name: 'Web Dev Explorer',
      reason:
        'For beginners, web development gives instant visual feedback. You type code and immediately see a result, which feels rewarding and builds confidence fast.',
      firstSkill: 'Variables and string output with JavaScript',
    };
  }, []);

  const onboardingProgress = useMemo(() => {
    const picked = [answers.codedBefore, answers.buildGoal, answers.reason, answers.confidence].filter(
      Boolean,
    ).length;
    return { picked, total: 4 };
  }, [answers]);

  const canContinueFromOnboarding = onboardingProgress.picked === onboardingProgress.total;

  const completeChallenge = () => {
    const expected = 'const heroName = "Nova";';
    if (challengeInput.trim() !== expected) {
      setError('Almost there — match the code exactly so the mission can run.');
      return;
    }

    setError('');
    setRewardBurst(true);
    setPlayer((prev) => ({
      ...prev,
      xp: prev.xp + 80,
      coins: prev.coins + 35,
      streak: prev.streak + 1,
      level: 2,
      missionDone: true,
    }));

    window.setTimeout(() => {
      setRewardBurst(false);
      setScreen('reward');
    }, 1200);
  };

  return (
    <div className="app-shell">
      <main className="phone-frame">
        {screen === 'welcome' && (
          <section className="card page hero-card">
            <p className="eyebrow">CODEQUEST</p>
            <h1>From curious beginner to real developer.</h1>
            <p className="muted">
              Build tiny projects, debug real mistakes, and level up with every mission.
            </p>
            <div className="hero-pills">
              <span>⚡ Fast wins</span>
              <span>🧩 Real coding</span>
              <span>🏆 Game-like progress</span>
            </div>
            <button className="btn-primary" onClick={() => setScreen('onboarding')}>
              Start your journey
            </button>
          </section>
        )}

        {screen === 'onboarding' && (
          <section className="card page">
            <div className="row-between">
              <p className="eyebrow">SETUP YOUR QUEST</p>
              <span className="muted tiny">
                {onboardingProgress.picked}/{onboardingProgress.total}
              </span>
            </div>
            <ProgressBar
              label="Profile setup"
              value={onboardingProgress.picked}
              max={onboardingProgress.total}
            />
            <h2>Let’s build your starter path</h2>
            <p className="muted">Quick picks now, smarter missions next.</p>

            <div className="stack">
              <label>Have you coded before?</label>
              <div className="chips">
                {['yes', 'no'].map((value) => (
                  <button
                    key={value}
                    className={answers.codedBefore === value ? 'chip selected' : 'chip'}
                    onClick={() => setAnswers((a) => ({ ...a, codedBefore: value as 'yes' | 'no' }))}
                  >
                    {value === 'yes' ? 'Yes, a little' : 'No, I am brand new'}
                  </button>
                ))}
              </div>

              <label>What do you want to build first?</label>
              <div className="chips">
                {buildGoals.map((goal) => (
                  <button
                    key={goal}
                    className={answers.buildGoal === goal ? 'chip selected' : 'chip'}
                    onClick={() => setAnswers((a) => ({ ...a, buildGoal: goal }))}
                  >
                    {goal}
                  </button>
                ))}
              </div>

              <label>What is your main reason for learning?</label>
              <div className="chips">
                {learnReasons.map((reason) => (
                  <button
                    key={reason}
                    className={answers.reason === reason ? 'chip selected' : 'chip'}
                    onClick={() => setAnswers((a) => ({ ...a, reason }))}
                  >
                    {reason}
                  </button>
                ))}
              </div>

              <label>How confident do you feel right now?</label>
              <div className="chips">
                {confidenceLevels.map((level) => (
                  <button
                    key={level}
                    className={answers.confidence === level ? 'chip selected' : 'chip'}
                    onClick={() => setAnswers((a) => ({ ...a, confidence: level }))}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <button
              className="btn-primary"
              disabled={!canContinueFromOnboarding}
              onClick={() => setScreen('path')}
            >
              Reveal my path
            </button>
          </section>
        )}

        {screen === 'path' && (
          <section className="card page path-card">
            <p className="eyebrow">YOUR STARTER PATH</p>
            <h2>{selectedPath.name}</h2>
            <p>{selectedPath.reason}</p>
            <div className="focus-box">
              <span className="tiny muted">FIRST SKILL</span>
              <strong>{selectedPath.firstSkill}</strong>
            </div>
            <button className="btn-primary" onClick={() => setScreen('dashboard')}>
              Enter dashboard
            </button>
          </section>
        )}

        {screen === 'dashboard' && (
          <section className="page">
            <div className="card dashboard-head">
              <div className="row-between">
                <p className="eyebrow">MISSION HQ</p>
                <span className="level-chip">Level {player.level}</span>
              </div>
              <h2>Ready for today’s coding run?</h2>
              <div className="stats-row">
                <div className="stat-pill">⭐ XP {player.xp}</div>
                <div className="stat-pill">🪙 Coins {player.coins}</div>
                <div className="stat-pill">🔥 {player.streak} day streak</div>
              </div>
              <ProgressBar label="Level Progress" value={player.xp} max={200} />
            </div>

            <div className="card quest-card">
              <div className="row-between">
                <h3>Mission 1: Name your hero</h3>
                <span className="difficulty">Easy</span>
              </div>
              <p className="muted">
                Learn a real coding building block: variables. Finish this to unlock your next quest.
              </p>
              <div className="reward-row">
                <span>+80 XP</span>
                <span>+35 Coins</span>
              </div>
              <button className="btn-primary" onClick={() => setScreen('mission')}>
                Start mission
              </button>
            </div>
          </section>
        )}

        {screen === 'mission' && (
          <section className="card page">
            <p className="eyebrow">MISSION 1 BRIEF</p>
            <h2>Name your hero</h2>
            <p className="muted">
              Goal: create your first JavaScript variable so your game character has a name.
            </p>
            <div className="focus-box">
              <span className="tiny muted">SUCCESS CHECKLIST</span>
              <ul>
                <li>Use the keyword <code>const</code></li>
                <li>Create the variable <code>heroName</code></li>
                <li>Store the text <code>"Nova"</code></li>
              </ul>
            </div>
            <button className="btn-primary" onClick={() => setScreen('challenge')}>
              Open coding challenge
            </button>
          </section>
        )}

        {screen === 'challenge' && (
          <section className="card page challenge-card">
            {rewardBurst && (
              <div className="reward-burst" aria-live="polite">
                <span>+80 XP</span>
                <span>+35 Coins</span>
              </div>
            )}
            <p className="eyebrow">CHALLENGE</p>
            <h2>Write this exact line of code</h2>
            <p className="muted">Expected output: your hero is now named “Nova”.</p>

            <pre className="code-block">const heroName = "Nova";</pre>
            <textarea
              value={challengeInput}
              onChange={(e) => setChallengeInput(e.target.value)}
              placeholder='Type: const heroName = "Nova";'
              rows={5}
            />

            {error && <p className="error-text">{error}</p>}

            <button className="btn-primary" onClick={completeChallenge}>
              Run mission check
            </button>
          </section>
        )}

        {screen === 'reward' && (
          <section className="card page reward-screen">
            <p className="eyebrow">MISSION COMPLETE</p>
            <h2>Nice win. You just wrote working code.</h2>
            <p>Your developer profile just leveled up — keep the streak alive tomorrow.</p>
            <div className="reward-grid">
              <div className="reward">⭐ +80 XP</div>
              <div className="reward">🪙 +35 Coins</div>
              <div className="reward">🚀 Level 2 unlocked</div>
            </div>
            <button className="btn-primary" onClick={() => setScreen('dashboard')}>
              Back to dashboard
            </button>
          </section>
        )}
      </main>
    </div>
  );
}
