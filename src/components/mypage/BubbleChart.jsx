/* ───────── BubbleChart.jsx ───────── */
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useNavigate } from "react-router-dom";

export default function BubbleChart({ nodes, width, height }) {
    const navigate = useNavigate();
    const svgRef = useRef(null);

    useEffect(() => {
        if (!nodes.length) return;

        /* ① SVG 초기화 */
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();
        svg
            .attr("viewBox", `0 0 ${width} ${height}`)
            .style("width", "100%")
            .style("height", "auto");

        /* ② blur filter */
        svg
            .append("defs")
            .append("filter")
            .attr("id", "edgeBlur")
            .attr("x", "-10%")
            .attr("y", "-10%")
            .attr("width", "120%")
            .attr("height", "120%")
            .append("feGaussianBlur")
            .attr("stdDeviation", 2);

        const g = svg.append("g");

        /* ③ drag 동작 */
        const drag = d3
            .drag()
            .on("start", (e, d) => {
                if (!e.active) sim.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            })
            .on("drag", (e, d) => {
                d.fx = e.x;
                d.fy = e.y;
            })
            .on("end", (e, d) => {
                if (!e.active) sim.alphaTarget(0.4).restart();
                d.fx = null;
                d.fy = null;
            });

        /* ④ 노드 그룹 */
        const node = g
            .selectAll("g")
            .data(nodes)
            .enter()
            .append("g");

        /* ── 본체 (드래그 결합) ── */
        node
            .append("circle")
            .attr("r", (d) => d.r)
            .attr("fill", (d) => d.fill)
            .call(drag) // ← 실제 드래그 대상
            .on("click", (_, d) => {
                // ✱ 클릭하면 키워드 페이지로
                navigate(`/keyword?kw=${encodeURIComponent(d.keyword)}&page=0&size=10`);
            })
            .on("mouseout", function () {
                d3.select(this).attr("filter", null);
            });

        /* ── halo ── */
        node
            .append("circle")
            .attr("r", (d) => d.r)
            .attr("fill", "none")
            .attr("stroke", (d) => d.fill)
            .attr("stroke-width", 8)
            .attr("filter", "url(#edgeBlur)")
            .attr("pointer-events", "none");

        /* ── 라벨 ── */
        node
            .append("text")
            .text((d) => d.keyword)
            .attr("fill", "#5F360A")
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "central")
            .style("font-size", "0.75rem")
            .style("font-weight", 600)
            .attr("pointer-events", "none");

        /* ⑤ force simulation */
        const CENTER_STRENGTH = 0.01;   // ↑ 키우면 더 빨리 모임
        const sim = d3
            .forceSimulation(nodes)
            .alpha(1)                      // 출발 에너지 ↑
            /*   X·Y 방향으로 직접 끌어당기는 힘   */
            .force("x", d3.forceX(width / 2).strength(CENTER_STRENGTH))
            .force("y", d3.forceY(height / 2).strength(CENTER_STRENGTH))
            .force("collide", d3.forceCollide().radius((d) => d.r + 2).iterations(2))
            .force("charge", d3.forceManyBody().strength(-6))   // 너무 튀지 않게 약화
            .on("tick", () => {
                node.attr("transform", (d) => `translate(${d.x},${d.y})`);
            });

        /* 클린업 */
        return () => sim.stop();
    }, [nodes, width, height]);

    return <svg ref={svgRef} />;
}
