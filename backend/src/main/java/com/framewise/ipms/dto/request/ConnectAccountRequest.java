package com.framewise.ipms.dto.request;

import com.framewise.ipms.entity.AccountType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ConnectAccountRequest {

    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Instagram ID is required")
    private String instagramId;

    /**
     * Stub token — real Graph API token exchange is out of scope.
     * Stored encrypted at rest via AesEncryptionConverter.
     */
    @NotBlank(message = "Access token is required")
    private String accessToken;

    @NotNull(message = "Account type is required")
    private AccountType accountType;
}
