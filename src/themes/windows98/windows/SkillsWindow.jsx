import React, { useState } from 'react';
import Window from '../components/Window';
import Button from '../components/Button';
import { FolderIconSmall, CheckboxCheck } from '../components/Icons';
import { portfolioData } from '../../../data/portfolioData';
import { useSound } from '../../../context/SoundContext';

export default function SkillsWindow({
  isOpen,
  isActive,
  isMaximized,
  zIndex,
  position,
  onFocus,
  onMinimize,
  onMaximize,
  onClose,
}) {
  const { skillCategories } = portfolioData;
  const { playSound } = useSound();

  // Manage checked state for each skill item
  const [checkedSkills, setCheckedSkills] = useState(() => {
    const initial = {};
    skillCategories.forEach((cat) => {
      cat.skills.forEach((skill) => {
        const sName = skill.label || skill.name;
        initial[sName] = true;
      });
    });
    return initial;
  });

  const toggleSkill = (skillName) => {
    playSound('ding');
    setCheckedSkills((prev) => ({
      ...prev,
      [skillName]: !prev[skillName],
    }));
  };

  const handleApply = () => {
    playSound('ding');
  };

  const handleOk = () => {
    playSound('chord');
    if (onClose) onClose();
  };

  // Group into columns: Left column has 2 categories, Right column has 3 categories
  const leftCategories = skillCategories.slice(0, 2);
  const rightCategories = skillCategories.slice(2, 5);

  const renderCategoryGroup = (cat) => {
    const catTitle = cat.title || cat.category;
    return (
      <div
        key={cat.id || catTitle}
        className="SkillGroup"
        style={{
          alignSelf: 'stretch',
          paddingTop: '20px',
          paddingBottom: '10px',
          paddingLeft: '12px',
          paddingRight: '12px',
          position: 'relative',
          flexDirection: 'column',
          gap: '4px',
          display: 'flex',
        }}
      >
        {/* 3D Group Box Border */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '7px',
            bottom: 0,
            border: '1px solid #808080',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '1px',
            right: '1px',
            top: '8px',
            bottom: '1px',
            border: '1px solid white',
            pointerEvents: 'none',
          }}
        />

        {/* Group Title Badge */}
        <div
          style={{
            paddingLeft: '4px',
            paddingRight: '4px',
            left: '10px',
            top: '0px',
            position: 'absolute',
            background: '#C0C0C0',
            display: 'inline-flex',
          }}
        >
          <div
            style={{
              color: 'black',
              fontSize: '11px',
              fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
              fontWeight: 700,
            }}
          >
            {catTitle.toUpperCase()}
          </div>
        </div>

        {/* Skill Checkbox Rows */}
        {cat.skills.map((skill) => {
          const sName = skill.label || skill.name;
          const isChecked = checkedSkills[sName];
          return (
            <div
              key={skill.id || sName}
              className="SkillRow"
              style={{
                alignSelf: 'stretch',
                paddingLeft: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                userSelect: 'none',
                background: 'transparent', // Strict adherence: NO purple hover
              }}
              onClick={() => toggleSkill(sName)}
            >
              <div
                className={`CheckboxIcon ${isChecked ? '' : 'unchecked'}`}
                style={{
                  width: '13px',
                  height: '13px',
                  position: 'relative',
                  background: 'white',
                  boxShadow:
                    '2px 2px 0px black inset, -2px -2px 0px #C1C1C1 inset, 1px 1px 0px #808080 inset, -1px -1px 0px white inset',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {isChecked && (
                  <div style={{ position: 'absolute', left: '2px', top: '2px' }}>
                    <CheckboxCheck />
                  </div>
                )}
              </div>
              <div
                style={{
                  color: 'black',
                  fontSize: '11px',
                  fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                  fontWeight: 400,
                }}
              >
                {sName}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Window
      id="skills-window"
      title="SKILLS.EXE"
      icon={<FolderIconSmall />}
      isOpen={isOpen}
      isActive={isActive}
      isMaximized={isMaximized}
      zIndex={zIndex}
      position={position}
      defaultWidth={800}
      defaultHeight={640}
      hasMenu={true}
      onFocus={onFocus}
      onMinimize={onMinimize}
      onMaximize={onMaximize}
      onClose={onClose}
    >
      <div
        className="WindowClientArea"
        style={{
          alignSelf: 'stretch',
          flex: 1,
          paddingLeft: '20px',
          paddingRight: '20px',
          paddingTop: '16px',
          paddingBottom: '16px',
          background: '#C0C0C0',
          overflowY: 'auto',
          flexDirection: 'column',
          gap: '12px',
          display: 'flex',
          boxSizing: 'border-box',
        }}
      >
        {/* Header */}
        <div
          className="HeaderText"
          style={{
            alignSelf: 'stretch',
            paddingBottom: '4px',
            flexDirection: 'column',
            gap: '4px',
            display: 'flex',
          }}
        >
          <div
            className="SkillsExe"
            style={{
              color: 'black',
              fontSize: '20px',
              fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
              fontWeight: 700,
            }}
          >
            SKILLS.EXE
          </div>
          <div
            style={{
              color: '#808080',
              fontSize: '11px',
              fontFamily: 'Inter, sans-serif',
              fontStyle: 'italic',
              fontWeight: 400,
            }}
          >
            Things I know. Things I use. Things Google occasionally helps with.
          </div>
        </div>

        {/* 3D Divider */}
        <div style={{ alignSelf: 'stretch', height: '2px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ height: '1px', borderBottom: '1px solid #808080' }} />
          <div style={{ height: '1px', borderBottom: '1px solid white' }} />
        </div>

        {/* Skills Grid */}
        <div
          className="SkillsGrid"
          style={{
            alignSelf: 'stretch',
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          {/* Left Column */}
          <div
            className="LeftColumn"
            style={{
              flex: '1 1 300px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {leftCategories.map(renderCategoryGroup)}
          </div>

          {/* Right Column */}
          <div
            className="RightColumn"
            style={{
              flex: '1 1 300px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {rightCategories.map(renderCategoryGroup)}
          </div>
        </div>

        {/* Bottom Button Row */}
        <div
          className="ButtonRow"
          style={{
            alignSelf: 'stretch',
            paddingTop: '4px',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            display: 'flex',
          }}
        >
          <Button id="btn-ok-skills" onClick={handleOk}>
            OK
          </Button>
          <Button id="btn-apply-skills" onClick={handleApply}>
            Apply
          </Button>
        </div>
      </div>
    </Window>
  );
}
