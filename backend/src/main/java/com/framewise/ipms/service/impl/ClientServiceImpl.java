package com.framewise.ipms.service.impl;

import com.framewise.ipms.dto.request.AssignManagerRequest;
import com.framewise.ipms.dto.request.ClientRequest;
import com.framewise.ipms.dto.response.ClientResponse;
import com.framewise.ipms.dto.response.PageResponse;
import com.framewise.ipms.entity.Client;
import com.framewise.ipms.entity.Role;
import com.framewise.ipms.entity.User;
import com.framewise.ipms.exception.DuplicateResourceException;
import com.framewise.ipms.exception.ResourceNotFoundException;
import com.framewise.ipms.exception.UnauthorizedException;
import com.framewise.ipms.mapper.ClientMapper;
import com.framewise.ipms.repository.ClientRepository;
import com.framewise.ipms.repository.UserRepository;
import com.framewise.ipms.service.ClientService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ClientServiceImpl implements ClientService {

    private final ClientRepository clientRepository;
    private final UserRepository userRepository;
    private final ClientMapper clientMapper;

    @Override
    @Transactional
    public ClientResponse create(ClientRequest request) {
        return create(request, null);
    }

    @Override
    @Transactional
    public ClientResponse create(ClientRequest request, User currentUser) {
        if (clientRepository.existsByContactEmail(request.getContactEmail())) {
            throw new DuplicateResourceException("A client with this contact email already exists");
        }

        Client client = clientMapper.toEntity(request);

        if (request.getAccountManagerId() != null) {
            client.setAccountManager(resolveAccountManager(request.getAccountManagerId()));
        } else if (currentUser != null && Role.ACCOUNT_MANAGER == currentUser.getRole()) {
            client.setAccountManager(currentUser);
        }

        clientRepository.save(client);
        log.info("Client created: id={}", client.getClientId());
        return clientMapper.toResponse(client);
    }

    @Override
    @Transactional(readOnly = true)
    public ClientResponse getById(Long clientId, Long requestingUserId, String requestingUserRole) {
        Client client = findClientById(clientId);
        assertCanAccess(client, requestingUserId, requestingUserRole);
        return clientMapper.toResponse(client);
    }

    @Override
    @Transactional
    public ClientResponse update(Long clientId, ClientRequest request) {
        Client client = findClientById(clientId);

        if (!client.getContactEmail().equals(request.getContactEmail())
                && clientRepository.existsByContactEmail(request.getContactEmail())) {
            throw new DuplicateResourceException("A client with this contact email already exists");
        }

        clientMapper.updateEntity(request, client);

        if (request.getAccountManagerId() != null) {
            client.setAccountManager(resolveAccountManager(request.getAccountManagerId()));
        }

        clientRepository.save(client);
        log.info("Client updated: id={}", clientId);
        return clientMapper.toResponse(client);
    }

    @Override
    @Transactional
    public void delete(Long clientId) {
        Client client = findClientById(clientId);
        client.setActive(false);
        clientRepository.save(client);
        log.info("Client soft-deleted: id={}", clientId);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ClientResponse> search(String keyword, Boolean isActive, Long accountManagerId,
                                               Long requestingUserId, String requestingUserRole,
                                               Pageable pageable) {
        // ACCOUNT_MANAGER sees only their own clients
        Long effectiveManagerId = Role.ACCOUNT_MANAGER.name().equals(requestingUserRole)
                ? requestingUserId
                : accountManagerId;

        return PageResponse.of(
                clientRepository.search(keyword, isActive, effectiveManagerId, pageable)
                        .map(clientMapper::toResponse));
    }

    @Override
    @Transactional
    public ClientResponse assignManager(Long clientId, AssignManagerRequest request) {
        Client client = findClientById(clientId);
        client.setAccountManager(resolveAccountManager(request.getAccountManagerId()));
        clientRepository.save(client);
        log.info("Client id={} assigned to manager id={}", clientId, request.getAccountManagerId());
        return clientMapper.toResponse(client);
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    private Client findClientById(Long clientId) {
        return clientRepository.findById(clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Client not found with id: " + clientId));
    }

    private User resolveAccountManager(Long managerId) {
        User manager = userRepository.findById(managerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + managerId));
        if (manager.getRole() != Role.ACCOUNT_MANAGER) {
            throw new com.framewise.ipms.exception.ValidationException(
                    "Assigned user must have the ACCOUNT_MANAGER role");
        }
        return manager;
    }

    private void assertCanAccess(Client client, Long requestingUserId, String requestingUserRole) {
        if (Role.ACCOUNT_MANAGER.name().equals(requestingUserRole)) {
            boolean owns = client.getAccountManager() != null
                    && client.getAccountManager().getId().equals(requestingUserId);
            if (!owns) {
                throw new UnauthorizedException("Access denied: client does not belong to you");
            }
        }
    }
}
