export class MergeRequest {
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

/** 获取按钮 */
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
