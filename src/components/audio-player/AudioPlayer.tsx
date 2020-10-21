/**
 * Play an audio file
 */

import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import PlayArrow from '@material-ui/icons/PlayArrow';
import Repeat from '@material-ui/icons/Repeat';
import Pause from '@material-ui/icons/Pause';
import Stop from '@material-ui/icons/Stop';
import React from 'react';

import { AudioPlayerProps } from './AudioPlayerProps';

export function AudioPlayer(props: AudioPlayerProps) {
  const baseUrl = '/audio';
  const interval = 1000;
  const audioPlayer = React.useRef<HTMLAudioElement>(null);

  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentAudioIndex, setCurrentAudioIndex] = React.useState(0);
  const [timeout, setTimeout] = React.useState(0);

  React.useEffect(() => {
    function playNext() {
      const nextAudioIndex = currentAudioIndex + 1;

      if (props.urls[nextAudioIndex] && audioPlayer.current) {
        setCurrentAudioIndex(nextAudioIndex);

        setTimeout(window.setTimeout(() => {
          audioPlayer.current?.play().then();
        }, interval));
      } else {
        setCurrentAudioIndex(0);
        setIsPlaying(false);
      }
    }

    audioPlayer.current?.addEventListener('ended', playNext);

    return () => {
      audioPlayer?.current?.removeEventListener('ended', playNext);
    };
  });

  const togglePlay = (play: boolean) => () => {
    if (!audioPlayer.current) {
      return;
    }

    if (play) {
      audioPlayer.current.play().then(() => {
        setIsPlaying(true);
      });
    } else {
      audioPlayer.current.pause();
      setIsPlaying(false);
      clearTimeout(timeout);
    }
  };

  return (
    <React.Fragment>
      <ButtonGroup>
        <Button size="small"
                variant="outlined"
                onClick={togglePlay(!isPlaying)}>
          {
            isPlaying
              ? props.urls[currentAudioIndex + 1] ? <Pause /> : <Stop />
              : <PlayArrow />
          }
        </Button>

        {
          props.showRepeat
            ? <Button size="small"
                      variant="outlined">
                <Repeat />
              </Button>
            : null
        }
      </ButtonGroup>

      <audio ref={audioPlayer}
             src={`${baseUrl}/${props.urls[currentAudioIndex]}`}/>
    </React.Fragment>
  );
}
