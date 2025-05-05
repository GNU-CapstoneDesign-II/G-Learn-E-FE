import TabSwitcher from "./TabSwitcher";

export default function PrivateSidebar({ tab, setTab }) {
  return (
    <aside className="fixed top-[80px] left-0 w-[200px] h-[calc(100vh-80px)]
                      bg-white border-r-2 border-[#E6CEBA] p-5 flex flex-col">
      <TabSwitcher tab={tab} setTab={setTab} />

      {/* ─── Private 전용 메뉴 예시 ─── */}
      {/* <div className="text-sm text-[#5f360a]">📂 내 폴더</div> */}
      {/* 추가 메뉴는 여기서 자유롭게 */}
    </aside>
  );
}
