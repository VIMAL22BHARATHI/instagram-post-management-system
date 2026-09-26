package com.framewise.ipms.repository;

import com.framewise.ipms.entity.Campaign;
import com.framewise.ipms.entity.CampaignStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CampaignRepository
        extends JpaRepository<Campaign, Long>,
                JpaSpecificationExecutor<Campaign> {

    @EntityGraph(attributePaths = {"client", "createdBy"})
    @Query("""
            SELECT c FROM Campaign c
            WHERE (:keyword IS NULL
                   OR LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                   OR LOWER(c.description) LIKE LOWER(CONCAT('%', :keyword, '%')))
            AND (:status IS NULL OR c.status = :status)
            AND (:clientId IS NULL OR c.client.clientId = :clientId)
            """)
    Page<Campaign> search(
            @Param("keyword") String keyword,
            @Param("status") CampaignStatus status,
            @Param("clientId") Long clientId,
            Pageable pageable
    );
}