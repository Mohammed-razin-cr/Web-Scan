import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, } from 'react-router-dom';

import colors from 'client/styles/colors';
import { determineAddressType, normalizeAddress } from 'client/utils/address-type-checker';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Globe3D from 'client/components/misc/Globe3D';
import NavigationDrawer from 'client/components/misc/NavigationDrawer';


const suggestions = ['stripe.com', 'cloudflare.com', 'github.com'];

const HomeContainer = styled.main`
  min-height: 100vh;
  overflow: hidden;
  position: relative;
  background:
    radial-gradient(circle at 46% 52%, rgba(17, 100, 102, 0.42), transparent 21rem),
    radial-gradient(circle at 45% 44%, rgba(255, 203, 154, 0.12), transparent 18rem),
    linear-gradient(110deg, #081815 0%, #0b2422 42%, #2c3531 100%);
  &:before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(209, 232, 226, 0.045) 1px, transparent 1px),
      linear-gradient(90deg, rgba(209, 232, 226, 0.04) 1px, transparent 1px);
    background-size: 92px 92px;
    mask-image: linear-gradient(90deg, black, rgba(0, 0, 0, 0.82), transparent 88%);
  }
  &:after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 35% 28%, transparent 0 16rem, rgba(4, 14, 13, 0.34) 28rem);
    pointer-events: none;
  }
`;

const Header = styled.header`
  position: relative;
  z-index: 5;
  height: auto;
  min-height: 5.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.2rem 2.7rem;
  @media (max-width: 1024px) {
    padding: 1rem 1.5rem;
  }
  @media (max-width: 640px) {
    padding: 0.9rem 1rem;
  }
`;

const Brand = styled.a`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: white;
  font-weight: 850;
  font-size: clamp(1.1rem, 2.5vw, 1.4rem);
  letter-spacing: 0.06em;
  text-transform: uppercase;

  img {
    height: clamp(1.8rem, 4vw, 2.4rem);
    width: auto;
    filter: drop-shadow(0 2px 8px rgba(76, 225, 211, 0.2));
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: rotate(5deg) scale(1.05);
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const GhostButton = styled.a`
  color: ${colors.primary};
  border: 1px solid rgba(209, 232, 226, 0.18);
  background: rgba(17, 100, 102, 0.16);
  padding: 0.8rem 1rem;
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
  &:hover {
    background: rgba(17, 100, 102, 0.36);
    border-color: rgba(209, 232, 226, 0.42);
    transform: translateY(-1px);
  }
  @media (max-width: 768px) {
    display: none;
  }
`;

const MenuButton = styled.button`
  width: 3rem;
  height: 3rem;
  display: grid;
  place-items: center;
  color: ${colors.primary};
  border: 1px solid rgba(209, 232, 226, 0.18);
  background: rgba(44, 53, 49, 0.44);
  cursor: pointer;
  touch-action: manipulation;
  svg {
    width: 1.3rem;
    height: 1.3rem;
    stroke: currentColor;
  }
`;

const Hero = styled.section`
  min-height: calc(100vh - 5.5rem);
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  overflow: hidden;
`;

const Stage = styled.div`
  position: relative;
  min-width: 0;
  min-height: calc(100vh - 5.5rem);
  padding: clamp(2rem, 8vw, 5rem) clamp(1rem, 4vw, 5.5rem);
  border-top: 1px solid rgba(209, 232, 226, 0.04);
  max-width: 50%;
  padding-bottom: 4rem;

  @media (max-width: 1024px) {
    max-width: 100%;
    padding-top: 3rem;
  }
  @media (max-width: 640px) {
    padding: 2.5rem 1.25rem;
  }
`;

const Frame = styled.div`
  position: absolute;
  left: clamp(1rem, 5vw, 5.5rem);
  right: clamp(1rem, 5vw, 5.5rem);
  top: clamp(2.5rem, 8vw, 5rem);
  bottom: 6rem;
  border: 1px solid rgba(209, 232, 226, 0.18);
  opacity: 0.72;
  pointer-events: none;
  &:before,
  &:after {
    content: '';
    position: absolute;
    width: 0.5rem;
    height: 0.5rem;
    border: 1px solid #116466;
  }
  &:before {
    left: -1px;
    top: -1px;
    border-right: 0;
    border-bottom: 0;
  }
  &:after {
    right: -1px;
    bottom: -1px;
    border-left: 0;
    border-top: 0;
  }

  @media (max-width: 1024px) {
    display: none;
  }
`;

const Copy = styled.div`
  position: relative;
  z-index: 3;
  width: 100%;
  max-width: 48rem;
  margin-top: clamp(2rem, 10vh, 8rem);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
