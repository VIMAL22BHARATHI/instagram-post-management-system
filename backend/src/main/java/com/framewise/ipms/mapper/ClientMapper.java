package com.framewise.ipms.mapper;

import com.framewise.ipms.dto.request.ClientRequest;
import com.framewise.ipms.dto.response.ClientResponse;
import com.framewise.ipms.entity.Client;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface ClientMapper {

    @Mapping(target = "accountManagerId", source = "accountManager.id")
    @Mapping(target = "accountManagerName", source = "accountManager.fullName")
    ClientResponse toResponse(Client client);

    @Mapping(target = "clientId", ignore = true)
    @Mapping(target = "accountManager", ignore = true)
    @Mapping(target = "active", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "updatedDate", ignore = true)
    Client toEntity(ClientRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "clientId", ignore = true)
    @Mapping(target = "accountManager", ignore = true)
    @Mapping(target = "active", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "updatedDate", ignore = true)
    void updateEntity(ClientRequest request, @MappingTarget Client client);
}