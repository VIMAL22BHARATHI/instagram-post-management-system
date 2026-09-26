package com.framewise.ipms.dto.response;

import com.framewise.ipms.entity.CampaignStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class CampaignResponse {

    private Long campaignId;
    private String name;
    private String description;
    private CampaignStatus status;
    private LocalDate startDate;
    private LocalDate endDate;
    private Long totalPosts;
    private Long totalImpressions;
    private Long totalEngagements;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;

    // Flattened client fields
    private Long clientId;
    private String clientName;

    // Flattened creator fields
    private Long createdById;
    private String createdByName;
}
