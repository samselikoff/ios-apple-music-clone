import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export default function PodcastScaleEffect() {
  let [leftPlaying, setLeftPlaying] = useState(false);
  let [rightPlaying, setRightPlaying] = useState(false);

  return (
    <div className="h-screen px-4 pt-10 bg-gray-200">
      <div className="max-w-6xl mx-auto">
        <AnimatePresence initial={false}>
          <div className="flex justify-around w-full px-20 py-20 space-x-4">
            <div>
              <p className="text-sm font-medium text-center text-gray-400">
                Default transition
              </p>
              <div className="flex flex-col items-center justify-center w-full max-w-sm p-6 mt-6 bg-white rounded shadow">
                <motion.img
                  src="/frontend-first.jpg"
                  variants={{
                    grow: { scale: 1 },
                    shrink: { scale: 0.8 },
                  }}
                  animate={leftPlaying ? "grow" : "shrink"}
                  className="block w-full rounded-lg aspect-square"
                ></motion.img>
                <p className="mt-4 text-lg font-medium leading-tight text-gray-900 truncate">
                  140. Reacting to Remix!
                </p>
                <p className="leading-tight text-purple-600 truncate">
                  Frontend First — March 25, 2022
                </p>
                <div className="w-1/4 mt-4">
                  <button
                    onClick={() => setLeftPlaying(!leftPlaying)}
                    className="p-3 text-gray-900 rounded-full aspect-square"
                  >
                    {leftPlaying ? (
                      <PauseIcon className="w-full h-full" />
                    ) : (
                      <PlayIcon className="w-full h-full" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-center text-gray-400">
                Spring transition
              </p>
              <div className="flex flex-col items-center justify-center w-full max-w-sm p-6 mt-6 bg-white rounded shadow">
                <motion.img
                  src="/frontend-first.jpg"
                  variants={{
                    grow: {
                      scale: 1,
                      transition: {
                        type: "spring",
                        duration: 1,
                        bounce: 0.5,
                        delay: 0.05,
                      },
                    },
                    shrink: {
                      scale: 0.8,
                      transition: {
                        type: "spring",
                        duration: 0.7,
                        bounce: 0,
                        delay: 0.05,
                      },
                    },
                  }}
                  animate={rightPlaying ? "grow" : "shrink"}
                  className="block w-full rounded-lg aspect-square"
                ></motion.img>
                <p className="mt-4 text-lg font-medium leading-tight text-gray-900 truncate">
                  140. Reacting to Remix!
                </p>
                <p className="leading-tight text-purple-600 truncate ">
                  Frontend First — March 25, 2022
                </p>
                <div className="w-1/4 mt-4">
                  <motion.button
                    onClick={() => setRightPlaying(!rightPlaying)}
                    transition={{
                      type: "spring",
                      duration: 0.3,
                      bounce: 0.5,
                    }}
                    animate={rightPlaying ? "pause" : "play"}
                    whileTap={{ backgroundColor: "rgba(229 231 235 .20)" }}
                    variants={{
                      play: {
                        scale: [null, 0.85, 1],
                        backgroundColor: [
                          "rgba(229 231 235 .20)",
                          "rgba(229 231 235 0)",
                          "rgba(229 231 235 0)",
                        ],
                      },
                      pause: {
                        scale: [null, 0.85, 1],
                        backgroundColor: [
                          "rgba(229 231 235 .20)",
                          "rgba(229 231 235 0)",
                          "rgba(229 231 235 0)",
                        ],
                      },
                    }}
                    className="p-3 text-gray-900 rounded-full aspect-square"
                  >
                    {rightPlaying ? (
                      <PauseIcon className="w-full h-full" />
                    ) : (
                      <PlayIcon className="w-full h-full" />
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function PlayIcon(props) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M32.997 17.268c1.334.77 1.334 2.695 0 3.464L13 32.27c-1.333.769-2.999-.194-2.999-1.733V7.463c0-1.54 1.666-2.502 3-1.733l19.997 11.538z"
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
