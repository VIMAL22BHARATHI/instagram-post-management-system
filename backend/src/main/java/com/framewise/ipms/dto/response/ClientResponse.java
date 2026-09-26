package com.framewise.ipms.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ClientResponse {

    private Long clientId;
    private String clientName;
    private String contactEmail;
    private String companyName;
    private boolean isActive;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;

    // Flattened account manager fields — avoids nested entity exposure
    private Long accountManagerId;
    private String accountManagerName;
}
