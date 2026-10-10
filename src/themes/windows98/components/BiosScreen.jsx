import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  portfolioData,
  createBiosGroups,
  getVisitorSystemInfo,
  formatBiosStatusLine
} from '../../../data/portfolioData';
import { useSound } from '../../../context/SoundContext';

export default function BiosScreen({ onComplete }) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const timerRef = useRef(null);
  const { playSound } = useSound();

  // Detect real visitor browser/system parameters on client mount
  const groups = useMemo(() => {
    const sysInfo = getVisitorSystemInfo();
    return createBiosGroups(sysInfo);
  }, []);

  // Flatten lines for sequential hardware POST terminal printing
  const flatLines = useMemo(() => {
    const list = [];
    groups.forEach((group, gIdx) => {
      group.lines.forEach((line, lIdx) => {
        const fullText = line.text || formatBiosStatusLine(line.label, line.status, 34);
        list.push({
          ...line,
          groupId: group.id,
          groupIndex: gIdx,
          lineIndexInGroup: lIdx,
          fullText
        });
      });
    });
    return list;
  }, [groups]);

  const totalLines = flatLines.length;

  useEffect(() => {
    let isCancelled = false;
    let lineIdx = 0;
    let charIdx = 0;

    const tick = () => {
      if (isCancelled) return;

      if (lineIdx >= flatLines.length) {
        setIsCompleted(true);
        return;
      }

      const line = flatLines[lineIdx];
      const text = line.fullText;

      // Fast hardware terminal character burst:
      // Dot leaders stream in 3-5 dots, regular text streams in 2-3 characters
      const remaining = text.length - charIdx;
      let charsToAdd = 1;
      const nextChar = text[charIdx];

      if (nextChar === '.') {
        charsToAdd = Math.min(remaining, Math.floor(Math.random() * 3) + 3); // 3-5 dots
      } else {
        charsToAdd = Math.min(remaining, Math.random() > 0.35 ? 3 : 2); // 2-3 chars
      }

      charIdx += charsToAdd;

      setCurrentLineIndex(lineIdx);
      setCurrentCharIndex(charIdx);

      if (charIdx >= text.length) {
        // Line finished, advance to next line
        lineIdx++;
        charIdx = 0;

        if (lineIdx >= flatLines.length) {
          setIsCompleted(true);
          return;
        }

        const nextLine = flatLines[lineIdx];
        const isMajorSection = nextLine.groupId !== line.groupId;

        // Very short pauses between individual checks; slightly longer between major sections
        const pause = isMajorSection
          ? (70 + Math.random() * 30) // 70ms - 100ms between major sections
          : (14 + Math.random() * 14); // 14ms - 28ms between individual checks

        timerRef.current = setTimeout(tick, pause);
      } else {
        // Fast mechanical character delay (3ms - 7ms)
        const charDelay = 3 + Math.random() * 4;
        timerRef.current = setTimeout(tick, charDelay);
      }
    };

    // Short initial POST trigger delay
    timerRef.current = setTimeout(tick, 40);

    return () => {
      isCancelled = true;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [flatLines]);

  const completeImmediately = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsCompleted(true);
    setCurrentLineIndex(totalLines);
    setCurrentCharIndex(0);
  };

  const handleProceed = () => {
    document.body.classList.add('desktop-mode');
    playSound('microsoft');
    if (onComplete) onComplete();
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        if (!isCompleted) {
          completeImmediately();
        } else {
          handleProceed();
        }
      } else if (!isCompleted) {
        completeImmediately();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCompleted]);

  const handleClick = () => {
    if (!isCompleted) {
      completeImmediately();
    } else {
      handleProceed();
    }
  };

  let globalIndexCounter = 0;

  return (
    <div
      id="bios-screen"
      data-layer="bios-boot-screen"
      className="BiosBootScreen"
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="BiosContainer">
        {groups.map((group) => {
          // Check if any line in this group has started printing
          const groupStartIndex = globalIndexCounter;
          const groupHasStarted = isCompleted || currentLineIndex >= groupStartIndex;

          if (!groupHasStarted) {
            // Count lines for indices
            globalIndexCounter += group.lines.length;
            return null;
          }

          return (
            <div key={group.id} className={`bios-group bios-group-${group.id}`}>
              {group.lines.map((line, idx) => {
                const lineGlobalIdx = globalIndexCounter++;
                const isLineFinished = isCompleted || lineGlobalIdx < currentLineIndex;
                const isLineActive = !isCompleted && lineGlobalIdx === currentLineIndex;

                if (!isLineFinished && !isLineActive) {
                  return null;
                }

                const fullText = line.text || formatBiosStatusLine(line.label, line.status, 34);
                const displayText = isLineFinished
                  ? fullText
                  : fullText.slice(0, currentCharIndex);

                return (
                  <div
                    key={idx}
                    id={line.id}
                    className={`bios-line ${line.className || ''} ${line.highlight ? 'bios-highlight' : ''}`}
                  >
                    {line.hasCursor ? (
                      isLineFinished ? (
                        <>
                          Press &lt;ENTER&gt; to continue<span className="cursor">_</span>
                        </>
                      ) : (
                        <>
                          {displayText}
                          <span className="terminal-active-cursor">_</span>
                        </>
                      )
                    ) : (
                      <>
                        {displayText}
                        {isLineActive && <span className="terminal-active-cursor">_</span>}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
