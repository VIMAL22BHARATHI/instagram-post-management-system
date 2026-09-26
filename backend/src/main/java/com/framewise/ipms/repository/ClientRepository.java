package com.framewise.ipms.repository;

import com.framewise.ipms.entity.Client;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ClientRepository extends JpaRepository<Client, Long>, JpaSpecificationExecutor<Client> {

    boolean existsByContactEmail(String contactEmail);

    @Query("""
            SELECT c FROM Client c
            WHERE (:keyword IS NULL
                   OR LOWER(c.clientName) LIKE LOWER(CONCAT('%', :keyword, '%'))
                   OR LOWER(c.contactEmail) LIKE LOWER(CONCAT('%', :keyword, '%'))
                   OR LOWER(c.companyName) LIKE LOWER(CONCAT('%', :keyword, '%')))
            AND (:isActive IS NULL OR c.isActive = :isActive)
            AND (:accountManagerId IS NULL OR c.accountManager.id = :accountManagerId)
            """)
    Page<Client> search(
            @Param("keyword") String keyword,
            @Param("isActive") Boolean isActive,
            @Param("accountManagerId") Long accountManagerId,
            Pageable pageable);
}
