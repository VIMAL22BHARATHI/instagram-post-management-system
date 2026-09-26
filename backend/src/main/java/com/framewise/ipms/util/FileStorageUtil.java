package com.framewise.ipms.util;

import com.framewise.ipms.exception.ValidationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Component
public class FileStorageUtil {

    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/jpeg", "image/png", "image/gif", "image/webp",
            "video/mp4", "video/quicktime",
            "application/pdf",
            "audio/mpeg", "audio/wav"
    );

    private static final long MAX_FILE_SIZE = 100 * 1024 * 1024L; // 100 MB

    private final Path baseDir;

    public FileStorageUtil(@Value("${app.storage.base-dir:uploads}") String baseDir) {
        this.baseDir = Paths.get(baseDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.baseDir);
        } catch (IOException e) {
            throw new IllegalStateException("Could not create storage directory: " + this.baseDir, e);
        }
    }

    /**
     * Stores the file under baseDir/{subDir}/{uuid}_{originalName} and returns
     * the relative path string for persistence.
     */
    public String store(MultipartFile file, String subDir) {
        validateFile(file);

        String originalName = sanitizeFileName(file.getOriginalFilename());
        String storedName = UUID.randomUUID() + "_" + originalName;

        try {
            Path targetDir = baseDir.resolve(subDir).normalize();
            Files.createDirectories(targetDir);

            // Prevent path traversal
            if (!targetDir.startsWith(baseDir)) {
                throw new ValidationException("Invalid storage sub-directory");
            }

            Path target = targetDir.resolve(storedName);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

            String relativePath = baseDir.relativize(target).toString().replace("\\", "/");
            log.info("File stored: {}", relativePath);
            return relativePath;
        } catch (IOException e) {
            throw new IllegalStateException("Failed to store file", e);
        }
    }

    public void delete(String relativePath) {
        try {
            Path target = baseDir.resolve(relativePath).normalize();
            if (!target.startsWith(baseDir)) {
                throw new ValidationException("Invalid file path");
            }
            Files.deleteIfExists(target);
        } catch (IOException e) {
            log.warn("Could not delete file: {}", relativePath);
        }
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ValidationException("File must not be empty");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new ValidationException("File exceeds maximum allowed size of 100 MB");
        }
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
            throw new ValidationException("File type not allowed: " + contentType);
        }
    }

    private String sanitizeFileName(String name) {
        if (name == null || name.isBlank()) return "file";
        return name.replaceAll("[^a-zA-Z0-9._-]", "_");
    }
}
