package com.framewise.ipms.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ContentTemplateResponse {

    private Long templateId;
    private String name;
    private String body;
    private String description;
    private boolean isPublic;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;

    // Flattened creator fields
    private Long createdById;
    private String createdByName;
}
