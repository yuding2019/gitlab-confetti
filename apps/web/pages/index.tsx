import confetti from 'canvas-confetti';

import { EdgeIcon } from '../components/Icon/Edge';
import { CheckLine } from '../components/Icon/CheckLine';

import styles from './page.module.css';
import { useState } from 'react';
import { GitMerge } from '../components/Icon/GitMerge';
import { ChromeIcon } from '../components/Icon/Chrome';

function fireworks() {
  const duration = 5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval = window.setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    });
  }, 250);
}

export default function Home() {
  const [approved, setApproved] = useState(false);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.glMerge}>
          <h1>
            feat(<span className={styles.glLink}>GitLab Confetti</span>): 每一个
            Commit 都值得被庆祝
          </h1>
          <div className={styles.glOverviewWrap}>
            <div className={styles.glOverview}>Overview</div>
          </div>
          <div className={styles.glMrBlock}>
            <CheckLine className={styles.icon} />
            <span>Detached merge request pipeline</span>
          </div>
          <div className={styles.glMrBlock}>
            <button
              className={styles.approve}
              onClick={() => {
                setApproved(!approved);
                if (!approved) {
                  fireworks();
                }
              }}
            >
              {approved ? 'Approved!' : 'Approve'}
            </button>
            {approved && <span>Approved by you!</span>}
          </div>
          <div className={styles.glMrBlock}>
            <GitMerge className={approved ? styles.merged : styles.merge} />
            {approved ? (
              <>
                <span>You can merge now!</span>
              </>
            ) : (
              <span>Waiting for approval</span>
            )}
          </div>
          <div className={styles.glMrBlock}>
            <CheckLine className={styles.icon} />
            <span>Pipeline passed</span>
          </div>
        </div>
        <button className={styles.thumb} onClick={() => fireworks()}>
          👍
        </button>

        <div className={styles.ctas}>
          <a
            className={styles.primary}
            href="https://microsoftedge.microsoft.com/addons/detail/gitlab-confetti/aikpafbhafabmhmhgkgbdgbcojjjkkak"
            target="_blank"
            rel="noopener noreferrer"
          >
            <EdgeIcon className={styles.edgeIcon} />
            前往 Edge 扩展商店
          </a>
          <a
            className={styles.secondary}
            href="https://chromewebstore.google.com/detail/gitlab-confetti/mndcjildkhcbefhicemomejgafmakcfo"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ChromeIcon className={styles.edgeIcon} />
            前往 Chrome 扩展商店
          </a>
          <a href="./gitlab-confetti.zip" download="gitlab-confetti.zip">
            下载 ZIP
          </a>
        </div>
      </main>
      <footer className={styles.footer}>
        <a href="https://www.kirilv.com/canvas-confetti/" target="_blank">
          canvas-confetti : 🎉 performant confetti animation in the browser
        </a>
      </footer>
    </div>
  );
}
