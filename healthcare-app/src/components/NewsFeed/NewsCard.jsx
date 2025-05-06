import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';

// Removed NewsArticle interface
// Removed NewsCardProps interface

// Removed type annotation from props
const NewsCard = ({ article }) => {
  const { title, description, url, urlToImage, publishedAt, source } = article;

  // Format the published date
  const formattedDate = formatDistanceToNow(new Date(publishedAt), { addSuffix: true });

  return (
    // ... rest of the component remains the same ...
    <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
      <div className="relative h-48 w-full">
        {urlToImage ? (
          <Image
            src={urlToImage}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="bg-gray-200 h-full w-full flex items-center justify-center">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex-1">
          <div className="flex items-center text-xs text-gray-500 mb-2">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{source.name}</span>
            <span className="ml-2">{formattedDate}</span>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
            {title}
          </h3>

          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {description || 'No description available'}
          </p>
        </div>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition mt-auto text-center"
        >
          Read Full Article
        </a>
      </div>
    </div>
  );
};

export default NewsCard; 