`;

const Welcome = styled.p`
  margin: 0 0 clamp(1.8rem, 5vw, 3.8rem);
  color: white;
  font-size: clamp(0.8rem, 2vw, 1rem);
  letter-spacing: 0.36em;
  text-transform: lowercase;
  &:after {
    content: '';
    display: block;
    width: 1rem;
    height: 1px;
    margin-top: 0.9rem;
    background: #ffcb9a;
  }
  @media (max-width: 640px) {
    letter-spacing: 0.25em;
  }
`;

const Title = styled.h1`
  margin: 0;
  color: white;
  font-size: clamp(1.9rem, 7vw, 6rem);
  line-height: 1.2;
  font-weight: 900;
  letter-spacing: clamp(0.15em, 2vw, 0.38em);
  text-transform: uppercase;
  span {
    display: block;
    color: #4ce1d3;
    font-size: 0.78em;
  }
  @media (max-width: 640px) {
    letter-spacing: 0.18em;
  }
`;

const ScanForm = styled.form`
  width: min(100%, 46rem);
  margin-top: clamp(1.8rem, 6vw, 3.5rem);
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 100px;
  border: 1px solid rgba(209, 232, 226, 0.15);
  background: rgba(8, 24, 21, 0.65);
  backdrop-filter: blur(20px);
  box-shadow: 
    0 10px 30px -10px rgba(0, 0, 0, 0.5),
    0 0 40px rgba(17, 100, 102, 0.15);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &:focus-within {
    border-color: rgba(76, 225, 211, 0.5);
    box-shadow: 
      0 10px 30px -10px rgba(0, 0, 0, 0.5),
      0 0 50px rgba(76, 225, 211, 0.25);
    background: rgba(8, 26, 23, 0.8);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    border-radius: 18px;
    padding: 1rem;
    gap: 0.85rem;
  }
  @media (max-width: 480px) {
    border-radius: 16px;
  }

  input {
    border: 0;
    background: transparent;
    padding: 0.9rem 1.5rem;
    color: #e2f7f1;
    font-size: clamp(0.95rem, 2.5vw, 1.1rem);
    letter-spacing: 0.03em;
    font-weight: 500;
    width: 100%;
    outline: none;
    box-shadow: none;
    touch-action: manipulation;

    &::placeholder {
      color: rgba(209, 232, 226, 0.45);
      letter-spacing: 0.05em;
      text-transform: none;
    }

    &:focus {
      box-shadow: none;
      background: transparent;
    }
  }

  label {
    display: none;
  }
