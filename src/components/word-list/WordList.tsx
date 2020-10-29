/**
 * Preview of a list of words
 */

import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import React from 'react';

import { RawWordItem } from '../../models';

import { AudioPlayer } from '../audio-player';
import { WordDetail } from '../word-detail';
import { WordPreview } from '../word-preview';

import './WordList.css';

const Aromanize: any = require('aromanize');

export function WordList(props: { words: RawWordItem[] }) {
  const [state, setState] = React.useState({
    showType: 'all',
    showDetails: false
  });

  const audioFiles = props?.words
    .filter(word => word.hasAudio)
    .map(word => `${Aromanize.romanize(word.wordName)}.mp3`);

  const buttons = ['ko', 'zh', 'all'];

  const getButtonColor = (index: number) => {
    return state.showType === buttons[index] ? 'primary' : 'default';
  };

  const setShowType = (index: number) => () => {
    setState({ ...state, showType: buttons[index] });
  };

  const toggleShowDetails = () => {
    setState({ ...state, showDetails: !state.showDetails });
  };

  return (
    <div className="word-list">
      <div className="options-holder">
        <ButtonGroup size="small">
          <Button color={getButtonColor(0)}
                  onClick={setShowType(0)}>
            <span lang="ko">한</span>
          </Button>
          <Button color={getButtonColor(1)}
                  onClick={setShowType(1)}>汉</Button>
          <Button color={getButtonColor(2)}
                  onClick={setShowType(2)}>
            <span lang="ko">한</span>/汉
          </Button>
        </ButtonGroup>

        <FormControlLabel
          className="grammar-toggle"
          control={
            <Checkbox checked={state.showDetails}
                      color="primary"
                      name="showDetails"
                      onChange={toggleShowDetails} />
          }
          label="语法"
        />

        <div className="play-all">
          全部：<AudioPlayer showRepeat={false} urls={audioFiles} />
        </div>
      </div>

      <table>
        <tbody>
          {
            props?.words.map(word => {
              return (
                <React.Fragment key={word.wordName}>
                  <WordPreview showType={state.showType}
                               word={word} />
                  {
                    state.showDetails ? <WordDetail word={word} /> : null
                  }
                </React.Fragment>
              );
            })
          }
        </tbody>
      </table>
    </div>
  );
}
