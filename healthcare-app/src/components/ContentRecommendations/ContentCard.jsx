import Image from 'next/image';
import { useState } from 'react';
import { FaBookmark, FaRegBookmark, FaExternalLinkAlt, FaVideo, FaNewspaper, FaYoutube, FaPlay } from 'react-icons/fa';

const ContentCard = ({ item, isSaved = false, onSave }) => {
  const [imageError, setImageError] = useState(false);
  const [showVideoPreview, setShowVideoPreview] = useState(false);
  
  const {
    title,
    description,
    source,
    url,
    urlToImage,
    publishedAt,
    type // This can be 'video' or 'article'
  } = item;

  // Format date if available
  const formattedDate = publishedAt 
    ? new Date(publishedAt).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      })
    : null;
    
  // Determine if content is YouTube video
  const isYouTubeVideo = url?.includes('youtube.com') || url?.includes('youtu.be');
  
  // Determine content type
  const contentType = type || (isYouTubeVideo ? 'video' : 'article');
  
  // Extract YouTube video ID if it's a YouTube video
  const getYouTubeVideoId = () => {
    if (!isYouTubeVideo) return null;
    
    const urlObj = new URL(url);
    if (url.includes('youtube.com')) {
      return urlObj.searchParams.get('v');
    } else if (url.includes('youtu.be')) {
      return urlObj.pathname.substring(1);
    }
    return null;
  };
  
  const youtubeVideoId = getYouTubeVideoId();
  
  // Fallback image for when the content image fails to load
  const getFallbackImage = () => {
    if (contentType === 'video') {
      return 'https://source.unsplash.com/random/800x600/?video';
    }
    
    // Get a relevant image based on title keywords
    const titleLower = title?.toLowerCase() || '';
    if (titleLower.includes('fitness') || titleLower.includes('workout')) {
      return 'https://source.unsplash.com/random/800x600/?fitness';
    } else if (titleLower.includes('nutrition') || titleLower.includes('diet')) {
      return 'https://source.unsplash.com/random/800x600/?healthy-food';
    } else if (titleLower.includes('mental') || titleLower.includes('stress')) {
      return 'https://source.unsplash.com/random/800x600/?mindfulness';
    } else if (titleLower.includes('sleep')) {
      return 'https://source.unsplash.com/random/800x600/?sleep';
    } else {
      return 'https://source.unsplash.com/random/800x600/?health';
    }
  };
  
  // Handle video click to prevent navigation and show preview
  const handleVideoClick = (e) => {
    if (isYouTubeVideo && youtubeVideoId) {
      e.preventDefault();
      setShowVideoPreview(true);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col border border-gray-100 hover:shadow-lg transition-shadow duration-300">
      {/* Content Type Badge */}
      <div className="absolute top-2 right-2 z-10">
        <div className={`px-2 py-1 rounded-full text-xs flex items-center ${
          contentType === 'video' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
        }`}>
          {contentType === 'video' ? (
            isYouTubeVideo ? (
              <><FaYoutube className="mr-1" /> YouTube</>
            ) : (
              <><FaVideo className="mr-1" /> Video</>
            )
          ) : (
            <><FaNewspaper className="mr-1" /> Article</>
          )}
        </div>
      </div>
      
      {/* Image Container */}
      <div className="relative h-48 w-full bg-gray-100">
        {showVideoPreview && isYouTubeVideo && youtubeVideoId ? (
          <iframe
            src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1`}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        ) : (
          <>
            {/* YouTube Play Button Overlay for videos */}
            {contentType === 'video' && (
              <div 
                className="absolute inset-0 flex items-center justify-center z-10 cursor-pointer"
                onClick={handleVideoClick}
              >
                <div className="bg-red-600 bg-opacity-80 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-opacity-100 transition-all">
                  <FaPlay className="ml-1" />
                </div>
              </div>
            )}
            {(urlToImage && !imageError) ? (
              <Image
                src={urlToImage}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onError={() => setImageError(true)}
              />
            ) : (
              <Image
                src={getFallbackImage()}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            )}
          </>
        )}
      </div>

      {/* Content Body */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex-1">
          {/* Source and Date */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span className="font-medium">{source?.name || 'Unknown Source'}</span>
            {formattedDate && <span>{formattedDate}</span>}
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 hover:text-blue-600">
            {title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {description || 'No description available.'}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-auto pt-4 flex justify-between items-center">
          {/* Open Link Button */}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={contentType === 'video' ? handleVideoClick : undefined}
            className={`inline-flex items-center justify-center ${
              contentType === 'video' ? 'bg-red-600' : 'bg-blue-600'
            } text-white px-4 py-2 rounded ${
              contentType === 'video' ? 'hover:bg-red-700' : 'hover:bg-blue-700'
            } transition`}
          >
            {contentType === 'video' ? (
              <>Watch <FaPlay className="ml-2 text-sm" /></>
            ) : (
              <>Read <FaExternalLinkAlt className="ml-2 text-sm" /></>
            )}
          </a>
          
          {/* Save Button */}
          <button
            onClick={onSave}
            className="p-2 rounded-full hover:bg-gray-100 transition"
            aria-label={isSaved ? "Remove from saved" : "Save for later"}
          >
            {isSaved ? (
              <FaBookmark className="text-blue-600 text-xl" />
            ) : (
              <FaRegBookmark className="text-gray-600 text-xl" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentCard; 