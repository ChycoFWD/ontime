import QRCode from 'react-qr-code';
import { formatDisplay } from '../../../common/dateConfig';
import style from './StageManager.module.css';
import Paginator from '../../../common/components/views/Paginator';
import NavLogo from '../../../common/components/nav/NavLogo';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import TitleSide from '../../../common/components/views/TitleSide';

export default function StageManager(props) {
  const { publ, title, time, backstageEvents, selectedId, general } = props;
  const [filteredEvents, setFilteredEvents] = useState(null);

  // Set window title
  useEffect(() => {
    document.title = 'ontime - Backstage Screen';
  }, []);

  // calculate delays if any
  useEffect(() => {
    if (backstageEvents == null) return;

    let events = [...backstageEvents];

    // Add running delay
    let delay = 0;
    events.forEach((e) => {
      if (e.type === 'block') delay = 0;
      else if (e.type === 'delay') delay = delay + e.duration;
      else if (e.type === 'event' && delay > 0) {
        e.timeStart += delay;
        e.timeEnd += delay;
      }
    });

    // filter just events
    let filtered = events.filter((e) => e.type === 'event');

    setFilteredEvents(filtered);
  }, [backstageEvents]);

  // Format messages
  const showPubl = publ.text !== '' && publ.visible;
  const stageTimer =
    time.currentSeconds != null && !isNaN(time.currentSeconds)
      ? formatDisplay(time.currentSeconds, true)
      : '';

  // motion
  const titleVariants = {
    hidden: {
      x: -1500,
    },
    visible: {
      x: 0,
      transition: {
        duration: 1,
      },
    },
    exit: {
      x: -1500,
    },
  };

  return (
    <div className={style.container__gray}>
      <NavLogo />

      <div className={style.eventTitle}>{general.title}</div>

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
            <TitleSide
              label='Now'
              type='now'
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
            <TitleSide
              label='Next'
              type='next'
              title={title.titleNext}
              subtitle={title.subtitleNext}
              presenter={title.presenterNext}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className={style.todayContainer}>
        <div className={style.label}>Today</div>
        <div className={style.entriesContainer}>
          <Paginator selectedId={selectedId} events={filteredEvents} />
        </div>
      </div>

      <div
        className={
          showPubl ? style.publicContainer : style.publicContainerHidden
        }
      >
        <div className={style.label}>Public message</div>
        <div className={style.message}>{publ.text}</div>
      </div>

      <div className={style.clockContainer}>
        <div className={style.label}>Time Now</div>
        <div className={style.clock}>{time.clock}</div>
      </div>

      <div className={style.countdownContainer}>
        <div className={style.label}>Stage Timer</div>
        <div className={style.clock}>{stageTimer}</div>
      </div>

      <div className={style.infoContainer}>
        <div className={style.label}>Info</div>
        <div className={style.infoMessages}>
          <div className={style.info}>{general.backstageInfo}</div>
        </div>
        <div className={style.qr}>
          {general.url != null && general.url !== '' && (
            <QRCode
              value='www.carlosvalente.com'
              size={window.innerWidth / 12}
              level='L'
            />
          )}
        </div>
      </div>
    </div>
  );
}
