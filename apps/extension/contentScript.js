const FireConfetti = (function () {
  const CACHE_KEY = 'gitlab-confetti';

  let data = {};

  const getCache = () => {
    const json = localStorage.getItem(CACHE_KEY);
    try {
      data = JSON.parse(json) || {};
    } catch (e) {
      data = {};
    }
  };

  const isFired = (projectId, mergeRequestId) => {
    const key = `${projectId}:${mergeRequestId}`;
    return !!data[key];
  };

  const fire = (projectId, mergeRequestId) => {
    confetti();
    const key = `${projectId}:${mergeRequestId}`;
    data[key] = {
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  };

  getCache();

  return {
    isFired,
    fire,
  };
})();

class GitLabConfetti {
  _mounted = false;

  max = 10;
  count = 0;

  fired = false;

  mergeRequest = {};

  constructor() {
    this.init();
  }

  async init() {
    await this._loadConfetti();
    this._mounted = true;

    const res = await fetch(`${window.location.href}/cached_widget.json`, {
      method: 'GET',
    }).then((res) => res.json());

    this.fired = FireConfetti.isFired(res.target_project_id, res.iid);

    this.mergeRequest = res;

    this.tryFireConfetti();
  }

  async _loadConfetti() {
    const src = chrome.runtime.getURL('/libs/confetti.min.js');
    await import(src);
  }

  poll() {
    if (this.count >= this.max) {
      return;
    }

    this.queryMergeRequestState().then((fired) => {
      if (fired) {
        this.fired = true;
        return;
      }

      setTimeout(() => {
        this.poll();
      }, 1000 * this.count);
      this.count++;
    });
  }

  async queryMergeRequestState() {
    const thumbsUp = window.document.querySelector(
      `span:has(> gl-emoji[data-name='thumbsup']) + .gl-button-text`
    );
    return false;
  }

  listen() {
    const button = window.document.querySelector(
      `button:has(gl-emoji[data-name='thumbsup'])`
    );

    const handleClick = () => {
      if (this.fired) {
        return;
      }

      this.tryFireConfetti();
      this.fired = true;
    };

    button.addEventListener('click', handleClick);
  }

  tryFireConfetti() {
    if (!this._mounted || this.fired) {
      return;
    }

    const { state, merge_status, target_project_id, iid } = this.mergeRequest;
    if (merge_status === 'can_be_merged' || state === 'merged') {
      FireConfetti.fire(target_project_id, iid);
    }
  }
}

new GitLabConfetti();
