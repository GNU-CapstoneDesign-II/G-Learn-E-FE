import React from "react";
import styles from "./DocumentCard.module.css";
import Checkbox from "../UseInPages/Checkbox.module";

const DocumentIcon = () => (
    <div className={styles.iconWrapper}>
        <svg
            className={styles.icon}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fill="#E9D9CA"
                d="M6 2C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2H6ZM13 9V3.5L18.5 9H13Z"
            />
        </svg>
    </div>
);


export default function DocumentCard({ title, isSelected, isSelectMode, onToggleSelect, onClick }) {
    return (
        <div className={styles.wrapper} onClick={onClick}>
            <div className={styles.card}>
                {isSelectMode && (
                    <div className={styles.checkboxWrapper}>
                        <Checkbox
                            checked={isSelected}
                            onChange={onToggleSelect}
                            className={styles.checkbox}
                        />
                    </div>
                )}
                <DocumentIcon />
            </div>
            <span className={styles.name}>{title}</span>
        </div>

    );
}
