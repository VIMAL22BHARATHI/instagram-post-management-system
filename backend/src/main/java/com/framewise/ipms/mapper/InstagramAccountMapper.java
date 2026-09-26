package com.framewise.ipms.mapper;

import com.framewise.ipms.dto.request.ConnectAccountRequest;
import com.framewise.ipms.dto.response.InstagramAccountResponse;
import com.framewise.ipms.entity.InstagramAccount;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface InstagramAccountMapper {

    @Mapping(target = "ownerId", source = "owner.id")
    @Mapping(target = "ownerName", source = "owner.fullName")
    InstagramAccountResponse toResponse(InstagramAccount account);

    @Mapping(target = "accountId", ignore = true)
    @Mapping(target = "owner", ignore = true)
    @Mapping(target = "connected", ignore = true)
    @Mapping(target = "followersCount", ignore = true)
    @Mapping(target = "followingCount", ignore = true)
    @Mapping(target = "postsCount", ignore = true)
    @Mapping(target = "connectedDate", ignore = true)
    @Mapping(target = "lastSync", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "updatedDate", ignore = true)
    InstagramAccount toEntity(ConnectAccountRequest request);
}