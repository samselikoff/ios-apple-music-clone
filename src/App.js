import {
  animate,
  AnimatePresence,
  motion,
  useDragControls,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

const DURATION = 186;

export default function PodcastScaleEffect() {
  let [playing, setPlaying] = useState(false);
  let [pressing, setPressing] = useState(false);
  let [currentTime, setCurrentTime] = useState(0);

  let interval = useMotionValue(0);
  let y = useTransform(interval, (value) => 50 + Math.sin(value) * 50);
  let x = useTransform(interval, (value) => 50 + Math.cos(value) * 50);
  let backgroundPosition = useMotionTemplate`${x}% ${y}%`;
  let constraintsRef = useRef(null);

  let mins = Math.floor(currentTime / 60);
  let secs = `${currentTime % 60}`.padStart(2, "0");
  let timecode = `${mins}:${secs}`;
  let minsRemaining = Math.floor((DURATION - currentTime) / 60);
  let secsRemaining = `${(DURATION - currentTime) % 60}`.padStart(2, "0");
  let timecodeRemaining = `${minsRemaining}:${secsRemaining}`;

  let progress = (currentTime / DURATION) * 100;
  // let animatedProgress = useMotionValue(progress)

  let dragControls = useDragControls();
  let currentTimePrecise = useMotionValue(currentTime);
  let progressPrecise = useTransform(
    currentTimePrecise,
    (v) => (v / DURATION) * 100
  );
  let progressPreciseWidth = useMotionTemplate`${progressPrecise}%`;
  let scrubberX = useMotionValue(0);

  useEffect(() => {
    let controls = animate(interval, [0, Math.PI * 2], {
      repeat: Infinity,
      duration: 30,
      ease: "linear",
    });

    return controls.stop;
  }, [interval]);

  useEffect(() => {
    if (playing) {
      let interval1Id = setInterval(() => {
        if (currentTime < DURATION) {
          setCurrentTime((t) => t + 1);
        }
      }, 1000);

      let interval2Id = setInterval(() => {
        if (currentTime < DURATION) {
          let newCurrentTimePrecise = currentTime + 0.01;
          // let newCurrentTimePrecise = currentTimePrecise.get() + 0.01;
          currentTimePrecise.set(newCurrentTimePrecise);
          let newProgressPrecise = newCurrentTimePrecise / DURATION;
          let newX =
            newProgressPrecise * (constraintsRef.current.clientWidth - 20);

          scrubberX.set(newX);
        }
      }, 10);

      return () => {
        clearInterval(interval1Id);
        clearInterval(interval2Id);
      };
    }
  }, [playing, currentTime, currentTimePrecise, scrubberX]);

  return (
    <div className="">
      <div className="max-w-5xl mx-auto">
        <div className="">
          <AnimatePresence initial={false}>
            <div
              style={{ backgroundPosition: "100%" }}
              className="flex flex-col w-full md:flex-row md:space-y-0 md:pt-20 md:px-10 md:justify-around md:space-x-12"
            >
              <motion.div
                style={{
                  backgroundSize: "200% 200%",
                  backgroundPosition,
                  backgroundColor: "#322840",
                  backgroundImage: `
                    radial-gradient(at 21% 33%, #242549 0px, transparent 50%),
                    radial-gradient(at 79% 32%, #35245e 0px, transparent 50%),
                    radial-gradient(at 26% 83%, #0e2452 0px, transparent 50%)`,
                }}
                className="flex flex-col items-center w-full px-6 pt-[92px] mx-auto min-h-screen"
              >
                <motion.img
                  src="/album.webp"
                  variants={{
                    grow: {
                      scale: 1,
                      // boxShadow:
                      //   "rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.1) 0px 8px 10px -6px",
                      transition: {
                        type: "spring",
                        duration: 1,
                        bounce: 0.5,
                        delay: 0.05,
                      },
                    },
                    shrink: {
                      scale: 0.73,
                      // boxShadow:
                      //   "rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px",
                      transition: {
                        type: "spring",
                        duration: 0.7,
                        bounce: 0,
                        delay: 0.05,
                      },
                    },
                  }}
                  animate={playing ? "grow" : "shrink"}
                  className="relative z-10 block w-full shadow-2xl rounded-xl aspect-square"
                ></motion.img>

                <div className="mt-[45px] w-full px-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xl leading-tight tracking-wide text-white truncate">
                        You Right
                      </p>
                      <p className="text-xl leading-tight truncate text-[#A49FC3]/90">
                        Doja Cat & The Weeknd
                      </p>
                    </div>

                    <button className="flex items-center justify-center rounded-full w-7 h-7 bg-white/10">
                      <DotsIcon className="w-4 h-4 text-white" />
                    </button>
                  </div>

                  {/* Progress bar */}
                  <div className="relative w-full mt-[25px]">
                    <div
                      className="relative"
                      onPointerDown={(event) => {
                        let draggedProgress =
                          (event.clientX - 32) /
                          (constraintsRef.current.clientWidth - 20);
                        let newProgress =
                          draggedProgress > 1
                            ? 1
                            : draggedProgress < 0
                            ? 0
                            : draggedProgress;
                        dragControls.start(event, { snapToCursor: true });
                        setCurrentTime(Math.floor(newProgress * DURATION));
                        currentTimePrecise.set(newProgress * DURATION);
                      }}
                    >
                      <div className="w-full h-[3px] bg-[#5A526F] rounded-full"></div>
                      <motion.div
                        style={{ width: progressPreciseWidth }}
                        className="absolute top-0"
                      >
                        <div className="absolute inset-0 h-[3px] bg-[#A29CC0] rounded-full"></div>
                      </motion.div>
                      <div
                        className="absolute inset-0 -mx-2.5"
                        ref={constraintsRef}
                      >
                        <motion.div
                          drag="x"
                          dragConstraints={constraintsRef}
                          dragControls={dragControls}
                          dragElastic={0}
                          dragMomentum={false}
                          style={{ x: scrubberX }}
                          onDrag={(event, info) => {
                            // 32 and 20 are adjusting for margins
                            let draggedProgress =
                              (info.point.x - 32) /
                              (constraintsRef.current.clientWidth - 20);
                            let newProgress =
                              draggedProgress > 1
                                ? 1
                                : draggedProgress < 0
                                ? 0
                                : draggedProgress;
                            setCurrentTime(Math.floor(newProgress * DURATION));
                            currentTimePrecise.set(newProgress * DURATION);
                          }}
                          whileTap={{ scale: 4.75 }}
                          transition={{ type: "tween", duration: 0.15 }}
                          className="absolute left-0 -top-2.5 p-2 rounded-full"
                        >
                          <div className="shadow-lg z-10 w-[7px] h-[7px] bg-[#A29CC0] rounded-full"></div>
                        </motion.div>
                      </div>
                    </div>
                    <div className="flex justify-between mt-[11px]">
                      <motion.p
                        className="absolute left-0 text-[11px] font-medium tracking-wide text-white/20 tabular-nums"
                        animate={{ y: progress < 15 ? 15 : 0 }}
                      >
                        {timecode}
                      </motion.p>
                      <img
                        className="h-[13px] pt-0.5 mx-auto"
                        src="/dolby.svg"
                        alt=""
                      />
                      <motion.p
                        className="absolute right-0 text-[11px] font-medium tracking-wide text-white/20 tabular-nums"
                        animate={{ y: progress > 85 ? 15 : 0 }}
                      >
                        -{timecodeRemaining}
                      </motion.p>
                    </div>
                  </div>

                  {/* Player controls */}
                  <div className="mt-6">
                    <div className="flex items-center justify-between px-9">
                      <button>
                        <SkipIcon className="w-10 text-white rotate-180" />
                      </button>

                      <motion.button
                        animate={pressing ? "pressed" : "unpressed"}
                        onTapStart={() => {
                          setPressing(true);
                        }}
                        onTap={() => {
                          setPressing(false);
                          setPlaying(!playing);
                        }}
                        className="relative w-20 h-20 p-3 text-white rounded-full"
                      >
                        <motion.span
                          variants={{
                            pressed: {
                              scale: 0.85,
                              backgroundColor: "rgba(229 231 235 .25)",
                              transition: {
                                type: "spring",
                                duration: 0.3,
                                bounce: 0.5,
                              },
                            },
                            unpressed: {
                              scale: [null, 0.85, 1],
                              backgroundColor: [
                                null,
                                "rgba(229 231 235 .25)",
                                "rgba(229 231 235 0)",
                              ],
                              transition: {
                                type: "spring",
                                duration: 0.3,
                                bounce: 0.5,
                              },
                            },
                          }}
                          className="absolute inset-0 rounded-full"
                        ></motion.span>
                        <motion.span
                          variants={{
                            pressed: { scale: 0.85 },
                            unpressed: {
                              scale: [null, 0.85, 1],
                              transition: {
                                type: "spring",
                                duration: 0.6,
                                bounce: 0.5,
                              },
                            },
                          }}
                          className="block"
                        >
                          {playing ? (
                            <PauseIcon className="w-full h-full" />
                          ) : (
                            <PlayIcon className="w-full h-full" />
                          )}
                        </motion.span>
                      </motion.button>

                      <button>
                        <SkipIcon className="w-10 text-white" />
                      </button>
                    </div>
                  </div>

                  {/* Volume bar */}
                  <div className="flex items-center justify-between w-full mt-9">
                    <VolumeMuteIcon className="h-5 text-white/50" />
                    <div className="relative flex-1 mx-3">
                      <div className="w-full h-[3px] bg-[#5A526F] rounded-full"></div>
                      <div className="absolute inset-0 flex items-center w-8">
                        <div className="w-full h-[3px] bg-[#A29CC0] rounded-full"></div>
                        <div className="absolute right-0 w-5 h-5 bg-white rounded-full left-8"></div>
                      </div>
                    </div>
                    <VolumeHighIcon className="h-5 text-white/50" />
                  </div>
                </div>
              </motion.div>
            </div>
          </AnimatePresence>
        </div>

        {/* <div className="mt-20 text-center">
          <p className="text-sm text-gray-500">
            View the source: <br className="md:hidden" />
            <a
              className="font-medium text-gray-600 underline"
              href="https://github.com/samselikoff/ios-podcast-scale-effect/blob/main/src/App.js"
            >
              github.com/samselikoff/ios-podcast-scale-effect
            </a>
          </p>
        </div> */}
      </div>
    </div>
  );
}

function PlayIcon(props) {
  return (
    <svg viewBox="0 0 40 40" fill="none" {...props}>
      <path
        d="M32.997 18.268c1.334.77 1.334 2.695 0 3.464L13 33.27c-1.333.769-2.999-.194-2.999-1.733V8.463c0-1.54 1.666-2.502 3-1.733l19.997 11.538z"
        fill="currentColor"
      />
    </svg>
  );
}

function PauseIcon(props) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        x={21.8426}
        y={6}
        width={8.2963}
        height={28}
        rx={2.07407}
        fill="currentColor"
      />
      <rect
        x={9.65741}
        y={6}
        width={8.2963}
        height={28}
        rx={2.07407}
        fill="currentColor"
      />
    </svg>
  );
}

