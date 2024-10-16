import React, { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import Moment from "react-moment";

export default function Proposal({ proposal }: { proposal: any }) {
  const PROPOSAL_QUERY = gql`
    {
      proposal(id: "${proposal.id}") {
        id
        title
        body
        choices
        start
        end
        snapshot
        state
        author
        created
        scores
        scores_by_strategy
        scores_total
        scores_updated
        plugins
        network
        strategies {
          name
          network
          params
        }
        space {
          id
          name
        }
      }
    }
  `;
  const { data, loading, error } = useQuery(PROPOSAL_QUERY);
  const [scores, setScores] = useState<any[]>([]);
  const [sumScores, setSumScores] = useState(0);

  useEffect(() => {
    if (data?.proposal?.scores) {
      const nScores = [];
      let sScores = 0;
      for (let i = 0; i < data.proposal.scores.length; i++) {
        const s = data.proposal.scores[i];
        sScores += s;
        if (s > 10 ** 6) {
          nScores.push({ value: s, abbr: (s / 10 ** 6).toFixed(0) + "M" });
        } else if (s > 10 ** 3) {
          nScores.push({ value: s, abbr: (s / 10 ** 3).toFixed(0) + "K" });
        } else {
          nScores.push({ value: s, abbr: s.toFixed(0) });
        }
      }
      setSumScores(sScores);
      setScores(nScores);
    }
  }, [data]);

  return (
    <>
      <div className="proposal-card border-[2px] border-[#e5e7eb]  dark:border-[#494949] hover:border-[#6e6e6e] cursor-pointer duration-500 rounded-[14px] p-[24px]" key={proposal.id}>
        <div className="flex justify-between mb-[0.75rem]">
          <div className="flex items-center">
            <img
              src={`https://cdn.stamp.fyi/avatar/eth:${proposal.author}?s=3`}
              alt="avatar"
              className="w-[18px] h-[18px] rounded-full"
            />
            <div className="overflow-hidden text-ellipsis whitespace-nowrap px-[5px] text-text-primary">
              {proposal.author.toString().substr(0, 6) +
                "..." +
                proposal.author.toString().substr(38, 40)}
            </div>

          </div>
          <div className="bg-[#803aed] capitalize flex items-center text-[#fff] text-[14px] py-[2px] px-[10px] rounded-[14px] font-normal">
            {proposal.state}
          </div>
        </div>
        <div className="my-[8px] text-[22px] leading-[32px] font-semibold text-[#61cd81] tracking-wide">{proposal.title}</div>
        <div className="text-[17px] leading-[28px] font-normal break-words mb-[8px] line-clamp-2 text-text-secondary">{proposal.body}</div>
        <div className="flex flex-col gap-[5px]">
          {sumScores ? (
            proposal.choices.map((choice: string, index: number) => (
              <div className="relative flex justify-between py-[7px] px-[15px]" key={choice}>
                <div
                  className="absolute z-0 h-full top-0 left-0 rounded-[5px] bg-primary"
                  style={{
                    width: (scores[index]?.value / sumScores) * 100 + "%",
                  }}
                />
                <div className="flex relative z-[1] gap-[10px]">
                  <div className="text-[#111111] dark:text-[#ebebeb]">{choice}</div>
                  <div className="text-text-secondary">{scores[index]?.abbr} LAND</div>
                </div>
                <div className="relative z-[1] text-[#111111] dark:text-[#ebebeb]">
                  {isNaN(scores[index]?.value)
                    ? 0
                    : ((scores[index]?.value / sumScores) * 100).toFixed(2)}
                  %
                </div>
              </div>
            ))
          ) : (
            <div className="pt-[8px] text-[#586069] text-[16px]">
              <Moment
                interval={1000}
                date={new Date(proposal.end * 1000)}
                fromNow
                ago={proposal.end * 1000 > Date.now()}
              />
              {proposal.end * 1000 > Date.now() ? " left" : ""}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
