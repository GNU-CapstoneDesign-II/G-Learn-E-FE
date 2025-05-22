// src/hooks/useDownloadedIds.js
import { useState, useEffect, useCallback } from "react";

const KEY = "downloadedWorkbookIds";

export default function useDownloadedIds() {
    const [ids, setIds] = useState(() =>
        JSON.parse(localStorage.getItem(KEY) || "[]")
    );

    /** 새로 받은 id 들을 병합해 저장 */
    const add = useCallback((newIds) => {
        setIds((prev) => {
            const merged = Array.from(new Set([...prev, ...newIds]));
            localStorage.setItem(KEY, JSON.stringify(merged));
            return merged;
        });
    }, []);

    return { ids, add };
}
