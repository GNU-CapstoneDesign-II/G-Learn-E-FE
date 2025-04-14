import React from "react";
import styles from "./Checkbox.module.css";

export default function Checkbox({ checked, onChange }) {
    return (
        <label className={styles.checkboxWrapper}>
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className={styles.hiddenInput}
            />
            <span className={`${styles.box} ${checked ? styles.checked : ""}`}>
                ✓
            </span>
        </label>
    );
}
