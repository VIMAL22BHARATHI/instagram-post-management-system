package com.framewise.ipms.service.impl;

import com.framewise.ipms.dto.request.ConnectAccountRequest;
import com.framewise.ipms.dto.response.InstagramAccountResponse;
import com.framewise.ipms.dto.response.PageResponse;
import com.framewise.ipms.entity.InstagramAccount;
import com.framewise.ipms.entity.Role;
import com.framewise.ipms.entity.User;
import com.framewise.ipms.exception.DuplicateResourceException;
import com.framewise.ipms.exception.ResourceNotFoundException;
import com.framewise.ipms.exception.UnauthorizedException;
import com.framewise.ipms.exception.ValidationException;
import com.framewise.ipms.mapper.InstagramAccountMapper;
import com.framewise.ipms.repository.InstagramAccountRepository;
import com.framewise.ipms.repository.UserRepository;
import com.framewise.ipms.service.InstagramAccountService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class InstagramAccountServiceImpl implements InstagramAccountService {

    private final InstagramAccountRepository accountRepository;
    private final UserRepository userRepository;
    private final InstagramAccountMapper accountMapper;

    @Override
    @Transactional
    public InstagramAccountResponse connect(
            ConnectAccountRequest request,
            Long ownerId) {

        if (accountRepository.existsByInstagramId(request.getInstagramId())) {
            throw new DuplicateResourceException(
                    "An account with Instagram ID '"
                            + request.getInstagramId()
                            + "' is already connected");
        }

        User owner = userRepository.findById(ownerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with id: " + ownerId));

        InstagramAccount account = accountMapper.toEntity(request);

        account.setOwner(owner);
        account.setConnected(true);
        account.setConnectedDate(LocalDateTime.now());

        accountRepository.save(account);

        log.info(
                "Instagram account connected: instagramId={}, owner={}",
                request.getInstagramId(),
                ownerId);

        return accountMapper.toResponse(account);
    }

    @Override
    @Transactional
    public void disconnect(
            Long accountId,
            Long requestingUserId,
            String requestingUserRole) {

        InstagramAccount account =
                findAndAssertAccess(
                        accountId,
                        requestingUserId,
                        requestingUserRole);

        account.setConnected(false);

        accountRepository.save(account);

        log.info(
                "Instagram account disconnected: accountId={}",
                accountId);
    }

    @Override
    @Transactional(readOnly = true)
    public InstagramAccountResponse getById(
            Long accountId,
            Long requestingUserId,
            String requestingUserRole) {

        return accountMapper.toResponse(
                findAndAssertAccess(
                        accountId,
                        requestingUserId,
                        requestingUserRole));
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<InstagramAccountResponse> list(
            String keyword,
            Boolean isConnected,
            Long ownerId,
            Long requestingUserId,
            String requestingUserRole,
            Pageable pageable) {

        // Authorized management roles (ADMIN, ACCOUNT_MANAGER, SOCIAL_MEDIA_MANAGER) see all accounts unless filtering by ownerId
        Long effectiveOwnerId =
                canManageAccounts(requestingUserRole)
                        ? ownerId
                        : requestingUserId;

        return PageResponse.of(
                accountRepository.search(
                                keyword,
                                isConnected,
                                effectiveOwnerId,
                                pageable)
                        .map(accountMapper::toResponse));
    }

    @Override
    @Transactional
    public InstagramAccountResponse sync(
            Long accountId,
            Long requestingUserId,
            String requestingUserRole) {

        InstagramAccount account =
                findAndAssertAccess(
                        accountId,
                        requestingUserId,
                        requestingUserRole);

        if (!account.isConnected()) {
            throw new ValidationException(
                    "Cannot sync a disconnected account");
        }

        // Stub: real Graph API call would refresh counts here.
        // For now we just update lastSync to signal the sync ran.
        account.setLastSync(LocalDateTime.now());

        accountRepository.save(account);

        log.info(
                "Instagram account synced (stub): accountId={}",
                accountId);

        return accountMapper.toResponse(account);
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    private InstagramAccount findAndAssertAccess(
            Long accountId,
            Long requestingUserId,
            String requestingUserRole) {

        InstagramAccount account =
                accountRepository.findById(accountId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Instagram account not found with id: "
                                                + accountId));

        if (!canManageAccounts(requestingUserRole)
                && !account.getOwner()
                        .getId()
                        .equals(requestingUserId)) {

            throw new UnauthorizedException(
                    "Access denied: account does not belong to you");
        }

        return account;
    }

    private boolean canManageAccounts(String role) {
        if (role == null) return false;
        String cleanRole = role.startsWith("ROLE_") ? role.substring(5) : role;
        return Role.ADMIN.name().equals(cleanRole)
                || Role.ACCOUNT_MANAGER.name().equals(cleanRole)
                || Role.SOCIAL_MEDIA_MANAGER.name().equals(cleanRole);
    }
}