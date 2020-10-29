/**
 * Display detail of words
 */

import React from 'react';

import { grammarItems } from '../../data/grammars';
import { RawWordItem } from '../../models';

import './WordDetail.css';

export function WordDetail(props: { word: RawWordItem }) {
  const usableGrammarItems = grammarItems.filter(item => {
    if (item.ysBook !== props.word.ysBook || item.ysUnit !== props.word.ysUnit) {
      return false;
    }

    return item.suitableFor(props.word);
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
                  {grammar.provideExampleWith(props.word)}
                </td>
              </tr>
            )
          }
        </tbody>
      </table>
    </td>
  </tr>;
}
