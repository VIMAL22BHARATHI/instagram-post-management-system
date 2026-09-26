package com.framewise.ipms.service.impl;

import com.framewise.ipms.dto.request.ContentItemRequest;
import com.framewise.ipms.dto.response.ContentItemResponse;
import com.framewise.ipms.dto.response.PageResponse;
import com.framewise.ipms.entity.ContentItem;
import com.framewise.ipms.entity.ContentType;
import com.framewise.ipms.entity.User;
import com.framewise.ipms.exception.ResourceNotFoundException;
import com.framewise.ipms.exception.ValidationException;
import com.framewise.ipms.mapper.ContentItemMapper;
import com.framewise.ipms.repository.ContentItemRepository;
import com.framewise.ipms.repository.UserRepository;
import com.framewise.ipms.service.ContentItemService;
import com.framewise.ipms.util.FileStorageUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import com.framewise.ipms.service.ContentItemService;

@Slf4j
@Service
@RequiredArgsConstructor
public class ContentItemServiceImpl implements ContentItemService {

    private final ContentItemRepository contentItemRepository;
    private final UserRepository userRepository;
    private final ContentItemMapper contentItemMapper;
    private final FileStorageUtil fileStorageUtil;

    @Override
    @Transactional
    public ContentItemResponse upload(ContentItemRequest request, MultipartFile file, Long uploadedById) {
        if (file == null || file.isEmpty()) {
            throw new ValidationException("Media file is required");
        }

        User uploader = userRepository.findById(uploadedById)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + uploadedById));

        String storedUrl = fileStorageUtil.store(file, "content-library");

        ContentItem item = contentItemMapper.toEntity(request);
        item.setFilePath(storedUrl);
        item.setOriginalFileName(file.getOriginalFilename());
        item.setUploadedBy(uploader);
        item.setUsageCount(0L);
        item.setActive(true);

        contentItemRepository.save(item);
        log.info("Content item uploaded: id={}, uploadedBy={}", item.getContentId(), uploadedById);
        return contentItemMapper.toResponse(item);
    }

    @Override
    @Transactional(readOnly = true)
    public ContentItemResponse getById(Long contentId) {
        return contentItemMapper.toResponse(findById(contentId));
    }

    @Override
    @Transactional
    public ContentItemResponse update(Long contentId, ContentItemRequest request) {
        ContentItem item = findById(contentId);
        contentItemMapper.updateEntity(request, item);
        contentItemRepository.save(item);
        log.info("Content item updated: id={}", contentId);
        return contentItemMapper.toResponse(item);
    }

    @Override
    @Transactional
    public void delete(Long contentId) {
        ContentItem item = findById(contentId);
        item.setActive(false);
        contentItemRepository.save(item);
        log.info("Content item soft-deleted: id={}", contentId);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ContentItemResponse> search(String keyword, String tag, ContentType contentType,
                                                      Boolean isActive, Pageable pageable) {
        return PageResponse.of(
                contentItemRepository.search(keyword, tag, contentType, isActive, pageable)
                        .map(contentItemMapper::toResponse));
    }

    @Override
    @Transactional
    public ContentItemResponse incrementUsage(Long contentId) {
        ContentItem item = findById(contentId);
        item.setUsageCount(item.getUsageCount() + 1);
        contentItemRepository.save(item);
        return contentItemMapper.toResponse(item);
    }

    private ContentItem findById(Long contentId) {
        return contentItemRepository.findById(contentId)
                .orElseThrow(() -> new ResourceNotFoundException("Content item not found with id: " + contentId));
    }
}