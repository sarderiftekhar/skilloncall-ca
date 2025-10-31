<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class ImageCompressionService
{
    protected ImageManager $imageManager;
    
    public function __construct()
    {
        // Initialize with GD driver (more compatible than Imagick)
        $this->imageManager = new ImageManager(new Driver());
    }

    /**
     * Compress and resize image for profile photos
     */
    public function compressProfilePhoto(UploadedFile $file, string $directory = 'profile_photos'): string
    {
        try {
            // Set timeout for image processing
            set_time_limit(120); // 2 minutes
            
            $image = $this->imageManager->read($file->getPathname());
            
            // Resize to maximum 400x400 while maintaining aspect ratio
            $image->scale(400, 400);
            
            // Generate unique filename
            $filename = uniqid('profile_') . '.jpg';
            $path = $directory . '/' . $filename;
            
            // Compress and save as JPEG with 85% quality
            $compressedData = $image->toJpeg(85);
            
            Storage::disk('public')->put($path, $compressedData);
            
            Log::info('Profile photo compressed successfully', [
                'original_size' => $file->getSize(),
                'compressed_path' => $path,
                'original_mime' => $file->getMimeType(),
            ]);
            
            return $path;
            
        } catch (\Exception $e) {
            Log::error('Image compression failed', [
                'error' => $e->getMessage(),
                'file_size' => $file->getSize(),
                'file_mime' => $file->getMimeType(),
            ]);
            
            // Fallback: store original file
            return $file->store($directory, 'public');
        }
    }

    /**
     * Compress and resize image for portfolio photos
     */
    public function compressPortfolioPhoto(UploadedFile $file, string $directory = 'portfolio_photos'): string
    {
        try {
            set_time_limit(120); // 2 minutes
            
            $image = $this->imageManager->read($file->getPathname());
            
            // Resize to maximum 800x600 while maintaining aspect ratio
            $image->scale(800, 600);
            
            // Generate unique filename
            $filename = uniqid('portfolio_') . '.jpg';
            $path = $directory . '/' . $filename;
            
            // Compress and save as JPEG with 80% quality (slightly lower for portfolios)
            $compressedData = $image->toJpeg(80);
            
            Storage::disk('public')->put($path, $compressedData);
            
            Log::info('Portfolio photo compressed successfully', [
                'original_size' => $file->getSize(),
                'compressed_path' => $path,
                'original_mime' => $file->getMimeType(),
            ]);
            
            return $path;
            
        } catch (\Exception $e) {
            Log::error('Portfolio image compression failed', [
                'error' => $e->getMessage(),
                'file_size' => $file->getSize(),
                'file_mime' => $file->getMimeType(),
            ]);
            
            // Fallback: store original file
            return $file->store($directory, 'public');
        }
    }

    /**
     * Compress screenshot images
     */
    public function compressScreenshot(UploadedFile $file, string $directory = 'progress-screenshots'): string
    {
        try {
            set_time_limit(120); // 2 minutes
            
            $image = $this->imageManager->read($file->getPathname());
            
            // Resize to maximum 1200x900 for screenshots (keep them readable)
            $image->scale(1200, 900);
            
            // Generate unique filename
            $filename = uniqid('screenshot_') . '.jpg';
            $path = $directory . '/' . $filename;
            
            // Compress and save as JPEG with 75% quality
            $compressedData = $image->toJpeg(75);
            
            Storage::disk('public')->put($path, $compressedData);
            
            Log::info('Screenshot compressed successfully', [
                'original_size' => $file->getSize(),
                'compressed_path' => $path,
                'original_mime' => $file->getMimeType(),
            ]);
            
            return $path;
            
        } catch (\Exception $e) {
            Log::error('Screenshot compression failed', [
                'error' => $e->getMessage(),
                'file_size' => $file->getSize(),
                'file_mime' => $file->getMimeType(),
            ]);
            
            // Fallback: store original file
            return $file->store($directory, 'public');
        }
    }

    /**
     * Compress base64 image data
     */
    public function compressBase64Image(string $base64Data, string $directory = 'progress-screenshots', int $maxWidth = 1200, int $maxHeight = 900): string
    {
        try {
            set_time_limit(120); // 2 minutes
            
            // Remove data URL prefix if present
            if (preg_match('/^data:image\/(\w+);base64,/', $base64Data)) {
                $base64Data = substr($base64Data, strpos($base64Data, ',') + 1);
            }
            
            $imageData = base64_decode($base64Data);
            if ($imageData === false) {
                throw new \Exception('Failed to decode base64 image data');
            }
            
            $image = $this->imageManager->read($imageData);
            
            // Resize while maintaining aspect ratio
            $image->scale($maxWidth, $maxHeight);
            
            // Generate unique filename
            $filename = uniqid('pasted_screenshot_') . '.jpg';
            $path = $directory . '/' . $filename;
            
            // Compress and save as JPEG with 75% quality
            $compressedData = $image->toJpeg(75);
            
            Storage::disk('public')->put($path, $compressedData);
            
            Log::info('Base64 image compressed successfully', [
                'original_size' => strlen($imageData),
                'compressed_path' => $path,
            ]);
            
            return $path;
            
        } catch (\Exception $e) {
            Log::error('Base64 image compression failed', [
                'error' => $e->getMessage(),
            ]);
            
            throw $e; // Re-throw since there's no fallback for base64
        }
    }

    /**
     * Generate multiple sizes for profile photos (thumbnails)
     */
    public function generateProfileThumbnails(UploadedFile $file, string $directory = 'profile_photos'): array
    {
        try {
            set_time_limit(180); // 3 minutes for multiple sizes
            
            $image = $this->imageManager->read($file->getPathname());
            $baseFilename = uniqid('profile_');
            
            $sizes = [
                'thumbnail' => ['width' => 50, 'height' => 50, 'quality' => 90],
                'small' => ['width' => 100, 'height' => 100, 'quality' => 85],
                'medium' => ['width' => 200, 'height' => 200, 'quality' => 85],
                'large' => ['width' => 400, 'height' => 400, 'quality' => 80],
            ];
            
            $paths = [];
            
            foreach ($sizes as $sizeName => $sizeConfig) {
                $sizedImage = clone $image;
                $sizedImage->scale($sizeConfig['width'], $sizeConfig['height']);
                
                $filename = $baseFilename . '_' . $sizeName . '.jpg';
                $path = $directory . '/' . $filename;
                
                $compressedData = $sizedImage->toJpeg($sizeConfig['quality']);
                Storage::disk('public')->put($path, $compressedData);
                
                $paths[$sizeName] = $path;
            }
            
            Log::info('Profile thumbnails generated successfully', [
                'original_size' => $file->getSize(),
                'thumbnails_count' => count($paths),
                'paths' => $paths,
            ]);
            
            return $paths;
            
        } catch (\Exception $e) {
            Log::error('Thumbnail generation failed', [
                'error' => $e->getMessage(),
                'file_size' => $file->getSize(),
            ]);
            
            // Fallback: return single compressed image
            return ['large' => $this->compressProfilePhoto($file, $directory)];
        }
    }

    /**
     * Check if image compression is available
     */
    public function isAvailable(): bool
    {
        try {
            // Test if we can create an ImageManager instance
            $this->imageManager->read(imagecreate(1, 1));
            return true;
        } catch (\Exception $e) {
            Log::warning('Image compression not available', [
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Get estimated compressed file size
     */
    public function getEstimatedCompressedSize(int $originalSize, string $type = 'profile'): int
    {
        // Compression ratios based on typical results
        $compressionRatios = [
            'profile' => 0.3,     // 30% of original size
            'portfolio' => 0.4,   // 40% of original size
            'screenshot' => 0.5,  // 50% of original size
        ];
        
        $ratio = $compressionRatios[$type] ?? 0.4;
        return (int) ($originalSize * $ratio);
    }
}
