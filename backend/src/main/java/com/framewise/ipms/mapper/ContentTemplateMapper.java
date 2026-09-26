package com.framewise.ipms.mapper;

import com.framewise.ipms.dto.request.ContentTemplateRequest;
import com.framewise.ipms.dto.response.ContentTemplateResponse;
import com.framewise.ipms.entity.ContentTemplate;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface ContentTemplateMapper {

    @Mapping(target = "createdById", source = "createdBy.id")
    @Mapping(target = "createdByName", source = "createdBy.fullName")
    ContentTemplateResponse toResponse(ContentTemplate template);

    @Mapping(target = "templateId", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "updatedDate", ignore = true)
    ContentTemplate toEntity(ContentTemplateRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "templateId", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "updatedDate", ignore = true)
    void updateEntity(ContentTemplateRequest request, @MappingTarget ContentTemplate template);
}
