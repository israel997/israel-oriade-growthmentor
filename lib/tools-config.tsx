export type ToolMeta = {
  id: string;
  label: string;
  description: string;
  color: string;
  colorBg: string;
  colorBorder: string;
  icon: React.ReactNode;
};

export const TOOLS_META: ToolMeta[] = [
  {
    id: "smart_planner",
    label: "Smart Planner",
    description: "Calendrier intelligent pour planifier tes semaines et suivre tes objectifs.",
    color: "#3B82F6",
    colorBg: "rgba(59,130,246,0.1)",
    colorBorder: "rgba(59,130,246,0.25)",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
      </svg>
    ),
  },
];