function SkipIcon(props) {
  return (
    <svg viewBox="0 0 48 28" fill="none" {...props}>
      <g>
        <path
          d="M22.997 12.268c1.334.77 1.334 2.695 0 3.464L3 27.27C1.666 28.039 0 27.076 0 25.537V2.463C0 .923 1.666-.04 3 .73l19.997 11.538z"
          fill="currentColor"
        />
        <path
          d="M46.997 12.268c1.334.77 1.334 2.695 0 3.464L27 27.27c-1.333.769-2.999-.194-2.999-1.733V2.463C24 .923 25.666-.04 27 .73l19.997 11.538z"
          fill="currentColor"
        />
      </g>
    </svg>
  );
}

function VolumeHighIcon(props) {
  return (
    <svg viewBox="0 0 58 58" fill="none" {...props}>
      <path
        d="M24.4 16.482a1.754 1.754 0 00-.78-.18c-.409 0-.805.135-1.134.396L15.1 22.656H9.12c-.998 0-1.813.816-1.813 1.813v9.062c0 .997.815 1.813 1.812 1.813H15.1l7.386 5.947c.329.26.737.397 1.133.397.26 0 .533-.057.782-.182a1.812 1.812 0 001.03-1.631v-21.75c0-.702-.396-1.337-1.03-1.643zM50.694 29c0-6.718-2.628-13.005-7.408-17.729a1.36 1.36 0 00-1.926.012 1.36 1.36 0 00.011 1.926c4.26 4.202 6.593 9.81 6.593 15.791s-2.345 11.589-6.593 15.791a1.36 1.36 0 00-.011 1.926c.26.272.612.408.963.408.34 0 .69-.136.951-.397 4.792-4.712 7.42-11.01 7.42-17.728z"
        fill="currentColor"
      />
      <path
        d="M43.602 29c0-4.928-1.88-9.55-5.302-13.016a1.36 1.36 0 00-1.925-.011 1.36 1.36 0 00-.012 1.925c2.912 2.957 4.52 6.9 4.52 11.113 0 4.214-1.608 8.157-4.52 11.113a1.36 1.36 0 00.012 1.926c.26.26.611.397.951.397.351 0 .703-.136.963-.408 3.421-3.49 5.313-8.111 5.313-13.039z"
        fill="currentColor"
      />
      <path
        d="M32.568 20.674a1.36 1.36 0 00-1.925-.011 1.36 1.36 0 00-.012 1.925c1.677 1.7 2.606 3.976 2.606 6.412a9.105 9.105 0 01-2.606 6.412 1.36 1.36 0 00.012 1.925c.26.261.611.397.951.397.351 0 .703-.136.963-.408 2.186-2.22 3.387-5.166 3.387-8.315.011-3.16-1.19-6.117-3.376-8.337z"
        fill="currentColor"
      />
    </svg>
  );
}

function VolumeMuteIcon(props) {
  return (
    <svg viewBox="0 0 33 58" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M24.4 16.482a1.754 1.754 0 00-.78-.18c-.409 0-.805.135-1.134.396L15.1 22.656H9.12c-.998 0-1.813.816-1.813 1.813v9.062c0 .997.815 1.813 1.812 1.813H15.1l7.386 5.947c.329.26.737.397 1.133.397.26 0 .533-.057.782-.182a1.812 1.812 0 001.03-1.631v-21.75c0-.702-.396-1.337-1.03-1.643z"
        fill="currentColor"
      />
    </svg>
  );
}

function DotsIcon(props) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx={5} cy={24} r={5} />
      <circle cx={24} cy={24} r={5} />
      <circle cx={43} cy={24} r={5} />
    </svg>
  );
}
