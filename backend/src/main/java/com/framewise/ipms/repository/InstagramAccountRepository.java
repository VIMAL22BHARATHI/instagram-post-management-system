package com.framewise.ipms.repository;

import com.framewise.ipms.entity.InstagramAccount;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface InstagramAccountRepository
        extends JpaRepository<InstagramAccount, Long>,
                JpaSpecificationExecutor<InstagramAccount> {

    boolean existsByInstagramId(String instagramId);

    Optional<InstagramAccount> findByInstagramId(String instagramId);

    @Query("""
            SELECT a FROM InstagramAccount a
            WHERE (:keyword IS NULL
                   OR LOWER(a.username) LIKE LOWER(CONCAT('%', :keyword, '%'))
                   OR LOWER(a.instagramId) LIKE LOWER(CONCAT('%', :keyword, '%')))
            AND (:isConnected IS NULL OR a.isConnected = :isConnected)
            AND (:ownerId IS NULL OR a.owner.id = :ownerId)
            """)
    Page<InstagramAccount> search(
            @Param("keyword") String keyword,
            @Param("isConnected") Boolean isConnected,
            @Param("ownerId") Long ownerId,
            Pageable pageable);
}