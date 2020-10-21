/**
 * Preview of a word
 */

import React from 'react';

import { IWord } from '../../interfaces/i-word';
import './WordPreview.css'
import { AudioPlayer } from '../audio-player';

const Aromanize: any = require('aromanize');

export function WordPreview(props: IWord & { showType: string }) {
  const simpleMeaning = props.meaning?.split('，')?.[0] || '';

  return <tr>
    {
      props.showType !== 'zh'
        ? <td lang="ko">
            <span className="word-name">{props.wordName}</span>
            <span className="pronunciation" >{props.pronunciation}</span>
          </td>
        : null
    }

    {
      props.showType !== 'ko'
        ? <td>
            <span className="meaning">{simpleMeaning}</span>
            <span className="pos">[{props.pos}] {props.description}</span>
          </td>
        : null
    }

    <td className="player-holder">
      {
        props.hasAudio
          ? <AudioPlayer showRepeat={false}
                         urls={[`${Aromanize.romanize(props.wordName)}.mp3`]} />
          : null
      }
    </td>
  </tr>;
}
