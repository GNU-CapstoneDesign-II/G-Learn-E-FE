import React from "react";
import styles from "./AddCard.module.css";

export default function AddCard({ onClick }) {
    return (
        <div className={styles.wrapper} onClick={onClick}>
            <div className={styles.card}>
                <div className={styles.plusIcon}>＋</div>
            </div>
            <span className={styles.name}>추가하기</span>
        </div>
    );
}
