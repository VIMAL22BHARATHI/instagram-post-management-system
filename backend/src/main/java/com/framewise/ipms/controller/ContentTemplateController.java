package com.framewise.ipms.controller;

import com.framewise.ipms.dto.request.ContentTemplateRequest;
import com.framewise.ipms.dto.response.ApiResponse;
import com.framewise.ipms.dto.response.ContentTemplateResponse;
import com.framewise.ipms.dto.response.PageResponse;
import com.framewise.ipms.entity.User;
import com.framewise.ipms.service.ContentTemplateService;
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

@Tag(name = "Content Templates", description = "Reusable caption/layout templates, public or private")
@RestController
@RequestMapping("/api/v1/content-templates")
@RequiredArgsConstructor
public class ContentTemplateController {

    private final ContentTemplateService contentTemplateService;

    @Operation(summary = "Create a content template")
    @PreAuthorize("hasAnyRole('ADMIN','ACCOUNT_MANAGER','SOCIAL_MEDIA_MANAGER','CONTENT_CREATOR')")
    @PostMapping
    public ResponseEntity<ApiResponse<ContentTemplateResponse>> create(
            @Valid @RequestBody ContentTemplateRequest request,
            @AuthenticationPrincipal User currentUser) {
        ContentTemplateResponse created = contentTemplateService.create(request, currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Content template created successfully", created));
    }

    @Operation(summary = "Get a content template by id (private templates restricted to owner/admin)")
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{templateId}")
    public ResponseEntity<ApiResponse<ContentTemplateResponse>> getById(
            @PathVariable Long templateId,
            @AuthenticationPrincipal User currentUser) {
        ContentTemplateResponse template = contentTemplateService.getById(
                templateId, currentUser.getId(), currentUser.getRole().name());
        return ResponseEntity.ok(ApiResponse.success("Content template retrieved successfully", template));
    }

    @Operation(summary = "Search content templates by keyword/visibility (paginated, sortable)")
    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ContentTemplateResponse>>> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Boolean isPublic,
            @PageableDefault(size = 20, sort = "templateId") Pageable pageable,
            @AuthenticationPrincipal User currentUser) {
        PageResponse<ContentTemplateResponse> results = contentTemplateService.search(
                keyword, isPublic, currentUser.getId(), currentUser.getRole().name(), pageable);
        return ResponseEntity.ok(ApiResponse.success("Content templates retrieved successfully", results));
    }

    @Operation(summary = "Update a content template (owner or admin only)")
    @PreAuthorize("isAuthenticated()")
    @PutMapping("/{templateId}")
    public ResponseEntity<ApiResponse<ContentTemplateResponse>> update(
            @PathVariable Long templateId,
            @Valid @RequestBody ContentTemplateRequest request,
            @AuthenticationPrincipal User currentUser) {
        ContentTemplateResponse updated = contentTemplateService.update(
                templateId, request, currentUser.getId(), currentUser.getRole().name());
        return ResponseEntity.ok(ApiResponse.success("Content template updated successfully", updated));
    }

    @Operation(summary = "Delete a content template (owner or admin only)")
    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{templateId}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable Long templateId,
            @AuthenticationPrincipal User currentUser) {
        contentTemplateService.delete(templateId, currentUser.getId(), currentUser.getRole().name());
        return ResponseEntity.ok(ApiResponse.success("Content template deleted successfully", null));
    }
}