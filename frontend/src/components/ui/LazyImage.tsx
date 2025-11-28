import React, { useState, useEffect, useRef } from 'react';

interface LazyImageProps {
    src: string;
    alt: string;
    className?: string;
    placeholder?: string;
    onLoad?: () => void;
    onError?: () => void;
}

/**
 * LazyImage Component - Optimized Image Loading
 * 
 * Features:
 * - Intersection Observer for lazy loading
 * - Progressive loading with placeholder
 * - Error handling with fallback
 * - Responsive and performant
 * 
 * Usage:
 * <LazyImage 
 *   src="https://example.com/image.jpg" 
 *   alt="Description"
 *   placeholder="/placeholder.svg"
 * />
 */
export const LazyImage: React.FC<LazyImageProps> = ({
    src,
    alt,
    className = '',
    placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext fill="%239ca3af" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18"%3EYükleniyor...%3C/text%3E%3C/svg%3E',
    onLoad,
    onError
}) => {
    const [imageSrc, setImageSrc] = useState<string>(placeholder);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        // Intersection Observer for lazy loading
        const options: IntersectionObserverInit = {
            root: null,
            rootMargin: '50px', // Start loading 50px before entering viewport
            threshold: 0.01
        };

        observerRef.current = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && imageSrc === placeholder) {
                    // Load actual image
                    const img = new Image();
                    img.src = src;

                    img.onload = () => {
                        setImageSrc(src);
                        setIsLoading(false);
                        onLoad?.();
                    };

                    img.onerror = () => {
                        setHasError(true);
                        setIsLoading(false);
                        // Fallback to broken image placeholder
                        setImageSrc('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23fee2e2" width="400" height="300"/%3E%3Ctext fill="%23991b1b" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16"%3EGörsel Yüklenemedi%3C/text%3E%3C/svg%3E');
                        onError?.();
                    };

                    // Disconnect observer after loading starts
                    if (imgRef.current) {
                        observerRef.current?.unobserve(imgRef.current);
                    }
                }
            });
        }, options);

        if (imgRef.current) {
            observerRef.current.observe(imgRef.current);
        }

        // Cleanup
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [src, imageSrc, placeholder, onLoad, onError]);

    return (
        <img
            ref={imgRef}
            src={imageSrc}
            alt={alt}
            className={`${className} ${isLoading ? 'animate-pulse' : ''} transition-opacity duration-300`}
            loading="lazy"
            decoding="async"
            style={{
                opacity: isLoading ? 0.7 : 1
            }}
        />
    );
};

export default LazyImage;
