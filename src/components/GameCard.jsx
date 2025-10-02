import React from 'react';
import './GameCard.css';

const GameCard = ({ game }) => {
    return (
        <div className="game-card">
            <a href={game.storeLink} target="_blank" rel="noopener noreferrer">
                <div className="thumbnail-container">
                    <img src={game.thumbnail} alt={game.title} className="game-thumbnail" />
                </div>
                <div className="game-info">
                    <h3>{game.title}</h3>
                    <p>{game.description}</p>
                </div>
            </a>
        </div>
    );
};

export default GameCard;