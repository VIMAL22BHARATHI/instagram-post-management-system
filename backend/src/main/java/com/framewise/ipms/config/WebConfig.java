package com.framewise.ipms.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.storage.base-dir:uploads}")
    private String baseDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path uploadDir = Paths.get(baseDir).toAbsolutePath().normalize();
        String uploadPathUri = uploadDir.toUri().toString();

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(uploadPathUri.endsWith("/") ? uploadPathUri : uploadPathUri + "/");

        String contentLibraryUri = uploadDir.resolve("content-library").toUri().toString();
        registry.addResourceHandler("/content-library/**")
                .addResourceLocations(contentLibraryUri.endsWith("/") ? contentLibraryUri : contentLibraryUri + "/");
    }
}
