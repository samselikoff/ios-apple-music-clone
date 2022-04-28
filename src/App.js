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
import * as Icons from "./Icons";

const DURATION = 186;

export default function App() {
  let [playing, setPlaying] = useState(false);
  let [currentTime, setCurrentTime] = useState(0);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="max-w-[390px] w-full flex mx-auto max-h-[844px] flex-col h-screen relative">
        <div className="flex flex-col items-center w-full px-6 pt-[92px] flex-1 shadow-2xl rounded">
          <AnimatedGradient />
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
            initial={false}
            className="relative z-10 block w-full shadow-2xl rounded-xl aspect-square"
          ></motion.img>

          <div className="mt-[45px] w-full px-2">
            <Title />

            <ProgressBar
              playing={playing}
              currentTime={currentTime}
              setCurrentTime={setCurrentTime}
            />

            <PlayerControls
              playing={playing}
              onPlayPause={() => setPlaying(!playing)}
            />

            <Volume />

            <IconBar />
          </div>
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

function AnimatedGradient() {
  let gradientRef = useRef();
  let interval = useMotionValue(0);
  let y = useTransform(interval, (value) => Math.sin(value) * 100);
  let x = useTransform(interval, (value) => Math.cos(value) * 100);

  useEffect(() => {
    let controls = animate(interval, [0, Math.PI * 2], {
      repeat: Infinity,
      duration: 24,
      ease: "linear",
    });

    return controls.stop;
  }, [interval]);

  return (
    <div className="absolute inset-0 z-[-1] overflow-hidden">
      <motion.div
        ref={gradientRef}
        style={{
          x,
          y,
          scale: 1.75,
          backgroundColor: "#322840",
          backgroundImage: `
            radial-gradient(at 21% 33%, #1f2460 0px, transparent 50%),
            radial-gradient(at 79% 32%, #2d1e51 0px, transparent 50%),
            radial-gradient(at 26% 83%, #0f2451 0px, transparent 50%)`,
        }}
        className="absolute inset-0"
      ></motion.div>
    </div>
  );
}

function Title() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xl font-medium leading-tight text-white truncate">
          You Right
        </p>
        <p className=" text-xl leading-tight truncate text-[#A49FC3]/90">
          Doja Cat & The Weeknd
        </p>
      </div>
      <button className="flex items-center justify-center rounded-full w-7 h-7 bg-white/10 active:bg-white/20">
        <Icons.Dots className="w-4 h-4 text-white" />
      </button>
    </div>
  );
}

