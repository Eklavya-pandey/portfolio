import React, { useState, useRef } from 'react';
import Window from '../components/Window';
import Button from '../components/Button';
import { FolderIconSmall } from '../components/Icons';
import { portfolioData } from '../../../data/portfolioData';
import { useSound } from '../../../context/SoundContext';

export default function HelloWindow({
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
  const contact = portfolioData.contact || portfolioData.profile || {};
  const { playSound } = useSound();

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const hasTriggeredRingin = useRef(false);

  const handleInputFocus = () => {
    if (!hasTriggeredRingin.current) {
      hasTriggeredRingin.current = true;
      playSound('ringin');
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!formData.name.trim() && !formData.email.trim() && !formData.message.trim()) {
      playSound('notify');
      alert('Please fill in your details before sending.');
      return;
    }

    playSound('ringout');

    setTimeout(() => {
      playSound('tada');
      alert(`Thank you, ${formData.name || 'friend'}!\n\nYour message has been sent to Naveen Kumar Pandey.`);
      setFormData({ name: '', email: '', message: '' });
      hasTriggeredRingin.current = false;
    }, 700);
  };

  return (
    <Window
      id="hello-window"
      title="HELLO.EXE"
      icon={<FolderIconSmall />}
      isOpen={isOpen}
      isActive={isActive}
      isMaximized={isMaximized}
      zIndex={zIndex}
      position={position}
      defaultWidth={720}
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
          boxShadow:
            '2px 2px 0px black inset, -2px -2px 0px #C1C1C1 inset, 1px 1px 0px #808080 inset, -1px -1px 0px white inset',
          overflowY: 'auto',
          flexDirection: 'column',
          gap: '14px',
          display: 'flex',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            alignSelf: 'stretch',
            color: '#808080',
            fontSize: '11px',
            fontFamily: 'Inter, sans-serif',
            fontStyle: 'italic',
            fontWeight: 400,
          }}
        >
          &quot;You've made it this far. Might as well say hi.&quot;
        </div>

        {/* Heading */}
        <div style={{ alignSelf: 'stretch', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div
            style={{
              color: 'black',
              fontSize: '18px',
              fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
              fontWeight: 700,
            }}
          >
            CONTACT NAVEEN
          </div>
          <div
            style={{
              color: 'black',
              fontSize: '11px',
              fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
              fontWeight: 400,
            }}
          >
            Have a project, product, idea, or interesting problem?
          </div>
          <div
            style={{
              color: '#000080',
              fontSize: '11px',
              fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
              fontWeight: 700,
            }}
          >
            Let's talk.
          </div>
        </div>

        {/* 3D Divider */}
        <div style={{ alignSelf: 'stretch', height: '2px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ height: '1px', borderBottom: '1px solid #808080' }} />
          <div style={{ height: '1px', borderBottom: '1px solid white' }} />
        </div>

        {/* Columns: Info on Left, Form on Right */}
        <div
          className="ContentColumns"
          style={{
            alignSelf: 'stretch',
            flex: 1,
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          {/* Left: Contact Info */}
          <div
            style={{
              flex: '1 1 240px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div
                style={{
                  color: '#808080',
                  fontSize: '10px',
                  fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                  fontWeight: 700,
                  letterSpacing: '0.80px',
                }}
              >
                EMAIL
              </div>
              <a
                href={`mailto:${contact.email}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  color: '#000080',
                  fontSize: '11px',
                  fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                  fontWeight: 400,
                  textDecoration: 'none',
                }}
              >
                {contact.email}
              </a>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div
                style={{
                  color: '#808080',
                  fontSize: '10px',
                  fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                  fontWeight: 700,
                  letterSpacing: '0.80px',
                }}
              >
                LINKEDIN
              </div>
              <a
                href={contact.linkedin}
                target="_blank"
                rel="noreferrer"
                style={{
                  color: '#000080',
                  fontSize: '11px',
                  fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                  fontWeight: 400,
                  textDecoration: 'none',
                }}
              >
                linkedin.com/in/naveen-pandey85/
              </a>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div
                style={{
                  color: '#808080',
                  fontSize: '10px',
                  fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                  fontWeight: 700,
                  letterSpacing: '0.80px',
                }}
              >
                BEHANCE
              </div>
              <a
                href={contact.behance}
                target="_blank"
                rel="noreferrer"
                style={{
                  color: '#000080',
                  fontSize: '11px',
                  fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                  fontWeight: 400,
                  textDecoration: 'none',
                }}
              >
                behance.net/naveen_pandey
              </a>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div
                style={{
                  color: '#808080',
                  fontSize: '10px',
                  fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                  fontWeight: 700,
                  letterSpacing: '0.80px',
                }}
              >
                LOCATION
              </div>
              <div
                style={{
                  color: 'black',
                  fontSize: '11px',
                  fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                  fontWeight: 400,
                }}
              >
                {contact.location}
              </div>
            </div>
          </div>

          {/* Right: Send Message Form Group */}
          <div
            style={{
              flex: '1 1 280px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              className="GroupSendMessage"
              style={{
                alignSelf: 'stretch',
                paddingTop: '22px',
                paddingBottom: '12px',
                paddingLeft: '14px',
                paddingRight: '14px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
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
                  SEND MESSAGE
                </div>
              </div>

              {/* Name */}
              <div style={{ alignSelf: 'stretch', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <label
                  htmlFor="contact-name"
                  style={{
                    color: 'black',
                    fontSize: '11px',
                    fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                    fontWeight: 400,
                  }}
                >
                  Name:
                </label>
                <div
                  style={{
                    alignSelf: 'stretch',
                    padding: '4px 6px',
                    background: 'white',
                    boxShadow: '1px 1px 0px rgba(0, 0, 0, 0.20) inset',
                    outline: '1px solid #808080',
                  }}
                >
                  <input
                    type="text"
                    id="contact-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    onFocus={handleInputFocus}
                    style={{
                      width: '100%',
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                      fontSize: '11px',
                      color: 'black',
                    }}
                  />
                </div>
              </div>

              {/* Email */}
              <div style={{ alignSelf: 'stretch', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <label
                  htmlFor="contact-email"
                  style={{
                    color: 'black',
                    fontSize: '11px',
                    fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                    fontWeight: 400,
                  }}
                >
                  Email:
                </label>
                <div
                  style={{
                    alignSelf: 'stretch',
                    padding: '4px 6px',
                    background: 'white',
                    boxShadow: '1px 1px 0px rgba(0, 0, 0, 0.20) inset',
                    outline: '1px solid #808080',
                  }}
                >
                  <input
                    type="email"
                    id="contact-email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    onFocus={handleInputFocus}
                    style={{
                      width: '100%',
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                      fontSize: '11px',
                      color: 'black',
                    }}
                  />
                </div>
              </div>

              {/* Message */}
              <div style={{ alignSelf: 'stretch', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <label
                  htmlFor="contact-message"
                  style={{
                    color: 'black',
                    fontSize: '11px',
                    fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                    fontWeight: 400,
                  }}
                >
                  Message:
                </label>
                <div
                  style={{
                    alignSelf: 'stretch',
                    height: '60px',
                    padding: '4px 6px',
                    background: 'white',
                    boxShadow: '1px 1px 0px rgba(0, 0, 0, 0.20) inset',
                    outline: '1px solid #808080',
                  }}
                >
                  <textarea
                    id="contact-message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    onFocus={handleInputFocus}
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none',
                      outline: 'none',
                      background: 'transparent',
                      fontFamily: "'MS W98 UI', 'Segoe UI', Tahoma, sans-serif",
                      fontSize: '11px',
                      color: 'black',
                      resize: 'none',
                    }}
                  />
                </div>
              </div>

              {/* Send Button */}
              <div
                style={{
                  alignSelf: 'stretch',
                  paddingTop: '4px',
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              >
                <Button id="btn-contact-send" onClick={handleSend}>
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Window>
  );
}
