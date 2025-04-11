import React from "react";
import styles from "./PrivateHeader.module.css";
import Checkbox from "./Checkbox.module";

export default function PrivateHeader({
    selectedFolder,
    selectedItems,
    sortOption,
    onSortChange,
    isSelectMode, // ✅ 추가
    onClearSelection,
    onBack,
    onToggleAll
}) {

    const totalCount = selectedFolder ? 2 : 3; // 예시 값, 실제 값은 props로 받아도 OK

    return (
        <div className={styles.header}>
            <div className={styles.left}>
                {selectedFolder ? (
                    <>
                        <button className={styles.backBtn} onClick={onBack}>◀</button>
                        <h2 className={styles.title}>{selectedFolder.name}</h2>
                    </>
                ) : (
                    <h2 className={styles.title}>private</h2>
                )}
            </div>

            <div className={styles.right}>
                <div className={styles["custom-select-wrapper"]}>
                    <select
                        className={styles["custom-select"]}
                        value={sortOption}
                        onChange={(e) => onSortChange(e.target.value)}
                    >
                        <option value="최신순">최신순</option>
                        <option value="오래된순">오래된순</option>
                        <option value="업로드순">업로드순</option>
                    </select>
                    <span className={styles["custom-arrow"]}>▼</span>
                </div>
                {isSelectMode && (
                    <>
                        <button className={styles.action}>업로드</button>
                        <button className={styles.action}>합치기</button>
                        <button className={styles.action}>이동</button>
                        <button className={styles.action}>삭제</button>
                        <span className={styles.count}>{selectedItems.length}개 선택</span>
                    </>
                )}
                {/* ✅ 전체 선택 체크박스 */}
                <div className={styles.checkboxContainer}>
                    <Checkbox
                        checked={selectedItems.length === totalCount}
                        onChange={() => {
                            if (!isSelectMode) {
                                onToggleAll(); // 초기화하면서 모드 진입
                            } else {
                                onToggleAll();
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
