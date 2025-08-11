import React from "react";
import { BsCheck } from "react-icons/bs";

interface Activity {
  message: string;
  time: string;
}

const activities: Activity[] = [
  { message: 'Completed "Daily Quest" task', time: "Just now" },
  { message: 'Completed "Daily Quest" task', time: "5 Min ago" },
  { message: 'Completed "Daily Quest" task', time: "2 Week ago" },
  { message: 'Completed "Daily Quest" task', time: "2 Week ago" },
  { message: 'Completed "Daily Quest" task', time: "2 Week ago" },
  { message: 'Completed "Daily Quest" task', time: "2 Week ago" },
];

const RecentActivity: React.FC = () => {
  return (
    <div className="p-4 w-full rounded-3xl shadow-md border-[1px] border-text-third/40 dark:border-white/20 bg-secondary">
      <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
      <div className="flex flex-col gap-3">
        {activities.map((activity, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 bg-primary border-[1px] border-text-third/40 dark:border-white/20 p-2 rounded-xl shadow-sm"
          >
            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-500/20 text-primary-green">
              <BsCheck size={16} />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold">{activity.message}</span>
              <span className="text-gray-500 text-sm">{activity.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
