import React, { useEffect, useRef } from 'react';
import _ from 'lodash';

export default function App() {
  const ref = useRef<HTMLDivElement>(null);
  let ticking = false;
  const isIe =
    /MSIE/i.test(navigator?.userAgent) ||
    /Trident.*rv\:11\./i.test(navigator?.userAgent);
  const isFirefox = /Firefox/i.test(navigator.userAgent);
  const scrollSensitivitySetting = 20;
  const slideDurationSetting = 500;
  let currentSlideNumber = 0;
  let delta;
  let totalSlideNumber = 3;
  const mousewheelEvent = isFirefox ? 'DOMMouseScroll' : 'wheel';

  function nextItem() {
    let $previousSlide = ref.current?.children[currentSlideNumber - 1];
    $previousSlide?.classList.remove('up-scroll');
    $previousSlide?.classList.add('down-scroll');
  }

  function previousItem() {
    let $currentSlide = ref.current?.children[currentSlideNumber];
    $currentSlide?.classList.remove('down-scroll');
    $currentSlide?.classList.add('up-scroll');
  }

  function parallaxScroll(evt: any) {
    if (isFirefox) {
      //Set delta for Firefox
      delta = evt.detail * -120;
    } else if (isIe) {
      //Set delta for IE
      delta = -evt.deltaY;
    } else {
      //Set delta for all other browsers
      delta = evt.wheelDelta;
    }

    if (ticking != true) {
      if (delta <= -scrollSensitivitySetting) {
        //Down scroll
        ticking = true;
        if (currentSlideNumber !== totalSlideNumber - 1) {
          currentSlideNumber++;
          nextItem();
        }
        slideDurationTimeout(slideDurationSetting);
      }
      if (delta >= scrollSensitivitySetting) {
        //Up scroll
        ticking = true;
        if (currentSlideNumber !== 0) {
          currentSlideNumber--;
        }
        previousItem();
        slideDurationTimeout(slideDurationSetting);
      }
    }
  }

  function slideDurationTimeout(slideDuration: any) {
    setTimeout(function () {
      ticking = false;
    }, slideDuration);
  }

  useEffect(() => {
    window.addEventListener(
      mousewheelEvent,
      _.throttle(parallaxScroll, scrollSensitivitySetting),
      false
    );
    console.log();
  }, []);

  return (
    <div className='container' ref={ref}>
      {Array(totalSlideNumber)
        .fill('')
        .map((item, i) => {
          return (
            <section className='background' key={i}>
              <div className='content-wrapper'>
                <p className='content-title'>Full Page Parallax Effect</p>
                <p className='content-subtitle'>
                  Scroll down and up to see the effect!
                </p>
              </div>
            </section>
          );
        })}
    </div>
  );
}
