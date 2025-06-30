import { motion } from "framer-motion";
import "./home.css";
import intro_hero from "./assets/intro.png";
import map from "./assets/bg.png";
import { characters, heros } from "./context/data";
import { RiTwitterXFill } from "react-icons/ri";
import { GiRaiseZombie } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./components/index.scss"

export function App() {
  const navigate = useNavigate();
  const [selectedHero, setSelectedHero] = useState(null);
  const [showHeroModal, setShowHeroModal] = useState(false);

  const startGame = () =>{
    navigate(`/game/${selectedHero.id}`);
    setShowHeroModal(false)
  }
  
  return (
    <div className="intro-wrapper">
      <div className="w100 df aic jcc pd-20 navbar">
        <div className="w100 df aic jcsb">
          <h1>Battle of Chaos</h1>
          <div className="df aic gap-20">
            <u>About Game</u>
            <u>Token Info</u>
            <button className="df aic gap-15">
              Contact Us <RiTwitterXFill />
            </button>
          </div>
        </div>
      </div>
      {/* Hero Box */}
      <div className="w100 df aic jcc hero-section">
        <div className="df aic gap-20 hero-box">
          <img src={intro_hero} className="hero-image" alt="Main Hero" />
          <div className="df fdc gap-15 hero-text">
            <h2>SAVE THE TRENCHES FROM CHAOS</h2>
            <p>
              Sign in to pre-register now and prepare for the battle. Sign in to
              pre-register now and prepare for the battle
            </p>
            <button className="start-button" onClick={() => setShowHeroModal(true)}>
              Start Game
            </button>
          </div>
        </div>
      </div>

      {/* Game Info Section */}
      <div className="w100 df aic info-section">
        <div className="df fdc gap-20 text-content">
          <h1>GAME INFO</h1>
          <p>
            In KelChago, you're the last hope in trenches, fighting relentless
            battles against evil KQLs to save your crypto comrades. Wield your
            skills in this fast-paced game to outsmart and defeat the
            influencers threatening your digital domain!
          </p>
        </div>
        <div className="preview-image">
          <img src={map} alt="Stage Preview" />
        </div>
      </div>

      {/* Character Cards */}
      <div className="w100 df aic fw jcc character-grid">
        <div className="w100 df fdc aic jcc gap-20">
          <GiRaiseZombie />
          <h1>Types of Enemies</h1>
        </div>
        {characters.map((char, index) => (
          <div className="character-card" key={index}>
            <img src={char.image} alt={char.name} className="character-image" />
            <h2>{char.name}</h2>
            <p className="role">{char.role}</p>
            <p className="role">{char.description}</p>
          </div>
        ))}
      </div>
      {/* Token Display Section */}
      <div className="w100 df fdc aic token-real-section">
        <h1>$CHAOS Token Info</h1>

        <div className="token-mainbox">
          <div className="df aic jcsb token-top">
            <div className="df aic gap-10">
              <RiTwitterXFill size={24} />
              <h2>$CHAOS</h2>
            </div>
            <button
              className="copy-button"
              onClick={() => {
                navigator.clipboard.writeText("0x4cHa0s...beACh");
                alert("Address copied!");
              }}
            >
              Copy
            </button>
          </div>
          <p className="token-address">0x4cHa0sDa3dBeAChBabeC0in291cDEaD</p>

          <div className="df aic jcsb token-stats">
            <div className="stat-box">
              <p className="label">FDV</p>
              <p className="value">$5.3M</p>
            </div>
            <div className="stat-box">
              <p className="label">Holders</p>
              <p className="value">12,842</p>
            </div>
            <div className="stat-box">
              <p className="label">Supply</p>
              <p className="value">1,000,000</p>
            </div>
            <div className="stat-box">
              <p className="label">Chain</p>
              <p className="value">Solana</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w100 df fdc aic footer">
        <p>Made with 💛 on the pixel shores of KelChago</p>
        <div className="df gap-20">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Discord</a>
        </div>
      </footer>

      {showHeroModal ? (
        <div className="hero-modal">
          <h2>Choose Your Hero</h2>
          <div className="hero-options">
            {heros.map((hero, index) => (
              <div
                key={index}
                className={`df fdc aic gap-10 hero-card ${
                  selectedHero === hero && "active"
                }`}
                onClick={() => {
                  setSelectedHero(hero);
                }}
              >
                <img src={hero.image} alt={hero.name} />
                <h3>{hero.name}</h3>
                <p>{hero.role}</p>
                <span>{hero.description}</span>
              </div>
            ))}
          </div>
          <button
            className="start-buton"
            onClick={startGame}
          >
            Select and Play
          </button>
        </div>
      ) : null}
    </div>
  );
}
