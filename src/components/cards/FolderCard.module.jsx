import React from "react";
import styles from "./FolderCard.module.css";

const FolderIcon = () => (
    <svg
        className={styles.icon}
        viewBox="0 0 120 110"
        xmlns="http://www.w3.org/2000/svg"
    >
        {/* 1. 외곽 폴더 (덮개 + 본체 포함) */}
        <path
            d="
        M10 40
        Q10 25, 25 25
        H50
        Q55 25, 60 35
        H110
        Q115 35, 115 45
        V95
        Q115 100, 110 100
        H15
        Q10 100, 10 95
        Z
      "
            fill="#e5ccb3"
            stroke="#7c5e3c"
            strokeWidth="1.5"
        />

        {/* 2. 내부 사각형 (내용물) */}
        <rect
            x="10"
            y="48"
            width="105"   /* 외곽보다 살짝 여백 있게 */
            height="52"  /* 비율 유지 */
            rx="4"
            ry="4"
            fill="#c7a681"
            stroke="#7c5e3c"
            strokeWidth="1"
        />
    </svg>
);


export default function FolderCard({ folder, onClick }) {
    return (
        <div className={styles.card} onClick={onClick}>
            <FolderIcon />
            <span className={styles.name}>{folder.name}</span>
        </div>
    );
}