function ProgressBar({ playing, currentTime, setCurrentTime }) {
  let [dragging, setDragging] = useState(false);
  let constraintsRef = useRef(null);
  let scrubberX = useMotionValue(0);
  let currentTimePrecise = useMotionValue(currentTime);
  let progressPrecise = useTransform(
    currentTimePrecise,
    (v) => (v / DURATION) * 100
  );
  let progressPreciseWidth = useMotionTemplate`${progressPrecise}%`;
  let dragControls = useDragControls();

  let mins = Math.floor(currentTime / 60);
  let secs = `${currentTime % 60}`.padStart(2, "0");
  let timecode = `${mins}:${secs}`;
  let minsRemaining = Math.floor((DURATION - currentTime) / 60);
  let secsRemaining = `${(DURATION - currentTime) % 60}`.padStart(2, "0");
  let timecodeRemaining = `${minsRemaining}:${secsRemaining}`;
  let progress = (currentTime / DURATION) * 100;

  useEffect(() => {
    if (playing) {
      let interval1Id = setInterval(() => {
        if (currentTime < DURATION) {
          setCurrentTime((t) => t + 1);
        }
      }, 1000);

      let interval2Id = setInterval(() => {
        if (currentTime < DURATION) {
          let newCurrentTimePrecise = currentTimePrecise.get() + 0.01;
          currentTimePrecise.set(newCurrentTimePrecise);
          let newX = getXFromProgress({
            container: constraintsRef.current,
            progress: currentTimePrecise.get() / DURATION,
          });
          scrubberX.set(newX);
        }
      }, 10);

      return () => {
        clearInterval(interval1Id);
        clearInterval(interval2Id);
      };
    }
  }, [playing, currentTime, currentTimePrecise, scrubberX, setCurrentTime]);

  return (
    <div className="relative w-full mt-[25px]">
      <div
        className="relative"
        onPointerDown={(event) => {
          let newProgress = getProgress({
            container: constraintsRef.current,
            event,
          });
          setDragging(true);
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
        <div className="absolute inset-0" ref={constraintsRef}>
          <motion.button
            drag="x"
            dragConstraints={constraintsRef}
            dragControls={dragControls}
            dragElastic={0}
            dragMomentum={false}
            style={{ x: scrubberX }}
            // animate={{ scale: dragging ? 4.75 : 1 }}
            onDrag={(event) => {
              let newProgress = getProgress({
                container: constraintsRef.current,
                event,
              });
              setCurrentTime(Math.floor(newProgress * DURATION));
              currentTimePrecise.set(newProgress * DURATION);
            }}
            onDragStart={() => {
              setDragging(true);
            }}
            onPointerDown={() => {
              setDragging(true);
            }}
            onPointerUp={() => {
              setDragging(false);
            }}
            onDragEnd={() => {
              setDragging(false);
            }}
            className="absolute -top-[2px] flex items-center justify-center rounded-full cursor-grab active:cursor-grabbing blur-0"
          >
            <motion.div
              animate={{ scale: dragging ? 4.75 : 1 }}
              transition={{ type: "tween", duration: 0.15 }}
              className=" w-[7px] h-[7px] bg-[#A29CC0] rounded-full"
              style={{ x: -2 }}
            ></motion.div>
            {/* Scaling the above div is blurry in safari, was trying this vg */}
            {/* <motion.svg
              animate={{ scale: dragging ? 4.75 : 1 }}
              viewBox="0 0 10 10"
              className="w-[7px] origin-bottom"
            >
              <circle
                r="5"
                cx="5"
                cy="5"
                fill="currentColor"
                className="text-[#A29CC0]"
              />
            </motion.svg> */}
          </motion.button>
        </div>
      </div>
      <div className="flex justify-between mt-[11px]">
        <motion.p
          className="absolute left-0 text-[11px] font-medium tracking-wide text-white/20 tabular-nums"
          animate={{ y: dragging && progress < 15 ? 15 : 0 }}
        >
          {timecode}
        </motion.p>
        <img
          className="h-[11.5px] mt-1 mx-auto pointer-events-none"
          src="/dolby.svg"
          alt=""
        />
        <motion.p
          className="absolute right-0 text-[11px] font-medium tracking-wide text-white/20 tabular-nums"
          animate={{ y: dragging && progress > 85 ? 15 : 0 }}
        >
          -{timecodeRemaining}
        </motion.p>
      </div>
    </div>
  );
}

function PlayerControls({ playing, onPlayPause }) {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between px-4">
        <Button className="w-20 h-20 p-3">
          <Icons.Skip className="w-[42px] h-[42px] text-white rotate-180" />
        </Button>

        <Button onClick={onPlayPause} className="w-20 h-20 p-3">
          {playing ? (
            <Icons.Pause className="w-full h-full" />
          ) : (
            <Icons.Play className="w-full h-full" />
          )}
        </Button>

        <Button className="w-20 h-20 p-3">
          <Icons.Skip className="w-[42px] h-[42px] text-white" />
        </Button>
      </div>
    </div>
  );
}

function Volume() {
  let dragControls = useDragControls();
  let constraintsRef = useRef();
  let volume = useMotionValue(50);
  let width = useMotionTemplate`${volume}%`;
  let scrubberX = useMotionValue(0);

  useEffect(() => {
    let initialVolume = getXFromProgress({
      container: constraintsRef.current,
      progress: volume.get() / 100,
    });
    scrubberX.set(initialVolume);
  }, [scrubberX, volume]);

  return (
    <div className="flex items-center justify-between w-full mt-9">
      <Icons.VolumeMute className="h-5 text-[#A29CC0]" />

      <div className="relative flex-1 mx-3">
        <div
          ref={constraintsRef}
          className="w-full h-[3px] bg-[#5A526F] rounded-full"
        ></div>
        <div
          className="absolute inset-0 flex items-center w-full"
          onPointerDown={(event) => {
            let newVolume = getProgress({
              container: constraintsRef.current,
              event,
            });
            dragControls.start(event, { snapToCursor: true });
            volume.set(newVolume * 100);
          }}
        >
          <motion.div
            style={{ width }}
            className="w-full h-[3px] bg-[#A29CC0] rounded-full"
          ></motion.div>
          <motion.button
            style={{ x: scrubberX }}
            drag="x"
            dragConstraints={constraintsRef}
            dragControls={dragControls}
            dragElastic={0}
            dragMomentum={false}
            onDrag={(event) => {
              let newVolume = getProgress({
                container: constraintsRef.current,
                event,
              });
              volume.set(newVolume * 100);
            }}
            className="absolute w-5 h-5 -ml-[5px] bg-white rounded-full cursor-grab active:cursor-grabbing"
          ></motion.button>
        </div>
      </div>

      <Icons.VolumeHigh className="h-5 text-[#A29CC0]" />
    </div>
  );
}

function IconBar() {
  return (
    <div className="flex px-[46px] mt-6 justify-between">
      <button className="text-[#A29CC0] active:text-white p-1">
        <Icons.Lyrics className="h-[21px]" />
      </button>
      <button className="text-[#A29CC0] active:text-white p-1">
        <Icons.AirPlay className="h-[21px]" />
      </button>
      <button className="text-[#A29CC0] active:text-white p-1">
        <Icons.List className="h-[21px]" />
      </button>
    </div>
  );
}

function getProgress({ container, event }) {
  let { x, width } = container.getBoundingClientRect();
  let draggedProgress = (event.clientX - x) / width;
  let newProgress =
    draggedProgress > 1 ? 1 : draggedProgress < 0 ? 0 : draggedProgress;

  return newProgress;
}

function getXFromProgress({ container, progress }) {
  let { width } = container.getBoundingClientRect();
  let newX = progress * width;

  return newX;
}

function Button({ children, onClick = () => {}, className }) {
  let [pressing, setPressing] = useState(false);

  return (
    <AnimatePresence initial={false}>
      <motion.button
        animate={pressing ? "pressed" : "unpressed"}
        onTapStart={() => {
          setPressing(true);
        }}
        onTap={() => {
          setPressing(false);
          onClick();
        }}
        className={`flex items-center justify-center relative text-white rounded-full ${className}`}
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
          {children}
        </motion.span>
      </motion.button>
    </AnimatePresence>
  );
}
