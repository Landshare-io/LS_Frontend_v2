import React from "react";
import { BsArrowRight, BsCheck, BsChevronDown } from "react-icons/bs";
import { FaMagnifyingGlass } from "react-icons/fa6";

interface Task {
  task: string;
  description: string;
  requirement: string;
  reward: string;
  status: "go" | "completed" | "locked";
}

const tasks: Task[] = [
  {
    task: "Visit Landshare App",
    description: "Explore the main Landshare application.",
    requirement: "Visit app.landshare.io",
    reward: "10 LSP",
    status: "go",
  },
  {
    task: "Visit Landshare App",
    description: "Explore the main Landshare application.",
    requirement: "Visit app.landshare.io",
    reward: "10 LSP",
    status: "go",
  },
  {
    task: "Visit Landshare App",
    description: "Explore the main Landshare application.",
    requirement: "Visit app.landshare.io",
    reward: "10 LSP",
    status: "go",
  },
  {
    task: "Visit Landshare App",
    description: "Explore the main Landshare application.",
    requirement: "Visit app.landshare.io",
    reward: "10 LSP",
    status: "completed",
  },
  {
    task: "Visit Landshare App",
    description: "Explore the main Landshare application.",
    requirement: "Visit app.landshare.io",
    reward: "10 LSP",
    status: "locked",
  },
  {
    task: "Visit Landshare App",
    description: "Explore the main Landshare application.",
    requirement: "Visit app.landshare.io",
    reward: "10 LSP",
    status: "locked",
  },
];

const CampaignTasks: React.FC = () => {
  return (
    <div className="p-6 w-full bg-secondary border-[1px] border-text-third/40  dark:border-white/20 rounded-3xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Campaign Tasks</h2>
        <div className="flex items-center gap-2 text-text-primary cursor-pointer">
          <FaMagnifyingGlass />
          <span>View All</span>
          <BsChevronDown />
        </div>
      </div>

      <div className="hidden w-full md:grid gap-2 grid-cols-[18%_26%_18%_18%_18%] text-sm font-normal text-text-primary px-4 py-2">
        <span>Task</span>
        <span>Description</span>
        <span>Requirement</span>
        <span>LSP Reward</span>
        <span>Action</span>
      </div>

      {tasks.map((t, idx) => (
        <div
          key={idx}
          className={`grid grid-cols-1 md:grid-cols-[18%_26%_18%_18%_18%] gap-2 items-center p-4 border-[1px]  border-text-third/40 dark:border-white/20 bg-primary rounded-lg mb-2 ${
            t.status === "locked" ? "opacity-50" : ""
          }`}
        >
          <span className="font-semibold">{t.task}</span>
          <span className="text-gray-600 text-sm">{t.description}</span>
          <span className="text-sm text-green-600 underline cursor-pointer">
            {t.requirement}
          </span>
          <span className="text-sm">{t.reward}</span>
          <div className="flex justify-start ">
            {t.status === "go" && (
              <button className="flex items-center font-medium gap-1 bg-primary-green hover:bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                Go To App <BsArrowRight size={14} />
              </button>
            )}
            {t.status === "completed" && (
              <span className="flex items-center gap-1 bg-green-100 dark:bg-green-500/20 text-primary-green px-3 py-1 rounded-full text-sm">
                Completed <BsCheck size={14} />
              </span>
            )}
            {t.status === "locked" && (
              <span className="flex items-center gap-1 border border-gray-300 text-gray-400 px-3 py-1 rounded-full text-sm">
                Locked
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CampaignTasks;
