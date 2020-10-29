/**
 * Preview of a word
 */

import React from 'react';

import './WordPreview.css'
import { AudioPlayer } from '../audio-player';
import { RawWordItem } from '../../models';

const Aromanize: any = require('aromanize');

export function WordPreview(props: { showType: string, word: RawWordItem }) {
  const simpleMeaning = props.word.meaning?.split('，')?.[0] || '';

  return <tr>
    {
      props.showType !== 'zh'
        ? <td lang="ko">
            <span className="word-name">{props.word.wordName}</span>
            <span className="pronunciation" >{props.word.pronunciation}</span>
          </td>
        : null
    }

    {
      props.showType !== 'ko'
        ? <td>
            <span className="meaning">{simpleMeaning}</span>
            <span className="pos">[{props.word.pos}] {props.word.description}</span>
          </td>
        : null
    }

    <td className="player-holder">
      {
        props.word.hasAudio
          ? <AudioPlayer showRepeat={false}
                         urls={[`${Aromanize.romanize(props.word.wordName)}.mp3`]} />
          : null
      }
    </td>
  </tr>;
}
