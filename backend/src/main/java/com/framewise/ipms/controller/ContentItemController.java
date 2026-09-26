package com.framewise.ipms.controller;

import com.framewise.ipms.dto.request.ContentItemRequest;
import com.framewise.ipms.dto.response.ApiResponse;
import com.framewise.ipms.dto.response.ContentItemResponse;
import com.framewise.ipms.dto.response.PageResponse;
import com.framewise.ipms.entity.ContentType;
import com.framewise.ipms.entity.User;
import com.framewise.ipms.service.ContentItemService;
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
import org.springframework.web.multipart.MultipartFile;
import com.framewise.ipms.service.ContentItemService;

@Tag(name = "Content Library", description = "Upload, search, filter, and reuse media assets")
@RestController
@RequestMapping("/api/v1/content-items")
@RequiredArgsConstructor
public class ContentItemController {

    private final ContentItemService contentItemService;

    @Operation(summary = "Upload a media asset to the content library")
    @PreAuthorize("hasAnyRole('ADMIN','ACCOUNT_MANAGER','SOCIAL_MEDIA_MANAGER','CONTENT_CREATOR')")
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<ApiResponse<ContentItemResponse>> upload(
            @Valid @RequestPart("request") ContentItemRequest request,
            @RequestPart("file") MultipartFile file,
            @AuthenticationPrincipal User currentUser) {
        ContentItemResponse uploaded = contentItemService.upload(request, file, currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Content item uploaded successfully", uploaded));
    }

    @Operation(summary = "Get a content item by id")
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{contentId}")
    public ResponseEntity<ApiResponse<ContentItemResponse>> getById(@PathVariable Long contentId) {
        ContentItemResponse item = contentItemService.getById(contentId);
        return ResponseEntity.ok(ApiResponse.success("Content item retrieved successfully", item));
    }

    @Operation(summary = "Search content items by keyword, tag, and type (paginated, sortable)")
    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ContentItemResponse>>> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String tag,
            @RequestParam(required = false) ContentType contentType,
            @RequestParam(required = false) Boolean isActive,
            @PageableDefault(size = 20, sort = "contentId") Pageable pageable) {
        PageResponse<ContentItemResponse> results =
                contentItemService.search(keyword, tag, contentType, isActive, pageable);
        return ResponseEntity.ok(ApiResponse.success("Content items retrieved successfully", results));
    }

    @Operation(summary = "Update a content item's metadata")
    @PreAuthorize("hasAnyRole('ADMIN','ACCOUNT_MANAGER','SOCIAL_MEDIA_MANAGER','CONTENT_CREATOR')")
    @PutMapping("/{contentId}")
    public ResponseEntity<ApiResponse<ContentItemResponse>> update(
            @PathVariable Long contentId,
            @Valid @RequestBody ContentItemRequest request) {
        ContentItemResponse updated = contentItemService.update(contentId, request);
        return ResponseEntity.ok(ApiResponse.success("Content item updated successfully", updated));
    }

    @Operation(summary = "Deactivate a content item (soft-delete)")
    @PreAuthorize("hasAnyRole('ADMIN','ACCOUNT_MANAGER','SOCIAL_MEDIA_MANAGER')")
    @DeleteMapping("/{contentId}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long contentId) {
        contentItemService.delete(contentId);
        return ResponseEntity.ok(ApiResponse.success("Content item deactivated successfully", null));
    }

    @Operation(summary = "Mark a content item as reused (increments usage count)")
    @PreAuthorize("hasAnyRole('ADMIN','ACCOUNT_MANAGER','SOCIAL_MEDIA_MANAGER','CONTENT_CREATOR')")
    @PostMapping("/{contentId}/reuse")
    public ResponseEntity<ApiResponse<ContentItemResponse>> reuse(@PathVariable Long contentId) {
        ContentItemResponse updated = contentItemService.incrementUsage(contentId);
        return ResponseEntity.ok(ApiResponse.success("Usage recorded successfully", updated));
    }
}