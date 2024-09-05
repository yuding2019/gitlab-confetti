chrome.tabs.query({ active: true }).then((tabs) => {
  console.log(tabs);
});

chrome.webRequest.onCompleted.addListener((detail) => {
  if (
    detail.url.includes('merge_requests') &&
    detail.url.includes('award_emoji')
  ) {
    console.log('confetti');
  }
});
