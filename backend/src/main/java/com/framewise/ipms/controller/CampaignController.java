package com.framewise.ipms.controller;

import com.framewise.ipms.dto.request.CampaignRequest;
import com.framewise.ipms.dto.response.ApiResponse;
import com.framewise.ipms.dto.response.CampaignResponse;
import com.framewise.ipms.dto.response.PageResponse;
import com.framewise.ipms.entity.CampaignStatus;
import com.framewise.ipms.entity.User;
import com.framewise.ipms.service.CampaignService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Campaign Management", description = "CRUD, search, and status management for client campaigns")
@RestController
@RequestMapping("/api/v1/campaigns")
@RequiredArgsConstructor
public class CampaignController {

    private final CampaignService campaignService;

    @Operation(summary = "Create a campaign")
    @PreAuthorize("hasAnyRole('ADMIN','ACCOUNT_MANAGER','SOCIAL_MEDIA_MANAGER')")
    @PostMapping
    public ResponseEntity<ApiResponse<CampaignResponse>> create(
            @Valid @RequestBody CampaignRequest request,
            @AuthenticationPrincipal User currentUser) {
        CampaignResponse created = campaignService.create(request, currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Campaign created successfully", created));
    }

    @Operation(summary = "Get a campaign by id")
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{campaignId}")
    public ResponseEntity<ApiResponse<CampaignResponse>> getById(@PathVariable Long campaignId) {
        CampaignResponse campaign = campaignService.getById(campaignId);
        return ResponseEntity.ok(ApiResponse.success("Campaign retrieved successfully", campaign));
    }

    @Operation(summary = "Search campaigns with keyword, status, and client filters (paginated, sortable)")
    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<CampaignResponse>>> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) CampaignStatus status,
            @RequestParam(required = false) Long clientId,
            @PageableDefault(size = 20, sort = "campaignId") Pageable pageable) {
        PageResponse<CampaignResponse> results = campaignService.search(keyword, status, clientId, pageable);
        return ResponseEntity.ok(ApiResponse.success("Campaigns retrieved successfully", results));
    }

    @Operation(summary = "Update a campaign")
    @PreAuthorize("hasAnyRole('ADMIN','ACCOUNT_MANAGER','SOCIAL_MEDIA_MANAGER')")
    @PutMapping("/{campaignId}")
    public ResponseEntity<ApiResponse<CampaignResponse>> update(
            @PathVariable Long campaignId,
            @Valid @RequestBody CampaignRequest request) {
        CampaignResponse updated = campaignService.update(campaignId, request);
        return ResponseEntity.ok(ApiResponse.success("Campaign updated successfully", updated));
    }

    @Operation(summary = "Cancel a campaign (soft-delete: sets status to CANCELLED)")
    @PreAuthorize("hasAnyRole('ADMIN','ACCOUNT_MANAGER')")
    @DeleteMapping("/{campaignId}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long campaignId) {
        campaignService.delete(campaignId);
        return ResponseEntity.ok(ApiResponse.success("Campaign cancelled successfully", null));
    }
}