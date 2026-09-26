package com.framewise.ipms.controller;

import com.framewise.ipms.dto.request.AssignManagerRequest;
import com.framewise.ipms.dto.request.ClientRequest;
import com.framewise.ipms.dto.response.ApiResponse;
import com.framewise.ipms.dto.response.ClientResponse;
import com.framewise.ipms.dto.response.PageResponse;
import com.framewise.ipms.entity.User;
import com.framewise.ipms.service.ClientService;

import java.util.Set;
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

@Tag(name = "Clients", description = "Client management — CRUD, search, manager assignment")
@RestController
@RequestMapping("/api/v1/clients")
@RequiredArgsConstructor
public class ClientController {

    private static final Set<String> ALLOWED_SORT_FIELDS =
            Set.of("createdDate", "updatedDate", "clientName", "contactEmail", "companyName");

    private final ClientService clientService;

    @Operation(summary = "Create a new client")
    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_ACCOUNT_MANAGER')")
    public ResponseEntity<ApiResponse<ClientResponse>> create(
            @Valid @RequestBody ClientRequest request,
            @AuthenticationPrincipal User currentUser) {
        ClientResponse response = clientService.create(request, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Client created successfully", response));
    }

    @Operation(summary = "Get client by ID")
    @GetMapping("/{clientId}")
        @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_ACCOUNT_MANAGER')")
    public ResponseEntity<ApiResponse<ClientResponse>> getById(
            @PathVariable Long clientId,
            @AuthenticationPrincipal User currentUser) {
        ClientResponse response = clientService.getById(
                clientId, currentUser.getId(), currentUser.getRole().name());
        return ResponseEntity.ok(ApiResponse.success("Client retrieved", response));
    }

    @Operation(summary = "Update a client")
    @PutMapping("/{clientId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ClientResponse>> update(
            @PathVariable Long clientId,
            @Valid @RequestBody ClientRequest request) {
        ClientResponse response = clientService.update(clientId, request);
        return ResponseEntity.ok(ApiResponse.success("Client updated successfully", response));
    }

    @Operation(summary = "Soft-delete a client")
    @DeleteMapping("/{clientId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long clientId) {
        clientService.delete(clientId);
        return ResponseEntity.ok(ApiResponse.success("Client deactivated successfully", null));
    }

    @Operation(summary = "Search and list clients with pagination")
    @GetMapping
        @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_ACCOUNT_MANAGER')")
    public ResponseEntity<ApiResponse<PageResponse<ClientResponse>>> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(required = false) Long accountManagerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @AuthenticationPrincipal User currentUser) {

        String safeSortBy = ALLOWED_SORT_FIELDS.contains(sortBy) ? sortBy : "createdDate";
        Sort sort = sortDir.equalsIgnoreCase("asc")
                ? Sort.by(safeSortBy).ascending()
                : Sort.by(safeSortBy).descending();

        PageResponse<ClientResponse> response = clientService.search(
                keyword, isActive, accountManagerId,
                currentUser.getId(), currentUser.getRole().name(),
                PageRequest.of(page, size, sort));

        return ResponseEntity.ok(ApiResponse.success("Clients retrieved", response));
    }

    @Operation(summary = "Assign or reassign an account manager to a client")
    @PatchMapping("/{clientId}/assign-manager")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ClientResponse>> assignManager(
            @PathVariable Long clientId,
            @Valid @RequestBody AssignManagerRequest request) {
        ClientResponse response = clientService.assignManager(clientId, request);
        return ResponseEntity.ok(ApiResponse.success("Manager assigned successfully", response));
    }
}
