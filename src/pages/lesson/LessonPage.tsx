import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import { Link } from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import React from 'react';
import { useParams } from 'react-router-dom'

import { WordList } from '../../components/word-list';
import * as lessonData from '../../data/lesson-data.json';
import * as vocabularyData from '../../data/vocabulary.json';
import { Lesson } from '../../models';
import { RawWordItem } from '../../models';

import './LessonPage.css';

const lessons: Lesson[] = (lessonData as any).default as Lesson[];
const words: RawWordItem[] = ((vocabularyData as any).default as any[]).map(item => new RawWordItem(item)) as RawWordItem[];

/**
 * Render a lesson
 */

export function LessonPage() {
  const { book, lesson } = useParams();
  const currentLesson = lessons.find(item => {
    return item.book === +book && item.lesson === +lesson;
  }) || lessons[0];
  const wordList = words.filter(word => {
    return word.ysBook === currentLesson.book && word.ysUnit === currentLesson.lesson;
  });

  const [state, setState] = React.useState({
    drawerOpen: false
  });

  const toggleDrawer = (open: boolean) => () => {
    setState({ ...state, drawerOpen: open });
  };

  return (
    <React.Fragment>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="menu"
            edge="start"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>

          <Typography lang="ko" variant="h6">제<span className="number">{currentLesson.lesson}</span>과 {currentLesson.name}</Typography>
        </Toolbar>
      </AppBar>

      <Toolbar />

      <WordList words={wordList} />

      <SwipeableDrawer
        anchor="left"
        open={state.drawerOpen}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        <List className="lesson-list" component="nav">
          {
            lessons.map((lesson, index) => {
              return <Link key={index} to={`/book/${lesson.book}/lesson/${lesson.lesson}`}>
                <ListItem button onClick={toggleDrawer(false)}>
                  <ListItemText primary={`${lesson.lesson}. ${lesson.name}`} />
                </ListItem>
              </Link>;
            })
          }
        </List>

        <p className="copyright">
          Copyright &copy; 2020 경희<span aria-label="img" role="img">🎀</span>庆姬
        </p>
      </SwipeableDrawer>
    </React.Fragment>
  );
}
