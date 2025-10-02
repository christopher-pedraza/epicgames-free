import React from 'react';
import GameCard from './GameCard';
import './GameGrid.css';

const GameGrid = ({ games, isUpcoming = false }) => {
    if (games.length > 0) {
        return (
            <div className="games-grid">
                {games.map(game => (
                    <GameCard key={game.id} game={game} />
                ))}
            </div>
        );
    }
    
    return (
        <div className="status-message">
            {isUpcoming ? "Next week's games haven't been announced yet." : "No free games found this week. Check back later!"}
        </div>
    );
};

export default GameGrid;