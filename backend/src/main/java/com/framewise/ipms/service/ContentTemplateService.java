package com.framewise.ipms.service;

import com.framewise.ipms.dto.request.ContentTemplateRequest;
import com.framewise.ipms.dto.response.ContentTemplateResponse;
import com.framewise.ipms.dto.response.PageResponse;
import org.springframework.data.domain.Pageable;

public interface ContentTemplateService {

    ContentTemplateResponse create(ContentTemplateRequest request, Long createdById);

    ContentTemplateResponse getById(Long templateId, Long requestingUserId, String requestingUserRole);

    ContentTemplateResponse update(Long templateId, ContentTemplateRequest request,
                                   Long requestingUserId, String requestingUserRole);

    void delete(Long templateId, Long requestingUserId, String requestingUserRole);

    PageResponse<ContentTemplateResponse> search(String keyword, Boolean isPublic,
                                                 Long requestingUserId, String requestingUserRole,
                                                 Pageable pageable);
}
