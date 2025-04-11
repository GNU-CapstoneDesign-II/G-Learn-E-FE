import React from "react";
import styles from "./PrivateHeader.module.css";
import Checkbox from "./Checkbox.module";

export default function PrivateHeader({
    selectedFolder,
    selectedItems,
    sortOption,
    onSortChange,
    onClearSelection,
    onBack,
}) {
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

            {/* 오른쪽 요소들 순서 그대로! */}
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

                {selectedItems.length > 0 && (
                    <>
                        <button className={styles.action}>업로드</button>
                        <button className={styles.action}>합치기</button>
                        <button className={styles.action}>이동</button>
                        <button className={styles.action}>삭제</button>
                        <span className={styles.count}>{selectedItems.length}개 선택</span>
                    </>
                )}

                <Checkbox
                    checked={selectedItems.length > 0}
                    onChange={(e) => {
                        if (!e.target.checked) onClearSelection();
                    }}
                />
            </div>
        </div>

    );
}
