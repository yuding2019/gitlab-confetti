import { useState } from 'react';

import { EdgeIcon } from '../components/Icon/Edge';
import { CheckLine } from '../components/Icon/CheckLine';
import { GitMerge, MergeRequest } from '../components/Icon/GitMerge';
import { ChromeIcon } from '../components/Icon/Chrome';

import { fireworks } from '@/src/utils/confetti';

import styles from './index.module.css';

export default function Home() {
  const [approved, setApproved] = useState(false);
  const [thumbsUpCount, setThumbsUpCount] = useState(0);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.glMerge}>
          <h1>
            feat(
            <a
              className={styles.glLink}
              href="https://github.com/yuding2019/gitlab-confetti"
              target="_blank"
            >
              GitLab Confetti
            </a>
            ): 每一个 Commit 都值得被庆祝
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
            {approved ? (
              <GitMerge className={`${styles.mr} ${styles.merged}`} />
            ) : (
              <MergeRequest className={styles.mr} />
            )}

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
        <button
          className={`${styles.thumb} ${thumbsUpCount ? styles.thumbActive : ''}`}
          onClick={() => {
            if (!thumbsUpCount) {
              setThumbsUpCount(1);
              fireworks();
            } else {
              setThumbsUpCount(0);
            }
          }}
        >
          👍 {!!thumbsUpCount && <span>{thumbsUpCount}</span>}
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
          🎉 canvas-confetti: performant confetti animation in the browser 🎉
        </a>
      </footer>
    </div>
  );
}
