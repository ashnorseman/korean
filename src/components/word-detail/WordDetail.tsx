/**
 * Display detail of words
 */

import React from 'react';

import { grammarItems } from '../../data/grammars';
import { IWord } from '../../interfaces/i-word';

import './WordDetail.css';

export function WordDetail(props: IWord) {
  const usableGrammarItems = grammarItems.filter(item => {
    if (item.ysBook !== props.ysBook || item.ysUnit !== props.ysUnit) {
      return false;
    }

    return item.suitableFor(props);
  });

  if (!usableGrammarItems.length) {
    return null;
  }

  return <tr>
    <td colSpan={3}>
      <table className="grammar-table" lang="ko">
        <tbody>
          {
            usableGrammarItems.map((grammar, index) =>
              <tr key={index}>
                <td className="grammar-name">{grammar.name}</td>
                <td className="grammar-example">
                  {grammar.provideExampleWith(props)}
                </td>
              </tr>
            )
          }
        </tbody>
      </table>
    </td>
  </tr>;
}
