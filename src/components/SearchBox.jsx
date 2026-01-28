import { useState, useRef, useEffect } from 'react';
import CustomDropdown from './CustomDropdown';


export default function SearchBox({ onSearch, loading }) {
    const [query, setQuery] = useState('');
    const [language, setLanguage] = useState('en');
    const [isListening, setIsListening] = useState(false);
    const [voiceError, setVoiceError] = useState('');
    const recognitionRef = useRef(null);

    useEffect(() => {
        // Initialize Speech Recognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.maxAlternatives = 1;

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setQuery(prev => prev ? prev + ' ' + transcript : transcript);
                setIsListening(false);
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setVoiceError(`Voice error: ${event.error}`);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query);
        }
    };

    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
        setVoiceError('');
    };

    const handleVoiceInput = () => {
        if (!recognitionRef.current) {
            setVoiceError('Voice input not supported in this browser');
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
            return;
        }

        // Set language for speech recognition
        const langCode = getSpeechLanguageCode();
        recognitionRef.current.lang = langCode;

        try {
            recognitionRef.current.start();
            setIsListening(true);
            setVoiceError('');
        } catch (error) {
            console.error('Failed to start voice recognition:', error);
            setVoiceError('Failed to start voice input');
        }
    };

    // Map our language codes to Speech Recognition language codes
    const getSpeechLanguageCode = () => {
        const langMap = {
            'en': 'en-US',
            'hi': 'hi-IN',
            'ta': 'ta-IN',
            'te': 'te-IN',
            'bn': 'bn-IN',
            'mr': 'mr-IN'
        };
        return langMap[language] || 'en-US';
    };

    // Language configuration for transliterate
    const getLanguageCode = () => {
        const langMap = {
            'en': 'en',
            'hi': 'hi',
            'ta': 'ta',
            'te': 'te',
            'bn': 'bn',
            'mr': 'mr'
        };
        return langMap[language] || 'en';
    };

    const getLanguageName = () => {
        const names = {
            'hi': 'Hindi',
            'ta': 'Tamil',
            'te': 'Telugu',
            'bn': 'Bengali',
            'mr': 'Marathi'
        };
        return names[language] || '';
    };

    const getPlaceholder = () => {
        const placeholders = {
            'hi': 'उदाहरण: गारमेंट फैक्ट्री में सिलाई मशीन ऑपरेटर',
            'ta': 'உதாரணம்: ஆடை தொழிற்சாலையில் தையல் இயந்திர இயக்குனர்',
            'te': 'ఉదాహరణ: గార్మెంట్ ఫ్యాక్టరీలో కుట్టు యంత్ర నిర్వహణాధికారి',
            'bn': 'উদাহরণ: গার্মেন্ট ফ্যাক্টরিতে সেলাই মেশিন অপারেটর',
            'mr': 'उदाहरण: गारमेंट कारखान्यात शिवणकाम यंत्र ऑपरेटर'
        };
        return placeholders[language] || 'Type here...';
    };

    return (
        <form onSubmit={handleSubmit} className="search-box">
            {/* Multiline text input */}
            <div className="mb-4">
                <label htmlFor="search-query" className="label">
                    Enter job title or description
                </label>
                <textarea
                    id="search-query"
                    rows="4"
                    className="textarea-field"
                    placeholder={getPlaceholder()}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    disabled={loading}
                />
                {language !== 'en' && (
                    <p className="text-sm" style={{ color: 'var(--text-tertiary)', marginTop: '0.5rem' }}>
                        Use your system keyboard to type in {getLanguageName()}, or use voice input below.
                    </p>
                )}
                {voiceError && (
                    <p className="text-sm" style={{ color: '#dc2626', marginTop: '0.5rem' }}>
                        {voiceError}
                    </p>
                )}
                {isListening && (
                    <p className="text-sm" style={{ color: '#2563eb', marginTop: '0.5rem' }}>
                        Listening... Speak now in {getLanguageName() || 'English'}
                    </p>
                )}
            </div>

            {/* Options row */}
            <div className="search-options">
                {/* Voice input button */}
                <button
                    type="button"
                    onClick={handleVoiceInput}
                    className={`voice-btn ${isListening ? 'listening' : ''}`}
                    disabled={loading}
                    title={`Click to ${isListening ? 'stop' : 'start'} voice input in ${getLanguageName() || 'English'}`}
                    style={isListening ? {
                        backgroundColor: '#dc2626',
                        color: 'white',
                        borderColor: '#dc2626'
                    } : {}}
                >
                    <span>{isListening ? 'Stop Recording' : 'Voice Input'}</span>
                </button>

                {/* Language selector */}
                <CustomDropdown
                    value={language}
                    onChange={handleLanguageChange}
                    disabled={loading || isListening}
                    options={[
                        { value: 'en', label: 'English' },
                        { value: 'hi', label: 'हिन्दी (Hindi)' },
                        { value: 'bn', label: 'বাংলা (Bengali)' },
                        { value: 'ta', label: 'தமிழ் (Tamil)' },
                        { value: 'te', label: 'తెలుగు (Telugu)' },
                        { value: 'mr', label: 'मराठी (Marathi)' }
                    ]}
                />
            </div>

            {/* Search button */}
            <div className="flex justify-end">
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading || !query.trim() || isListening}
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <svg className="spinner-circle-active" style={{ width: '20px', height: '20px' }} viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <span>Searching...</span>
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            <span>Search NCO Occupations</span>
                        </span>
                    )}
                </button>
            </div>
        </form>
    );
}
