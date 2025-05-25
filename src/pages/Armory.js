import React, { useState, useEffect } from 'react';
import Header from '../components/Header';

const Armory = () => {
    const [formData, setFormData] = useState({
        country_name: '',
        power: 'airpower'
    });
    const [isLoading, setIsLoading] = useState(false);
    const [taskId, setTaskId] = useState(null);
    const [progress, setProgress] = useState(0);
    const [currentStatus, setCurrentStatus] = useState('');
    const [currentPowerType, setCurrentPowerType] = useState('');
    const [scrapingData, setScrapingData] = useState({});
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const powerTypes = [
        { value: 'airpower', label: 'AIR POWER' },
        { value: 'navalpower', label: 'NAVAL POWER' },
        { value: 'droneforce', label: 'DRONE FORCE' },
        { value: 'landpower', label: 'LAND POWER' },
        { value: 'all', label: 'ALL FORCES' }
    ];

    // Poll for status updates
    useEffect(() => {
        if (taskId && isLoading) {
            const interval = setInterval(async () => {
                try {
                    const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/status/${taskId}`);
                    const data = await response.json();
                    
                    if (data.success) {
                        setProgress(data.progress || 0);
                        setCurrentStatus(data.message || '');
                        setCurrentPowerType(data.current_power_type || '');
                        setScrapingData(data.data || {});
                        
                        if (data.status === 'completed') {
                            setIsLoading(false);
                            setSuccess(true);
                            clearInterval(interval);
                        } else if (data.status === 'error') {
                            setIsLoading(false);
                            setError(data.message);
                            clearInterval(interval);
                        }
                    }
                } catch (err) {
                    console.error('Error polling status:', err);
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [taskId, isLoading]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
        setSuccess(false);
    };

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        
        if (!formData.country_name.trim()) {
            setError('Country name is required');
            return;
        }

        setIsLoading(true);
        setError('');
        setSuccess(false);
        setProgress(0);
        setCurrentStatus('Initializing scraping operation...');
        setScrapingData({});

        fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/scrape`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                setTaskId(data.task_id);
                setCurrentStatus(data.message);
            } else {
                setError(data.message || 'Failed to start scraping');
                setIsLoading(false);
            }
        })
        .catch(err => {
            setError('Network error occurred');
            setIsLoading(false);
        });
    };

    const resetForm = () => {
        setFormData({ country_name: '', power: 'airpower' });
        setIsLoading(false);
        setTaskId(null);
        setProgress(0);
        setCurrentStatus('');
        setCurrentPowerType('');
        setScrapingData({});
        setError('');
        setSuccess(false);
    };

    return (
        <div style={containerStyle}>
            <Header title="ARMORY - DATA ACQUISITION" />
            
            <div style={contentStyle}>
                <div style={terminalStyle}>
                    {/* Terminal Header */}
                    <div style={terminalHeaderStyle}>
                        <div style={terminalIndicatorStyle}></div>
                        <span style={terminalTitleStyle}>MILITARY DATA SCRAPING CONSOLE</span>
                        <div style={terminalControlsStyle}>
                            <div style={controlDotStyle('#ff5f57')}></div>
                            <div style={controlDotStyle('#ffbd2e')}></div>
                            <div style={controlDotStyle('#28ca42')}></div>
                        </div>
                    </div>

                    {/* Form Section */}
                    {!isLoading && !success && (
                        <div style={formStyle}>
                            <div style={inputGroupStyle}>
                                <div style={labelStyle}>TARGET COUNTRY:</div>
                                <input
                                    type="text"
                                    name="country_name"
                                    value={formData.country_name}
                                    onChange={handleInputChange}
                                    placeholder="Enter country name (e.g., india, russia, usa)"
                                    style={inputStyle}
                                />
                            </div>

                            <div style={inputGroupStyle}>
                                <div style={labelStyle}>POWER TYPE:</div>
                                <select
                                    name="power"
                                    value={formData.power}
                                    onChange={handleInputChange}
                                    style={selectStyle}
                                >
                                    {powerTypes.map(type => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button onClick={handleSubmit} style={submitButtonStyle}>
                                [INITIATE SCRAPING OPERATION]
                            </button>
                        </div>
                    )}

                    {/* Loading Section */}
                    {isLoading && (
                        <div style={loadingContainerStyle}>
                            <div style={statusHeaderStyle}>
                                <span>OPERATION STATUS: ACTIVE</span>
                                <span style={percentageStyle}>{Math.round(progress)}%</span>
                            </div>
                            
                            {/* Progress Bar */}
                            <div style={progressBarContainerStyle}>
                                <div style={{...progressBarStyle, width: `${progress}%`}}></div>
                                <div style={progressBarBackgroundStyle}></div>
                            </div>

                            {/* Current Status */}
                            <div style={statusMessageStyle}>
                                STATUS: {currentStatus}
                            </div>

                            {currentPowerType && (
                                <div style={currentOperationStyle}>
                                    CURRENT TARGET: {currentPowerType.toUpperCase()}
                                </div>
                            )}

                            {/* Data Progress */}
                            {Object.keys(scrapingData).length > 0 && (
                                <div style={dataProgressStyle}>
                                    <div style={dataHeaderStyle}>ACQUISITION PROGRESS:</div>
                                    {Object.entries(scrapingData).map(([powerType, info]) => (
                                        <div key={powerType} style={dataItemStyle}>
                                            <span style={powerTypeStyle}>{powerType.toUpperCase()}</span>
                                            <span style={getStatusStyle(info.status)}>
                                                {info.status.toUpperCase()} ({info.count} RECORDS)
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Animated dots */}
                            <div style={loadingDotsStyle}>
                                <span>PROCESSING</span>
                                <div style={dotsContainerStyle}>
                                    <span style={dotStyle(0)}>.</span>
                                    <span style={dotStyle(1)}>.</span>
                                    <span style={dotStyle(2)}>.</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Success Section */}
                    {success && (
                        <div style={successContainerStyle}>
                            <div style={successHeaderStyle}>
                                ✓ OPERATION COMPLETED SUCCESSFULLY
                            </div>
                            
                            <div style={summaryStyle}>
                                <div style={summaryHeaderStyle}>MISSION SUMMARY:</div>
                                {Object.entries(scrapingData).map(([powerType, info]) => (
                                    <div key={powerType} style={summaryItemStyle}>
                                        <span style={powerTypeStyle}>{powerType.toUpperCase()}</span>
                                        <span style={getStatusStyle(info.status)}>
                                            {info.count} RECORDS ACQUIRED
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <button onClick={resetForm} style={resetButtonStyle}>
                                [INITIATE NEW OPERATION]
                            </button>
                        </div>
                    )}

                    {/* Error Section */}
                    {error && (
                        <div style={errorContainerStyle}>
                            <div style={errorHeaderStyle}>⚠ OPERATION FAILED</div>
                            <div style={errorMessageStyle}>{error}</div>
                            <button onClick={resetForm} style={resetButtonStyle}>
                                [RETRY OPERATION]
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Styles
const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#0a0a0a',
    paddingTop: '60px'
};

const contentStyle = {
    padding: '40px 20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 60px)'
};

const terminalStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    border: '2px solid #4B5320',
    borderRadius: '8px',
    width: '100%',
    maxWidth: '800px',
    fontFamily: 'monospace',
    boxShadow: '0 0 20px rgba(75, 83, 32, 0.3)'
};

const terminalHeaderStyle = {
    backgroundColor: '#1a1a1a',
    padding: '12px 20px',
    borderBottom: '1px solid #4B5320',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
};

const terminalIndicatorStyle = {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#8FBC8F',
    boxShadow: '0 0 8px #8FBC8F',
    animation: 'pulse 2s infinite'
};

const terminalTitleStyle = {
    color: '#8FBC8F',
    fontSize: '14px',
    fontWeight: 'bold',
    letterSpacing: '1px'
};

const terminalControlsStyle = {
    display: 'flex',
    gap: '8px'
};

const controlDotStyle = (color) => ({
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: color
});

const formStyle = {
    padding: '30px'
};

const inputGroupStyle = {
    marginBottom: '25px'
};

const labelStyle = {
    display: 'block',
    color: '#8FBC8F',
    fontSize: '12px',
    fontWeight: 'bold',
    marginBottom: '8px',
    letterSpacing: '1px'
};

const inputStyle = {
    width: '100%',
    padding: '12px',
    backgroundColor: 'transparent',
    border: '1px solid #4B5320',
    color: '#8FBC8F',
    fontSize: '14px',
    fontFamily: 'monospace',
    outline: 'none',
    transition: 'border-color 0.3s ease'
};

const selectStyle = {
    ...inputStyle,
    cursor: 'pointer'
};

const submitButtonStyle = {
    width: '100%',
    padding: '15px',
    backgroundColor: 'transparent',
    border: '2px solid #4B5320',
    color: '#8FBC8F',
    fontSize: '14px',
    fontWeight: 'bold',
    fontFamily: 'monospace',
    cursor: 'pointer',
    letterSpacing: '1px',
    transition: 'all 0.3s ease'
};

const loadingContainerStyle = {
    padding: '30px'
};

const statusHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#8FBC8F',
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '20px'
};

const percentageStyle = {
    color: '#8FBC8F',
    fontSize: '18px'
};

const progressBarContainerStyle = {
    position: 'relative',
    height: '20px',
    marginBottom: '20px',
    border: '1px solid #4B5320'
};

const progressBarStyle = {
    height: '100%',
    backgroundColor: '#8FBC8F',
    transition: 'width 0.5s ease',
    boxShadow: '0 0 10px rgba(139, 188, 143, 0.5)'
};

const progressBarBackgroundStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(75, 83, 32, 0.2)'
};

const statusMessageStyle = {
    color: '#8FBC8F',
    fontSize: '12px',
    marginBottom: '15px',
    letterSpacing: '0.5px'
};

const currentOperationStyle = {
    color: '#8FBC8F',
    fontSize: '12px',
    marginBottom: '20px',
    fontWeight: 'bold'
};

const dataProgressStyle = {
    marginTop: '20px',
    border: '1px solid #4B5320',
    padding: '15px'
};

const dataHeaderStyle = {
    color: '#8FBC8F',
    fontSize: '12px',
    fontWeight: 'bold',
    marginBottom: '10px'
};

const dataItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    color: '#8FBC8F',
    fontSize: '11px',
    marginBottom: '5px'
};

const powerTypeStyle = {
    fontWeight: 'bold'
};

const getStatusStyle = (status) => ({
    color: status === 'success' ? '#28ca42' : status === 'failed' ? '#ff5f57' : '#8FBC8F'
});

const loadingDotsStyle = {
    display: 'flex',
    alignItems: 'center',
    color: '#8FBC8F',
    fontSize: '12px',
    marginTop: '20px'
};

const dotsContainerStyle = {
    marginLeft: '10px'
};

const dotStyle = (index) => ({
    opacity: 0.3,
    animation: `blink 1.5s infinite ${index * 0.5}s`
});

const successContainerStyle = {
    padding: '30px'
};

const successHeaderStyle = {
    color: '#28ca42',
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '20px',
    textAlign: 'center'
};

const summaryStyle = {
    border: '1px solid #4B5320',
    padding: '15px',
    marginBottom: '20px'
};

const summaryHeaderStyle = {
    color: '#8FBC8F',
    fontSize: '12px',
    fontWeight: 'bold',
    marginBottom: '10px'
};

const summaryItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    color: '#8FBC8F',
    fontSize: '11px',
    marginBottom: '5px'
};

const resetButtonStyle = {
    ...submitButtonStyle,
    borderColor: '#28ca42',
    color: '#28ca42'
};

const errorContainerStyle = {
    padding: '30px'
};

const errorHeaderStyle = {
    color: '#ff5f57',
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '15px',
    textAlign: 'center'
};

const errorMessageStyle = {
    color: '#ff5f57',
    fontSize: '12px',
    marginBottom: '20px',
    textAlign: 'center'
};

export default Armory;