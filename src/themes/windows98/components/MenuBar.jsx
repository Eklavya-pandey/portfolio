import React from 'react';
import { useSound } from '../../../context/SoundContext';

export default function MenuBar({ items = ['File', 'Edit', 'View', 'Help'] }) {
  const { playSound } = useSound();

  const handleMenuClick = (item) => {
    if (item.toLowerCase() === 'help') {
      playSound('notify');
    } else {
      playSound('ding');
    }
  };

  return (
    <div
      className="WindowMenu"
      style={{
        alignSelf: 'stretch',
        height: '20px',
        position: 'relative',
        background: '#BFBFBF',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '2px',
        userSelect: 'none',
        borderBottom: '1px solid #808080',
        boxShadow: '0 1px 0 0 #FFFFFF',
        boxSizing: 'border-box',
      }}
    >
      {items.map((item) => {
        const firstLetter = item.charAt(0);
        const rest = item.slice(1);

        return (
          <div
            key={item}
            className="MenuItem"
            style={{
              paddingLeft: '6px',
              paddingRight: '6px',
              height: '18px',
              display: 'inline-flex',
              alignItems: 'center',
              cursor: 'pointer',
              color: 'black',
              fontSize: '11px',
              fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
              fontWeight: 400,
              lineHeight: '12px',
            }}
            onClick={() => handleMenuClick(item)}
          >
            <span style={{ textDecoration: 'underline' }}>{firstLetter}</span>
            <span>{rest}</span>
          </div>
        );
      })}
    </div>
  );
}
