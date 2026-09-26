package com.framewise.ipms.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AssignManagerRequest {

    @NotNull(message = "Account manager ID is required")
    private Long accountManagerId;
}
