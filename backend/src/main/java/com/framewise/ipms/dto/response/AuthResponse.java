package com.framewise.ipms.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AuthResponse {

    private String accessToken;
    private String refreshToken;
    private String message;

    public static AuthResponse of(String accessToken, String refreshToken) {
        AuthResponse r = new AuthResponse();
        r.accessToken = accessToken;
        r.refreshToken = refreshToken;
        return r;
    }

}
