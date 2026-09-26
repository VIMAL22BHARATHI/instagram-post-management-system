package com.framewise.ipms.service;

import com.framewise.ipms.dto.request.ContentItemRequest;
import com.framewise.ipms.dto.response.ContentItemResponse;
import com.framewise.ipms.dto.response.PageResponse;
import com.framewise.ipms.entity.ContentType;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

public interface ContentItemService {

    ContentItemResponse upload(
            ContentItemRequest request,
            MultipartFile file,
            Long uploadedById
    );

    ContentItemResponse getById(Long contentId);

    ContentItemResponse update(
            Long contentId,
            ContentItemRequest request
    );

    void delete(Long contentId);

    PageResponse<ContentItemResponse> search(
            String keyword,
            String tag,
            ContentType contentType,
            Boolean isActive,
            Pageable pageable
    );

    ContentItemResponse incrementUsage(Long contentId);
}