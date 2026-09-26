package com.framewise.ipms.entity;

import com.framewise.ipms.util.AesEncryptionConverter;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "instagram_accounts")
@Getter
@Setter
public class InstagramAccount extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long accountId;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false, unique = true)
    private String instagramId;

    @Convert(converter = AesEncryptionConverter.class)
    @Column(name = "access_token", columnDefinition = "TEXT")
    private String accessToken;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccountType accountType;

    private Long followersCount = 0L;
    private Long followingCount = 0L;
    private Long postsCount = 0L;

    @Column(nullable = false)
    private boolean isConnected = false;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    private LocalDateTime connectedDate;
    private LocalDateTime lastSync;
}
