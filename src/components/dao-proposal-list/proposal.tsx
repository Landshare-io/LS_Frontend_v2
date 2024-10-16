import React, { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import Moment from "react-moment";
import "./Proposal.css";

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
      <div className="proposal-card border-2 border-[#e5e7eb] dark:border-[#494949] dark:hover:border-[#e5e7eb]" key={proposal.id}>
        <div className="header mb-3">
          <div className="user">
            <img
              src={`https://cdn.stamp.fyi/avatar/eth:${proposal.author}?s=3`}
              alt="avatar"
            />
            <div className="address text-tw-text-primary">
              {proposal.author.toString().substr(0, 6) +
                "..." +
                proposal.author.toString().substr(38, 40)}
            </div>

          </div>
          <div
            className="status-badge"
            style={{
              backgroundColor:
                proposal.state == "closed" ? "#803AED" : "#0FAB3B",
              textTransform: "capitalize",
            }}
          >
            {/* {proposal.state.charAt(0).toUpperCase() + proposal.state.slice(1)} */}
            {proposal.state}
          </div>
        </div>
        <div className="title">{proposal.title}</div>
        <div className="content text-tw-text-secondary">{proposal.body}</div>
        <div className="choices">
          {sumScores ? (
            proposal.choices.map((choice: string, index: number) => (
              <div className="choice" key={choice}>
                <div
                  className="percentage bg-tw-primary"
                  style={{
                    width: (scores[index]?.value / sumScores) * 100 + "%",
                  }}
                />
                <div className="label">
                  <div className="text-[#111111] dark:text-[#ebebeb]">{choice}</div>
                  <div className="text-tw-text-secondary">{scores[index]?.abbr} LAND</div>
                </div>
                <div className="value text-[#111111] dark:text-[#ebebeb]">
                  {isNaN(scores[index]?.value)
                    ? 0
                    : ((scores[index]?.value / sumScores) * 100).toFixed(2)}
                  %
                </div>
              </div>
            ))
          ) : (
            <div className="end">
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
