package com.framewise.ipms.service;

import com.framewise.ipms.dto.request.CampaignRequest;
import com.framewise.ipms.dto.response.CampaignResponse;
import com.framewise.ipms.dto.response.PageResponse;
import com.framewise.ipms.entity.CampaignStatus;
import org.springframework.data.domain.Pageable;

public interface CampaignService {

    CampaignResponse create(
            CampaignRequest request,
            Long createdById);

    CampaignResponse getById(
            Long campaignId);

    CampaignResponse update(
            Long campaignId,
            CampaignRequest request);

    void delete(
            Long campaignId);

    PageResponse<CampaignResponse> search(
            String keyword,
            CampaignStatus status,
            Long clientId,
            Pageable pageable);
}