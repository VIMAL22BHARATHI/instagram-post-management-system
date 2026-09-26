package com.framewise.ipms.dto.response;

import lombok.Getter;
import org.springframework.data.domain.Page;

import java.util.List;

@Getter
public class PageResponse<T> {

    private final List<T> content;
    private final int page;
    private final int size;
    private final long totalElements;
    private final int totalPages;
    private final boolean last;

    private PageResponse(Page<T> page) {

        this.content = page.getContent();
        this.page = page.getNumber();
        this.size = page.getSize();
        this.totalElements = page.getTotalElements();
        this.totalPages = page.getTotalPages();
        this.last = page.isLast();
    }

    private PageResponse(List<T> content) {

        this.content = content;
        this.page = 0;
        this.size = content.size();
        this.totalElements = content.size();
        this.totalPages = content.isEmpty() ? 0 : 1;
        this.last = true;
    }

    public static <T> PageResponse<T> of(Page<T> page) {

        return new PageResponse<>(page);
    }

    public static <T> PageResponse<T> of(List<T> content) {

        return new PageResponse<>(content);
    }
}