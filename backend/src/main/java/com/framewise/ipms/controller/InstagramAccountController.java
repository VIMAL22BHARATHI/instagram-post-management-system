package com.framewise.ipms.controller;

import com.framewise.ipms.dto.request.ConnectAccountRequest;
import com.framewise.ipms.dto.response.ApiResponse;
import com.framewise.ipms.dto.response.InstagramAccountResponse;
import com.framewise.ipms.dto.response.PageResponse;
import com.framewise.ipms.entity.User;
import com.framewise.ipms.service.InstagramAccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@Tag(name = "Instagram Accounts", description = "Connect, disconnect, list, and sync Instagram accounts")
@RestController
@RequestMapping("/api/v1/instagram-accounts")
@RequiredArgsConstructor
public class InstagramAccountController {

    private static final Set<String> ALLOWED_SORT_FIELDS =
            Set.of("createdDate", "username", "followersCount", "lastSync", "connectedDate");

    private final InstagramAccountService accountService;

    @Operation(summary = "Connect (register) a new Instagram account")
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SOCIAL_MEDIA_MANAGER', 'ACCOUNT_MANAGER')")
    public ResponseEntity<ApiResponse<InstagramAccountResponse>> connect(
            @Valid @RequestBody ConnectAccountRequest request,
            @AuthenticationPrincipal User currentUser) {
        InstagramAccountResponse response = accountService.connect(request, currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Instagram account connected", response));
    }

    @Operation(summary = "Disconnect an Instagram account (blocked if SCHEDULED posts exist)")
    @DeleteMapping("/{accountId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SOCIAL_MEDIA_MANAGER', 'ACCOUNT_MANAGER')")
    public ResponseEntity<ApiResponse<Void>> disconnect(
            @PathVariable Long accountId,
            @AuthenticationPrincipal User currentUser) {
        accountService.disconnect(accountId, currentUser.getId(), currentUser.getRole().name());
        return ResponseEntity.ok(ApiResponse.success("Instagram account disconnected", null));
    }

    @Operation(summary = "Get Instagram account by ID")
    @GetMapping("/{accountId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SOCIAL_MEDIA_MANAGER', 'ACCOUNT_MANAGER')")
    public ResponseEntity<ApiResponse<InstagramAccountResponse>> getById(
            @PathVariable Long accountId,
            @AuthenticationPrincipal User currentUser) {
        InstagramAccountResponse response = accountService.getById(
                accountId, currentUser.getId(), currentUser.getRole().name());
        return ResponseEntity.ok(ApiResponse.success("Account retrieved", response));
    }

    @Operation(summary = "List and search Instagram accounts with pagination")
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SOCIAL_MEDIA_MANAGER', 'ACCOUNT_MANAGER')")
    public ResponseEntity<ApiResponse<PageResponse<InstagramAccountResponse>>> list(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Boolean isConnected,
            @RequestParam(required = false) Long ownerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @AuthenticationPrincipal User currentUser) {

        String safeSortBy = ALLOWED_SORT_FIELDS.contains(sortBy) ? sortBy : "createdDate";
        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(safeSortBy).ascending()
                : Sort.by(safeSortBy).descending();

        PageResponse<InstagramAccountResponse> response = accountService.list(
                keyword, isConnected, ownerId,
                currentUser.getId(), currentUser.getRole().name(),
                PageRequest.of(page, size, sort));

        return ResponseEntity.ok(ApiResponse.success("Accounts retrieved", response));
    }

    @Operation(summary = "Sync account stats (stub — refreshes lastSync timestamp)")
    @PostMapping("/{accountId}/sync")
    @PreAuthorize("hasAnyRole('ADMIN', 'SOCIAL_MEDIA_MANAGER', 'ACCOUNT_MANAGER')")
    public ResponseEntity<ApiResponse<InstagramAccountResponse>> sync(
            @PathVariable Long accountId,
            @AuthenticationPrincipal User currentUser) {
        InstagramAccountResponse response = accountService.sync(
                accountId, currentUser.getId(), currentUser.getRole().name());
        return ResponseEntity.ok(ApiResponse.success("Account synced", response));
    }
}
