import React, { useState, useCallback } from 'react';
import { FaShareAlt, FaFacebook, FaTwitter, FaLinkedin, FaEnvelope, FaCopy, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const SocialShareButton = ({
    url,
    title,
    text,
    size = 'default',
    shape = 'default',
    platforms = ['facebook', 'twitter', 'linkedin', 'email', 'copy'],
    onShare, // Prop to trigger share logic in the parent component
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [copyStatus, setCopyStatus] = useState('idle');

    const getShareUrl = useCallback((platform) => {
        const encodedTitle = encodeURIComponent(title);
        const encodedUrl = encodeURIComponent(url);
        const encodedText = text ? encodeURIComponent(text) : '';

        switch (platform) {
            case 'facebook':
                return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
            case 'twitter':
                return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText ? encodedText : encodedTitle}`;
            case 'linkedin':
                return `https://www.linkedin.com/shareArticle?url=${encodedUrl}&title=${encodedTitle}`;
            case 'email':
                return `mailto:?subject=${encodedTitle}&body=${encodedText ? encodedText + '%0D%0A%0D%0A' : ''}${encodedUrl}`;
            default:
                return '';
        }
    }, [title, url, text]);

    const handleCopy = () => {
        navigator.clipboard
            .writeText(url)
            .then(() => {
                setCopyStatus('success');
                setTimeout(() => setCopyStatus('idle'), 2000); // Reset after 2 seconds
                if (onShare) {
                    onShare(); // Trigger the onShare callback for point awarding
                }
            })
            .catch(() => {
                setCopyStatus('error');
                setTimeout(() => setCopyStatus('idle'), 2000); // Reset after 2 seconds
            });
    };

    const handleSocialPlatformShare = (platform) => {
        const shareUrl = getShareUrl(platform);
        if (shareUrl) {
            window.open(shareUrl, '_blank', 'noopener,noreferrer');
            if (onShare) {
                onShare(); // Trigger the onShare callback for point awarding
            }
        }
        setIsOpen(false); // Close after clicking
    };

    const renderShareContent = () => {
        return (
            isOpen && (
                <div
                    className="absolute z-10 bg-white border border-gray-200 rounded-md shadow-lg p-2 space-y-2 w-48"
                    style={{ top: size === 'small' ? '36px' : '44px', right: 0 }} // Corrected positioning
                >
                    {platforms.map((platform) => {
                        let Icon = null;
                        let platformName = '';
                        switch (platform) {
                            case 'facebook':
                                Icon = FaFacebook;
                                platformName = 'Facebook';
                                break;
                            case 'twitter':
                                Icon = FaTwitter;
                                platformName = 'Twitter';
                                break;
                            case 'linkedin':
                                Icon = FaLinkedin;
                                platformName = 'LinkedIn';
                                break;
                            case 'email':
                                Icon = FaEnvelope;
                                platformName = 'Email';
                                break;
                            case 'copy':
                                Icon = FaCopy;
                                platformName = 'Copy Link';
                                break;
                            default:
                                Icon = null;
                        }

                        if (!Icon) return null;

                        return (
                            <div
                                key={platform}
                                className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                    if (platform === 'copy') {
                                        handleCopy();
                                    } else {
                                        handleSocialPlatformShare(platform);
                                    }
                                    setIsOpen(false); // Close after clicking
                                }}
                            >
                                <Icon className="w-4 h-4 text-gray-600" />
                                <span className="text-sm text-gray-700">{platformName}</span>
                                {platform === 'copy' && copyStatus !== 'idle' && (
                                    <>
                                        {copyStatus === 'success' && (
                                            <FaCheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                                        )}
                                        {copyStatus === 'error' && (
                                            <FaExclamationTriangle className="w-4 h-4 text-red-500 ml-auto" />
                                        )}
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            )
        );
    };

    return (
        <div className="relative inline-block">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative ${shape === 'circle' ? 'rounded-full' : ''} px-3.5 py-2 ${size === 'small' ? 'px-2.5 py-1.5' : ''} flex items-center gap-2 outline-none border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:border-blue-500 focus:ring-blue-500`}
            >
                <FaShareAlt className="w-4 h-4" />
                {size === 'default' && <span>Share</span>}
            </button>
            {renderShareContent()}
        </div>
    );
};

export default SocialShareButton;