`;

const SubmitButton = styled.button`
  border: 0;
  border-radius: 100px;
  color: #051311;
  background: linear-gradient(135deg, #4ce1d3 0%, #116466 100%);
  font-weight: 800;
  font-size: clamp(0.85rem, 2.3vw, 1rem);
  letter-spacing: 0.12em;
  padding: 0 clamp(1.5rem, 4vw, 2.25rem);
  height: clamp(3rem, 7vw, 3.75rem);
  min-height: 3rem;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(76, 225, 211, 0.3);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  touch-action: manipulation;

  &:hover {
    background: linear-gradient(135deg, #ffcb9a 0%, #d9b08c 100%);
    color: #0b2422;
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(255, 203, 154, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    width: 100%;
    border-radius: 12px;
  }
`;

const ErrorMessage = styled.p`
  grid-column: 1 / -1;
  margin: 0.5rem 0.5rem 0;
  padding: 0.85rem 1.25rem;
  color: #ffcb9a;
  background: rgba(217, 176, 140, 0.08);
  border: 1px dashed rgba(217, 176, 140, 0.25);
  border-radius: 50px;
  font-size: clamp(0.8rem, 2vw, 0.9rem);
  font-weight: 500;
  letter-spacing: 0.02em;
  text-align: center;
`;

const Suggestions = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  margin-top: clamp(1rem, 4vw, 1.8rem);
  padding-left: 1.5rem;
  color: rgba(209, 232, 226, 0.55);
  font-size: clamp(0.78rem, 2vw, 0.9rem);
  font-weight: 500;
  letter-spacing: 0.04em;

  @media (max-width: 768px) {
    padding-left: 0.75rem;
    gap: 0.6rem;
  }

  button {
    border: 1px solid rgba(209, 232, 226, 0.12);
    background: rgba(209, 232, 226, 0.03);
    color: rgba(209, 232, 226, 0.8);
    padding: 0.5rem 1rem;
    border-radius: 50px;
    font-size: clamp(0.72rem, 1.8vw, 0.8rem);
    font-weight: 600;
    cursor: pointer;
    text-transform: lowercase;
    letter-spacing: 0.04em;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    touch-action: manipulation;

    &:hover {
      color: #4ce1d3;
      background: rgba(76, 225, 211, 0.08);
      border-color: rgba(76, 225, 211, 0.35);
      transform: translateY(-1px) scale(1.03);
      box-shadow: 0 4px 12px rgba(76, 225, 211, 0.1);
    }

    &:active {
      transform: translateY(0) scale(1);
    }
  }
`;

const BottomTools = styled.div`
  position: absolute;
  z-index: 4;
  right: 2rem;
  bottom: 2rem;
  display: flex;
  border-radius: 999px;
  border: 1px solid rgba(209, 232, 226, 0.25);
  background: rgba(8, 24, 21, 0.85);
  backdrop-filter: blur(16px);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.25);
  overflow: hidden;

  button,
  a {
    min-width: 3.25rem;
    height: 3.25rem;
    display: grid;
    place-items: center;
    border: 0;
    border-right: 1px solid rgba(209, 232, 226, 0.16);
    background: transparent;
    color: rgba(255, 255, 255, 0.88);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 0 1rem;
    transition: all 0.2s ease;
    touch-action: manipulation;
    text-decoration: none;
  }

  button:hover,
  a:hover {
    color: #4ce1d3;
    background: rgba(76, 225, 211, 0.12);
  }

  button:last-child {
    border-right: 0;
  }

  svg {
    width: 1.1rem;
    height: 1.1rem;
    stroke: currentColor;
  }

  @media (max-width: 1024px) {
    display: none;
  }
`;

const IconMenu = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

const Home = () => {
  const [userInput, setUserInput] = useState('');
  const [errorMsg, setErrMsg] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const urlFromQuery = query.get('url');
    if (urlFromQuery) {
      const target = normalizeAddress(urlFromQuery);
      if (target) navigate(`/check/${target}`, { replace: true });
    }
  }, [navigate, location.search]);

  const submit = () => {
    const address = normalizeAddress(userInput);
    const addressType = determineAddressType(address);

    if (addressType === 'empt') {
      setErrMsg('Enter a domain, URL, IPv4, or IPv6 address');
    } else if (addressType === 'err') {
      setErrMsg('Enter a valid domain, URL, IPv4, or IPv6 address');
    } else {
      const resultRouteParams = { state: { address, addressType } };
      navigate(`/check/${address}`, resultRouteParams);
    }
  };

  const inputChange = (event) => {
    setUserInput(event.target.value);
    const isError = ['err', 'empt'].includes(determineAddressType(event.target.value));
    if (!isError) setErrMsg('');
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      submit();
    }
  };

  const formSubmitEvent = (event) => {
    event.preventDefault();
    submit();
  };

  return (
    <HomeContainer>
      <NavigationDrawer isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <Header>
        <Brand href="/check" aria-label="WebScan home">
          <img src="/logo-icon-transparent.png" alt="WebScan Logo" />
          WEBSCAN
        </Brand>
        <HeaderActions>
          <GhostButton href="https://github.com/Mohammed-razin-cr/" target="_blank" rel="noreferrer">
            GitHub
          </GhostButton>
          <MenuButton type="button" aria-label="Open navigation" onClick={() => setMenuOpen(true)}>
            <IconMenu />
          </MenuButton>
        </HeaderActions>
      </Header>
      <Hero>
        <Globe3D />
        <Stage>
          <Frame />

          <Copy>
            <Welcome>welcome</Welcome>
            <Title>
              <span>WebScan</span>
              has
              <br />
              arrived
            </Title>
            <ScanForm onSubmit={formSubmitEvent}>
              <label htmlFor="user-input">Website or IP address</label>
              <input
                id="user-input"
                value={userInput}
                name="url"
                placeholder="Enter domain, URL, or IP address..."
                disabled={false}
                onChange={inputChange}
                onKeyDown={handleKeyPress}
              />
              <SubmitButton type="submit" onClick={submit}>
                Discover
              </SubmitButton>
              {errorMsg && <ErrorMessage>{errorMsg}</ErrorMessage>}
            </ScanForm>
            <Suggestions>
              Try
              {suggestions.map((suggestion) => (
                <button key={suggestion} type="button" onClick={() => setUserInput(suggestion)}>
                  {suggestion}
                </button>
              ))}
            </Suggestions>
          </Copy>
           <BottomTools aria-label="Quick actions">
            <a href="/check/about">More</a>
            <a href="https://github.com/Mohammed-razin-cr/" target="_blank" rel="noreferrer">
              Contact
            </a>
            <button type="button" aria-label="Export report" onClick={copyToClipboard}>
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
                <path d="M12 3v12m0-12 4 4m-4-4-4 4M5 14v5h14v-5" />
              </svg>
            </button>
            <a href="/check/github.com" aria-label="Analytics">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
                <path d="M5 19V9m7 10V5m7 14v-7" />
              </svg>
            </a>
            <button type="button" aria-label="Fullscreen" onClick={toggleFullscreen}>
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2">
                <path d="M8 3H3v5M16 3h5v5M8 21H3v-5M21 16v5h-5" />
              </svg>
            </button>
          </BottomTools>
          <ToastContainer position="bottom-left" theme="dark" autoClose={3000} />
        </Stage>

      </Hero>
    </HomeContainer>
  );
};

export default Home;
