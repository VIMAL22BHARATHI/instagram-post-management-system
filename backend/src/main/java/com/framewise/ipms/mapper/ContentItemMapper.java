package com.framewise.ipms.mapper;

import com.framewise.ipms.dto.request.ContentItemRequest;
import com.framewise.ipms.dto.response.ContentItemResponse;
import com.framewise.ipms.entity.ContentItem;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface ContentItemMapper {

    @Mapping(target = "uploadedById", source = "uploadedBy.id")
    @Mapping(target = "uploadedByName", source = "uploadedBy.fullName")
    ContentItemResponse toResponse(ContentItem item);

    @Mapping(target = "contentId", ignore = true)
    @Mapping(target = "uploadedBy", ignore = true)
    @Mapping(target = "filePath", ignore = true)
    @Mapping(target = "originalFileName", ignore = true)
    @Mapping(target = "usageCount", ignore = true)
    @Mapping(target = "active", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "updatedDate", ignore = true)
    ContentItem toEntity(ContentItemRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "contentId", ignore = true)
    @Mapping(target = "uploadedBy", ignore = true)
    @Mapping(target = "filePath", ignore = true)
    @Mapping(target = "originalFileName", ignore = true)
    @Mapping(target = "usageCount", ignore = true)
    @Mapping(target = "active", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "updatedDate", ignore = true)
    void updateEntity(
            ContentItemRequest request,
            @MappingTarget ContentItem item
    );
}