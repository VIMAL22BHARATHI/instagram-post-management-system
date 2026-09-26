package com.framewise.ipms.mapper;

import com.framewise.ipms.dto.request.CampaignRequest;
import com.framewise.ipms.dto.response.CampaignResponse;
import com.framewise.ipms.entity.Campaign;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface CampaignMapper {

    @Mapping(target = "clientId", source = "client.clientId")
    @Mapping(target = "clientName", source = "client.clientName")
    @Mapping(target = "createdById", source = "createdBy.id")
    @Mapping(target = "createdByName", source = "createdBy.fullName")
    CampaignResponse toResponse(Campaign campaign);

    @Mapping(target = "campaignId", ignore = true)
    @Mapping(target = "client", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "totalPosts", ignore = true)
    @Mapping(target = "totalImpressions", ignore = true)
    @Mapping(target = "totalEngagements", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "updatedDate", ignore = true)
    @Mapping(target = "status", expression = "java(request.getStatus() != null ? request.getStatus() : com.framewise.ipms.entity.CampaignStatus.DRAFT)")
    Campaign toEntity(CampaignRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "campaignId", ignore = true)
    @Mapping(target = "client", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "totalPosts", ignore = true)
    @Mapping(target = "totalImpressions", ignore = true)
    @Mapping(target = "totalEngagements", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "updatedDate", ignore = true)
    void updateEntity(CampaignRequest request, @MappingTarget Campaign campaign);
}
