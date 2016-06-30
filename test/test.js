
/*global describe, it */
import assert from 'assert';

import { createJson } from '../client/util/json2';
import { protocol1 } from '../client/util/data';
import { reduce } from 'lodash';


describe('Test', () => {
  it('test', () => {
  const json = createJson(protocol1, 5);
    console.log(json.questionAnswers.value['50c283c4117c42259adc562d280d16d1'])
  });

});

