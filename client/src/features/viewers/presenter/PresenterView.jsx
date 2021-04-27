import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import Countdown from '../../../common/components/countdown/Countdown';
import MyProgressBar from '../../../common/components/myProgressBar/MyProgressBar';
import NavLogo from '../../../common/components/nav/NavLogo';
import TitleCard from '../../../common/components/views/TitleCard';
import style from './PresenterView.module.css';

export default function PresenterView(props) {
  const { pres, title, time } = props;

  // Set window title
  useEffect(() => {
    document.title = 'ontime - Speaker Screen';
  }, []);

  const showOverlay = pres.text !== '' && pres.visible;
  const isPlaying = time.playstate === 'start';

  // motion
  const titleVariants = {
    hidden: {
      y: 500,
    },
    visible: {
      y: 0,
      transition: {
        duration: 1,
      },
    },
    exit: {
      y: 500,
    },
  };

  return (
    <div
      className={
        time.finished ? style.container__grayFinished : style.container__gray
      }
    >
      <div
        className={
          showOverlay ? style.messageOverlayActive : style.messageOverlay
        }
      >
        <div className={style.message}>{pres.text}</div>
      </div>

      <NavLogo />

      <div className={style.clockContainer}>
        <div className={style.label}>Time Now</div>
        <div className={style.clock}>{time.clock}</div>
      </div>

      <div className={style.timerContainer}>
        {time.finished ? (
          <div className={style.finished}>TIME UP</div>
        ) : (
          <div className={isPlaying ? style.countdown : style.countdownPaused}>
            <Countdown time={time.currentSeconds} hideZeroHours />
          </div>
        )}
      </div>

      {!time.finished && (
        <div
          className={
            isPlaying ? style.progressContainer : style.progressContainerPaused
          }
        >
          <MyProgressBar
            now={time.currentSeconds}
            complete={time.durationSeconds}
            showElapsed
          />
        </div>
      )}

      <AnimatePresence>
        {title.showNow && (
          <motion.div
            className={style.nowContainer}
            key='now'
            variants={titleVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
          >
            <TitleCard
              label='Now'
              title={title.titleNow}
              subtitle={title.subtitleNow}
              presenter={title.presenterNow}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {title.showNext && (
          <motion.div
            className={style.nextContainer}
            key='next'
            variants={titleVariants}
            initial='hidden'
            animate='visible'
            exit='exit'
          >
            <TitleCard
              label='Next'
              title={title.titleNext}
              subtitle={title.subtitleNext}
              presenter={title.presenterNext}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
