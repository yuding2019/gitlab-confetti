import confetti from 'canvas-confetti';

import { EdgeIcon } from '../components/Icon/Edge';
import { CheckLine } from '../components/Icon/CheckLine';

import styles from './page.module.css';

function fireworks() {
  const duration = 5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function () {
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
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.glMerge}>
          <h1>
            feat(<span className={styles.glLink}>GitLab Confetti</span>): 每一个
            Commit 都应该被庆祝
          </h1>
          <div className={styles.glOverviewWrap}>
            <span className={styles.glOverview}>Overview</span>
          </div>
          <div className={styles.glMrBlock}>
            <CheckLine className={styles.icon} />
            <div className={styles.glMrEmpty} />
          </div>
          <div className={styles.glMrBlock}>
            <button className={styles.approve} onClick={() => fireworks()}>
              Approve
            </button>
            <span>点击 Approve 放烟花</span>
          </div>
        </div>
        <button className={styles.thumb} onClick={() => fireworks()}>
          👍
        </button>

        <div className={styles.ctas}>
          <a
            className={styles.primary}
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <EdgeIcon className={styles.edgeIcon} />
            前往 Edge 扩展商店
          </a>

          <a href="./gitlab-confetti.crx" download="gitlab-confetti.crx">
            下载 CRX
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
