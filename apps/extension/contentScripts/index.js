import * as FireConfetti from './fireConfetti';

import { MergeRequest } from './mergeRequest';

const mergeRequest = new MergeRequest();

mergeRequest.on('fire', (payload) => {
  FireConfetti.fire(payload);
});
