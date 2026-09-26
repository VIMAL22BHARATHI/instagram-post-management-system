package com.framewise.ipms.dto.response;

import com.framewise.ipms.entity.AccountType;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class InstagramAccountResponse {

    private Long accountId;
    private String username;
    private String instagramId;
    private AccountType accountType;
    private Long followersCount;
    private Long followingCount;
    private Long postsCount;
    private boolean isConnected;
    private LocalDateTime connectedDate;
    private LocalDateTime lastSync;
    private LocalDateTime createdDate;

    // Flattened owner fields
    private Long ownerId;
    private String ownerName;
}
