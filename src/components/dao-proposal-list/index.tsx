import React, { useEffect, useMemo } from "react";
import ReactLoading from "react-loading";
import Link from "next/link";
import { useQuery, gql } from "@apollo/client";
import Proposal from "./proposal";

const PROPOSALS_QUERY = gql`
  query Proposals($count: Int, $state: String) {
    proposals(
      first: $count
      skip: 0
      where: { space_in: ["landshare.eth"], state: $state }
      orderBy: "created"
      orderDirection: desc
    ) {
      id
      title
      body
      choices
      start
      end
      snapshot
      state
      author
      space {
        id
        name
      }
    }
  }
`;

interface DaoProposalsListProps {
  count: number;
  refreshCount: number;
}

export default function DaoProposalsList({ count, refreshCount }: DaoProposalsListProps) {
  const {
    data: activeProposals,
    loading: loadingActiveProposals,
    refetch: refetchActiveProposals,
  } = useQuery(PROPOSALS_QUERY, {
    variables: { count, state: "active" },
  });

  const {
    data: closedProposals,
    loading: loadingClosedProposals,
    refetch: refetchClosedProposals,
  } = useQuery(PROPOSALS_QUERY, {
    variables: { count, state: "closed" },
  });

  const {
    data: pendingProposals,
    loading: loadingPendingProposals,
    refetch: refetchPendingProposals,
  } = useQuery(PROPOSALS_QUERY, {
    variables: { count, state: "pending" },
  });

  const proposals = useMemo(() => {
    let result = [];
    if (pendingProposals?.proposals)
      result = pendingProposals?.proposals.concat();
    if (activeProposals?.proposals)
      result = result.concat(activeProposals?.proposals);
    if (closedProposals?.proposals)
      result = result.concat(closedProposals?.proposals);

    result = result.slice(0, count);

    return result;
  }, [
    activeProposals?.proposals,
    closedProposals?.proposals,
    pendingProposals?.proposals,
  ]);

  const loading = useMemo(
    () =>
      loadingActiveProposals ||
      loadingClosedProposals ||
      loadingPendingProposals,
    [loadingActiveProposals, loadingClosedProposals, loadingPendingProposals]
  );

  useEffect(() => {
    refetchPendingProposals({ count, state: "pending" });
    refetchActiveProposals({ count, state: "active" });
    refetchClosedProposals({ count, state: "closed" });
  }, [refreshCount]);

  return (
    <>
      <div className="flex w-full flex-col gap-[15px]">
        {loading ? (
          <div className="flex w-full justify-center">
            <ReactLoading type="cylon" color="#61cd81" />
          </div>
        ) : (
          proposals?.map((proposal: any) => (
            <Link
              href={`https://snapshot.org/#/landshare.eth/proposal/${proposal.id}`}
              target="_blank"
              key={proposal.id}
              className="w-full"
            >
              <Proposal proposal={proposal} />
            </Link>
          ))
        )}
      </div>
    </>
  );
};
