package com.framewise.ipms.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClientRequest {

    @NotBlank(message = "Client name is required")
    private String clientName;

    @NotBlank(message = "Contact email is required")
    @Email(message = "Must be a valid email address")
    private String contactEmail;

    private String companyName;

    private Long accountManagerId;
}
