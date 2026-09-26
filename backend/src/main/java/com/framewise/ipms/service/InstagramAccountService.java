package com.framewise.ipms.service;

import com.framewise.ipms.dto.request.ConnectAccountRequest;
import com.framewise.ipms.dto.response.InstagramAccountResponse;
import com.framewise.ipms.dto.response.PageResponse;
import org.springframework.data.domain.Pageable;

public interface InstagramAccountService {

    InstagramAccountResponse connect(ConnectAccountRequest request, Long ownerId);

    void disconnect(Long accountId, Long requestingUserId, String requestingUserRole);

    InstagramAccountResponse getById(Long accountId, Long requestingUserId, String requestingUserRole);

    PageResponse<InstagramAccountResponse> list(String keyword, Boolean isConnected,
                                                Long ownerId, Long requestingUserId,
                                                String requestingUserRole, Pageable pageable);

    InstagramAccountResponse sync(Long accountId, Long requestingUserId, String requestingUserRole);
}
