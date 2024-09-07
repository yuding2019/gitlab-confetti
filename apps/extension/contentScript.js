const ConfettiFn = {
  fireworks: () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
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
  },
};

const FireConfetti = (function () {
  const CACHE_KEY = 'gitlab-confetti';

  const CallbackMap = {};

  let FireCache = {};

  // 初始化confetti缓存数据
  const initFireCache = () => {
    const json = localStorage.getItem(CACHE_KEY);
    try {
      FireCache = JSON.parse(json) || {};
    } catch (e) {
      FireCache = {};
    }
  };

  // 初始化confetti
  const initConfetti = async () => {
    const src = chrome.runtime.getURL('/libs/confetti.min.js');
    await import(src);
  };

  // 是否已经放烟花
  const isFired = (projectId, mergeRequestId) => {
    const key = `${projectId}:${mergeRequestId}`;
    return !!FireCache[key];
  };

  // 放烟花
  const fire = (params) => {
    const { projectId, mergeRequestId, force } = params;

    if (isFired(projectId, mergeRequestId) && !force) {
      return;
    }

    ConfettiFn.fireworks();
    const key = `${projectId}:${mergeRequestId}`;
    FireCache[key] = {
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(FireCache));
  };

  initFireCache();

  initConfetti().then(() => {
    CallbackMap['onLoad'] && CallbackMap['onLoad']();
  });

  return {
    fire,
    isFired,
    onLoad: (cb) => {
      CallbackMap['onLoad'] = cb;
    },
  };
})();

function getButton() {
  const approveButton = document.querySelector(
    'button[data-qa-selector="approve_button"]'
  );
  const thumbsUpButton = document.querySelector(
    'button:has(gl-emoji[data-name="thumbsup"])'
  );

  return {
    approveButton,
    thumbsUpButton,
  };
}

class MergeRequest {
  mergeRequestData = {};

  eventMap = new Map();

  constructor() {
    this.initialize();
    this.eventMap = new Map();
  }

  async initialize() {
    const data = await this.fetchMergeRequestData();
    this.mergeRequestData = data;

    // 初始化尝试放一次烟花
    this.tryToFireConfetti();

    this.listenButtonClick();
  }

  // 获取merge request信息
  async fetchMergeRequestData() {
    const {
      iid: mergeRequestId,
      target_project_id: projectId,
      state,
      draft,
    } = await fetch(`${window.location.href}/cached_widget.json`, {
      method: 'GET',
    }).then((res) => res.json());

    // 获取merge request点赞信息以及approval信息
    const [emojis, approval] = await Promise.all([
      fetch(
        `${window.location.origin}/api/v4/projects/${projectId}/merge_requests/${mergeRequestId}/award_emoji?per_page=100&page=1`,
        {
          method: 'GET',
        }
      ).then((res) => res.json()),
      fetch(
        `${window.location.origin}/api/v4/projects/${projectId}/merge_requests/${mergeRequestId}/approvals`,
        {
          method: 'GET',
        }
      ).then((res) => res.json()),
    ]);

    const thumbsUpCount = Array.isArray(emojis)
      ? emojis.filter((emoji) => emoji.name === 'thumbsup').length
      : 0;

    return {
      projectId,
      mergeRequestId,
      state,
      approved: approval.approved,
      isDraft: draft,
      thumbsUpCount,
    };
  }

  listenButtonClick() {
    const { projectId, mergeRequestId } = this.mergeRequestData;
    const { approveButton, thumbsUpButton } = getButton();
    approveButton?.addEventListener('click', () => {
      this.emit('fire', { projectId, mergeRequestId, force: true });
    });

    thumbsUpButton?.addEventListener('click', () => {
      const count = Number(thumbsUpButton.textContent.match(/\d+/g)?.[0] || 0);
      if (count > this.mergeRequestData.thumbsUpCount) {
        this.emit('fire', { projectId, mergeRequestId, force: true });
      }
    });
  }

  tryToFireConfetti() {
    const { state, thumbsUpCount, projectId, mergeRequestId, approved } =
      this.mergeRequestData;
    if (state === 'merged' || thumbsUpCount > 0 || approved) {
      this.emit('fire', { projectId, mergeRequestId });
    }
  }

  on(event, callback) {
    this.eventMap.set(event, callback);

    return () => {
      this.eventMap.delete(event);
    };
  }

  emit(event, payload) {
    const callback = this.eventMap.get(event);
    callback && callback(payload);
  }
}

// 加载完后初始化MergeRequest
FireConfetti.onLoad(() => {
  const mergeRequest = new MergeRequest();

  mergeRequest.on('fire', (payload) => {
    FireConfetti.fire(payload);
  });
});
