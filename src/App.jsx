import React, { useState, useEffect } from 'react';
import { CircleLoader } from 'react-spinners'; // Assuming you installed this
import './App.css';

const FreeGamesList = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = '/api/freeGamesPromotions?locale=en-US&country=US&allowCountries=US';

    useEffect(() => {
        const fetchFreeGames = async () => {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                
                const gameElements = data.data.Catalog.searchStore.elements;

                const now = new Date();
                const currentFreeGames = gameElements.filter(game => {
                    if (game.promotions && game.promotions.promotionalOffers && game.promotions.promotionalOffers.length > 0) {
                        const offer = game.promotions.promotionalOffers[0].promotionalOffers[0];
                        return new Date(offer.startDate) <= now && now <= new Date(offer.endDate);
                    }
                    return false;
                });
                
                const formattedGames = currentFreeGames.map(game => {
                    const thumbnailImage = game.keyImages.find(img => img.type === 'Thumbnail');
                    const slug = game.productSlug || (game.catalogNs.mappings[0] && game.catalogNs.mappings[0].pageSlug);
                    let storeLink = 'https://www.epicgames.com/store/en-US/free-games';
                    if (slug) {
                        storeLink = `https://www.epicgames.com/store/en-US/p/${slug}`;
                    }
                    return {
                        id: game.id,
                        title: game.title,
                        description: game.description,
                        storeLink: storeLink,
                        thumbnail: thumbnailImage ? thumbnailImage.url : '',
                    };
                });

                setGames(formattedGames);
            } catch (e) {
                setError(e.message);
                console.error("Failed to fetch free games:", e);
            } finally {
                // Use a small timeout to make the loading feel smoother
                setTimeout(() => setLoading(false), 500); 
            }
        };

        fetchFreeGames();
    }, []);

    // We no longer need the separate loading return here.

    return (
        <div className="app-container">
            <header>
                <h1>This Week's Free Games on Epic</h1>
            </header>
            <main>
                {/* --- THIS IS THE KEY CHANGE --- */}
                {/* We use a ternary operator to switch between Loader and Content */}
                {loading ? (
                    <div className="loader-container">
                        <CircleLoader color="#007bff" size={80} />
                    </div>
                ) : error ? (
                    <div className="status-message">Error fetching games: {error} 😥</div>
                ) : (
                    <div className="games-grid">
                        {games.length > 0 ? (
                            games.map(game => (
                                <div key={game.id} className="game-card">
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
                            ))
                        ) : (
                            <div className="status-message">No free games found this week. Check back later!</div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default FreeGamesList;