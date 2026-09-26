package com.framewise.ipms.dto.response;

import com.framewise.ipms.entity.ContentType;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ContentItemResponse {

    private Long contentId;
    private String title;
    private String description;
    private ContentType contentType;
    private String filePath;
    private String originalFileName;
    private String tag;
    private Long usageCount;
    private boolean isActive;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;

    // Flattened uploader fields
    private Long uploadedById;
    private String uploadedByName;
}
