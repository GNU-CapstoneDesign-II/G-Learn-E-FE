// src/api/publicWorkbooksApi.js
import axios from "./axiosInstance";

/**
 * 공용 워크북 목록 조회 (전체 / 단과대 / 학과 / 과목 조건 & 페이징/정렬)
 */
/* 공용 워크북 목록 조회 공통 응답 형식
public record PublicWorkbookSearchResponse(
    PageInfo pageInfo,
    List<PublicWorkbook> publicWorkbooks
) {
    public static PublicWorkbookSearchResponse from(
        PageInfo pageInfo,
        List<PublicWorkbook> publicWorkbooks
    ) {
        return new PublicWorkbookSearchResponse(pageInfo, publicWorkbooks);
    }
}
public record PageInfo(
    Long totalElements,
    Integer totalPages,
    Integer pageNumber,
    boolean hasNextPage,
    boolean hasPreviousPage
) {
    public static PageInfo of(
        Long totalElements,
        Integer totalPages,
        Integer pageNumber,
        boolean hasNextPage,
        boolean hasPreviousPage
    ) {
        return new PageInfo(totalElements, totalPages, pageNumber, hasNextPage, hasPreviousPage);
    }
}

public record PublicWorkbook(
    Long id,
    String name,
    Integer coverImage,
    String createdAt,
    boolean downloaded
) {
    public static PublicWorkbook from(
        Workbook workbook, boolean downloaded
    ) {
        return new PublicWorkbook(
            workbook.getId(),
            workbook.getName(),
            workbook.getCoverImage(),
            workbook.getCreatedAt().toString(),
            downloaded
        );
    }
}

*/
export const getPublicWorkbooks = (page, size, sort, order) =>
    axios.get(`/api/folder/public/workbooks`, { params: { page, size, sort, order } });

export const getPublicWorkbooksByCollege = (collegeId, page, size, sort, order) =>
    axios.get(`/api/folder/public/workbooks/college/${collegeId}`, { params: { page, size, sort, order } });

export const getPublicWorkbooksByDepartment = (departmentId, page, size, sort, order) =>
    axios.get(`/api/folder/public/workbooks/department/${departmentId}`, { params: { page, size, sort, order } });

export const getPublicWorkbooksBySubject = (subjectId, page, size, sort, order) =>
    axios.get(`/api/folder/public/workbooks/subject/${subjectId}`, { params: { page, size, sort, order } });

/**
 * 워크북 검색 (전체 / 공개 / 비공개 범위, 키워드 종류, 페이징/정렬)
 */
export const searchWorkbooks = ({
  keyword,
  range = "all",
  type = "total",
  page = 0,
  size = 25,
  sort = "relevance",
  order = "desc",
}) =>
  axios.get("/api/search", {
    params: { keyword, range, type, page, size, sort, order },
  });
