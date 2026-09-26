package com.framewise.ipms.service.impl;

import com.framewise.ipms.dto.request.ContentTemplateRequest;
import com.framewise.ipms.dto.response.ContentTemplateResponse;
import com.framewise.ipms.dto.response.PageResponse;
import com.framewise.ipms.entity.ContentTemplate;
import com.framewise.ipms.entity.User;
import com.framewise.ipms.exception.ResourceNotFoundException;
import com.framewise.ipms.exception.UnauthorizedException;
import com.framewise.ipms.mapper.ContentTemplateMapper;
import com.framewise.ipms.repository.ContentTemplateRepository;
import com.framewise.ipms.repository.UserRepository;
import com.framewise.ipms.service.ContentTemplateService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ContentTemplateServiceImpl implements ContentTemplateService {

    private static final String ADMIN_ROLE = "ADMIN";

    private final ContentTemplateRepository contentTemplateRepository;
    private final UserRepository userRepository;
    private final ContentTemplateMapper contentTemplateMapper;

    @Override
    @Transactional
    public ContentTemplateResponse create(ContentTemplateRequest request, Long createdById) {
        User creator = userRepository.findById(createdById)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + createdById));

        ContentTemplate template = contentTemplateMapper.toEntity(request);
        template.setCreatedBy(creator);

        contentTemplateRepository.save(template);
        log.info("Content template created: id={}, createdBy={}", template.getTemplateId(), createdById);
        return contentTemplateMapper.toResponse(template);
    }

    @Override
    @Transactional(readOnly = true)
    public ContentTemplateResponse getById(Long templateId, Long requestingUserId, String requestingUserRole) {
        ContentTemplate template = findById(templateId);
        assertReadable(template, requestingUserId, requestingUserRole);
        return contentTemplateMapper.toResponse(template);
    }

    @Override
    @Transactional
    public ContentTemplateResponse update(Long templateId, ContentTemplateRequest request,
                                           Long requestingUserId, String requestingUserRole) {
        ContentTemplate template = findById(templateId);
        assertOwnerOrAdmin(template, requestingUserId, requestingUserRole);

        contentTemplateMapper.updateEntity(request, template);
        contentTemplateRepository.save(template);
        log.info("Content template updated: id={}", templateId);
        return contentTemplateMapper.toResponse(template);
    }

    @Override
    @Transactional
    public void delete(Long templateId, Long requestingUserId, String requestingUserRole) {
        ContentTemplate template = findById(templateId);
        assertOwnerOrAdmin(template, requestingUserId, requestingUserRole);

        contentTemplateRepository.delete(template);
        log.info("Content template deleted: id={}", templateId);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ContentTemplateResponse> search(String keyword, Boolean isPublic,
                                                          Long requestingUserId, String requestingUserRole,
                                                          Pageable pageable) {
        Long effectiveCreatedById = null;
        if (!ADMIN_ROLE.equals(requestingUserRole) && !Boolean.TRUE.equals(isPublic)) {
            effectiveCreatedById = requestingUserId;
        }

        return PageResponse.of(
                contentTemplateRepository.search(keyword, isPublic, effectiveCreatedById, pageable)
                        .map(contentTemplateMapper::toResponse));
    }

    private ContentTemplate findById(Long templateId) {
        return contentTemplateRepository.findById(templateId)
                .orElseThrow(() -> new ResourceNotFoundException("Content template not found with id: " + templateId));
    }

    private void assertReadable(ContentTemplate template, Long requestingUserId, String requestingUserRole) {
        boolean isOwner = template.getCreatedBy().getId().equals(requestingUserId);
        boolean isAdmin = ADMIN_ROLE.equals(requestingUserRole);
        if (!template.isPublic() && !isOwner && !isAdmin) {
            throw new UnauthorizedException("You do not have access to this template");
        }
    }

    private void assertOwnerOrAdmin(ContentTemplate template, Long requestingUserId, String requestingUserRole) {
        boolean isOwner = template.getCreatedBy().getId().equals(requestingUserId);
        boolean isAdmin = ADMIN_ROLE.equals(requestingUserRole);
        if (!isOwner && !isAdmin) {
            throw new UnauthorizedException("Only the template owner or an admin can modify this template");
        }
    }
}