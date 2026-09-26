package com.framewise.ipms.entity;

import com.framewise.ipms.exception.ValidationException;
import com.fasterxml.jackson.annotation.JsonCreator;

public enum Role {
    ADMIN,
    ACCOUNT_MANAGER,
    SOCIAL_MEDIA_MANAGER,
    CONTENT_CREATOR,
    ANALYST,
    CLIENT,
    TEAM_MEMBER;

    @JsonCreator
    public static Role from(String value) {
        if (value == null) return null;
        String v = value.trim();
        if (v.startsWith("ROLE_")) {
            v = v.substring(5);
        }
        try {
            return Role.valueOf(v.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new ValidationException("Invalid role: " + value);
        }
    }
}
