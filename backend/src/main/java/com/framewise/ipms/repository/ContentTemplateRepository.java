package com.framewise.ipms.repository;

import com.framewise.ipms.entity.ContentTemplate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ContentTemplateRepository extends JpaRepository<ContentTemplate, Long>, JpaSpecificationExecutor<ContentTemplate> {

    @Query("""
            SELECT t FROM ContentTemplate t
            WHERE (:keyword IS NULL
                   OR LOWER(t.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
                   OR LOWER(t.description) LIKE LOWER(CONCAT('%', :keyword, '%')))
            AND (:isPublic IS NULL OR t.isPublic = :isPublic)
            AND (:createdById IS NULL OR t.createdBy.id = :createdById)
            """)
    Page<ContentTemplate> search(
            @Param("keyword") String keyword,
            @Param("isPublic") Boolean isPublic,
            @Param("createdById") Long createdById,
            Pageable pageable);
}
