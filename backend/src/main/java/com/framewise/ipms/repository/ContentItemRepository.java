package com.framewise.ipms.repository;

import com.framewise.ipms.entity.ContentItem;
import com.framewise.ipms.entity.ContentType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ContentItemRepository extends JpaRepository<ContentItem, Long>, JpaSpecificationExecutor<ContentItem> {

    @Query("""
            SELECT c FROM ContentItem c
            WHERE (:keyword IS NULL
                   OR LOWER(c.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
                   OR LOWER(c.description) LIKE LOWER(CONCAT('%', :keyword, '%')))
            AND (:tag IS NULL OR LOWER(c.tag) = LOWER(:tag))
            AND (:contentType IS NULL OR c.contentType = :contentType)
            AND (:isActive IS NULL OR c.isActive = :isActive)
            """)
    Page<ContentItem> search(
            @Param("keyword") String keyword,
            @Param("tag") String tag,
            @Param("contentType") ContentType contentType,
            @Param("isActive") Boolean isActive,
            Pageable pageable);
}
