package com.framewise.ipms.service;

import com.framewise.ipms.dto.request.AssignManagerRequest;
import com.framewise.ipms.dto.request.ClientRequest;
import com.framewise.ipms.dto.response.ClientResponse;
import com.framewise.ipms.dto.response.PageResponse;
import com.framewise.ipms.entity.User;
import org.springframework.data.domain.Pageable;

public interface ClientService {

    ClientResponse create(ClientRequest request);

    ClientResponse create(ClientRequest request, User currentUser);

    ClientResponse getById(Long clientId, Long requestingUserId, String requestingUserRole);

    ClientResponse update(Long clientId, ClientRequest request);

    void delete(Long clientId);

    PageResponse<ClientResponse> search(String keyword, Boolean isActive, Long accountManagerId,
                                        Long requestingUserId, String requestingUserRole,
                                        Pageable pageable);

    ClientResponse assignManager(Long clientId, AssignManagerRequest request);
}
