import './GameCard.css';

const formatFriendlyDate = (isoString) => {
    if (!isoString) return null;
    try {
        const d = new Date(isoString);
        return d.toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
        return null;
    }
}

const GameCard = ({ game }) => {
    const startFriendly = formatFriendlyDate(game.startDate);
    const endFriendly = formatFriendlyDate(game.endDate);

    const dateLabel = () => {
        if (startFriendly && endFriendly) {
            // If the start date is in the future, show "Free from X - Y" otherwise show "Free until Y"
            const now = new Date();
            const start = new Date(game.startDate);
            const end = new Date(game.endDate);
            if (start > now) {
                return `Free from ${startFriendly} to ${endFriendly}`;
            }
            return `Free until ${endFriendly}`;
        }
        if (endFriendly) return `Free until ${endFriendly}`;
        if (startFriendly) return `Free from ${startFriendly}`;
        return null;
    }

    const label = dateLabel();

    return (
        <div className="game-card">
            <a href={game.storeLink} target="_blank" rel="noopener noreferrer">
                <div className="thumbnail-container">
                    <img src={game.thumbnail} alt={game.title} className="game-thumbnail" />
                </div>
                <div className="game-info">
                    <h3>{game.title}</h3>
                    <p>{game.description}</p>
                    {label && <div className="game-expiry">{label}</div>}
                </div>
            </a>
        </div>
    );
};

export default GameCard;