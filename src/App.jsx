import React, { useState, useEffect } from 'react';
import { CircleLoader } from 'react-spinners';
import './App.css';

const FreeGamesList = () => {
    const [currentGames, setCurrentGames] = useState([]);
    const [upcomingGames, setUpcomingGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // const API_URL = '/api/freeGamesPromotions?locale=en-US&country=US&allowCountries=US';
    const API_URL = 'https://api.allorigins.win/raw?url=https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?locale=en-US&country=US&allowCountries=US';

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

                const current = [];
                const upcoming = [];

                const formatGame = (game) => {
                    const thumbnailImage = game.keyImages.find(img => img.type === 'Thumbnail');
                    const slug = game.productSlug || (game.catalogNs.mappings && game.catalogNs.mappings[0] && game.catalogNs.mappings[0].pageSlug);
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
                };

                gameElements.forEach(game => {
                    const promotions = game.promotions;

                    // **CORRECTED LOGIC FOR CURRENT GAMES**
                    // Check the standard promotionalOffers array for active promotions.
                    if (promotions && promotions.promotionalOffers && promotions.promotionalOffers.length > 0) {
                        const offer = promotions.promotionalOffers[0].promotionalOffers[0];
                        const startDate = new Date(offer.startDate);
                        const endDate = new Date(offer.endDate);

                        if (startDate <= now && now <= endDate) {
                            current.push(formatGame(game));
                        }
                    }

                    // **CORRECTED LOGIC FOR UPCOMING GAMES**
                    // Check the dedicated upcomingPromotionalOffers array.
                    if (promotions && promotions.upcomingPromotionalOffers && promotions.upcomingPromotionalOffers.length > 0) {
                        const upcomingOffers = promotions.upcomingPromotionalOffers[0].promotionalOffers;
                        
                        // Find the specific offer that is free (discount percentage is 0).
                        const freeUpcomingOffer = upcomingOffers.find(offer => offer.discountSetting.discountPercentage === 0);
                        
                        if (freeUpcomingOffer) {
                            upcoming.push(formatGame(game));
                        }
                    }
                });

                setCurrentGames(current);
                setUpcomingGames(upcoming);

            } catch (e) {
                setError(e.message);
                console.error("Failed to fetch free games:", e);
            } finally {
                setTimeout(() => setLoading(false), 500); 
            }
        };

        fetchFreeGames();
    }, []);

    const renderGameGrid = (games, isUpcoming = false) => {
        if (games.length > 0) {
            return (
                <div className="games-grid">
                    {games.map(game => (
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

    return (
        <div className="app-container">
            <header>
                <h1>Epic's Free Games</h1>
            </header>
            <main>
                {loading ? (
                    <div className="loader-container">
                        <CircleLoader color="#007bff" size={80} />
                    </div>
                ) : error ? (
                    <div className="status-message">Error fetching games: {error} 😥</div>
                ) : (
                    <>
                        <h2 className="section-title">Available Now</h2>
                        {renderGameGrid(currentGames)}
                        
                        <h2 className="section-title">Coming Soon</h2>
                        {renderGameGrid(upcomingGames, true)}
                    </>
                )}
            </main>
        </div>
    );
};

export default FreeGamesList;