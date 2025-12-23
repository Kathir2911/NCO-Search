export default function LoadingState({ message = 'Loading...' }) {
    return (
        <div className="loading-container">
            <div className="spinner">
                <div className="spinner-circle"></div>
                <div className="spinner-circle spinner-circle-active"></div>
            </div>
            <p className="text-gray-600 font-medium">{message}</p>
        </div>
    );
}
