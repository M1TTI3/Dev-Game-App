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

  // Scope decision for V1: one guided path keeps the product focused.
  const selectedPath = useMemo(() => {
    return {
      name: 'Web Dev Explorer',
      reason:
        'For beginners, web development gives instant visual feedback. You type code and immediately see a result, which feels rewarding and builds confidence fast.',
      firstSkill: 'Variables and string output with JavaScript',
    };
  }, []);

  const canContinueFromOnboarding =
    answers.codedBefore && answers.buildGoal && answers.reason && answers.confidence;

  const completeChallenge = () => {
    const expected = 'const heroName = "Nova";';
    if (challengeInput.trim() !== expected) {
      setError('Almost there — match the code exactly so the mission can run.');
      return;
    }

    setError('');
    setPlayer((prev) => ({
      ...prev,
      xp: prev.xp + 80,
      coins: prev.coins + 35,
      streak: prev.streak + 1,
      level: 2,
      missionDone: true,
    }));
    setScreen('reward');
  };

  return (
    <div className="app-shell">
      <main className="phone-frame">
        {screen === 'welcome' && (
          <section className="card page">
            <p className="eyebrow">CODEQUEST</p>
            <h1>Learn coding like a game, not a textbook.</h1>
            <p className="muted">
              Build small projects, fix bugs, earn XP, and level up your developer skills.
            </p>
            <button className="btn-primary" onClick={() => setScreen('onboarding')}>
              Start your journey
            </button>
          </section>
        )}

        {screen === 'onboarding' && (
          <section className="card page">
            <p className="eyebrow">ONBOARDING</p>
            <h2>Tell us about you</h2>
            <p className="muted">This helps us tailor your first missions.</p>

            <div className="stack">
              <label>Have you coded before?</label>
              <div className="chips">
                {['yes', 'no'].map((value) => (
                  <button
                    key={value}
                    className={answers.codedBefore === value ? 'chip selected' : 'chip'}
                    onClick={() => setAnswers((a) => ({ ...a, codedBefore: value as 'yes' | 'no' }))}
                  >
                    {value === 'yes' ? 'Yes' : 'No'}
                  </button>
                ))}
              </div>

              <label>What do you want to build?</label>
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

              <label>Why do you want to learn?</label>
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

              <label>How confident are you?</label>
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
              See my learning path
            </button>
          </section>
        )}

        {screen === 'path' && (
          <section className="card page">
            <p className="eyebrow">YOUR STARTER PATH</p>
            <h2>{selectedPath.name}</h2>
            <p>{selectedPath.reason}</p>
            <p className="muted">
              First focus: <strong>{selectedPath.firstSkill}</strong>
            </p>
            <button className="btn-primary" onClick={() => setScreen('dashboard')}>
              Enter dashboard
            </button>
          </section>
        )}

        {screen === 'dashboard' && (
          <section className="page">
            <div className="card">
              <p className="eyebrow">DASHBOARD</p>
              <h2>Welcome back, Builder</h2>
              <div className="stats-row">
                <div className="stat-pill">⭐ XP: {player.xp}</div>
                <div className="stat-pill">🪙 Coins: {player.coins}</div>
                <div className="stat-pill">🔥 Streak: {player.streak}</div>
              </div>
              <ProgressBar label="Level Progress" value={player.xp} max={200} />
            </div>

            <div className="card">
              <h3>Mission 1: Name your hero</h3>
              <p className="muted">
                Learn variables by creating a hero name in JavaScript. Small win, real concept.
              </p>
              <button className="btn-primary" onClick={() => setScreen('mission')}>
                Start mission
              </button>
            </div>
          </section>
        )}

        {screen === 'mission' && (
          <section className="card page">
            <p className="eyebrow">MISSION 1</p>
            <h2>Name your hero</h2>
            <ol>
              <li>Create a variable called <code>heroName</code>.</li>
              <li>Store the text <code>"Nova"</code>.</li>
              <li>Use <code>const</code> because the name will not change.</li>
            </ol>
            <button className="btn-primary" onClick={() => setScreen('challenge')}>
              Open coding challenge
            </button>
          </section>
        )}

        {screen === 'challenge' && (
          <section className="card page">
            <p className="eyebrow">CHALLENGE</p>
            <h2>Write this line of code</h2>
            <p className="muted">Tip: This teaches variable declaration and string syntax.</p>

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
          <section className="card page">
            <p className="eyebrow">MISSION COMPLETE</p>
            <h2>Great work, developer.</h2>
            <p>You wrote real code, fixed syntax, and completed your first build step.</p>
            <div className="reward-grid">
              <div className="reward">+80 XP</div>
              <div className="reward">+35 Coins</div>
              <div className="reward">Level 2 unlocked</div>
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
