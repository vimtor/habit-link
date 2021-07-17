import { useRouter } from "next/router";
import useGoals from "../../hooks/use-goals";
import { useState } from "react";
import Layout from "../../components/layout";
import { PlusIcon } from "@heroicons/react/solid";
import LinkContainer from "../../components/link-container";
import CreateGoalModal from "../../components/create-goal-modal";
import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
import { Category } from "../../types/category";
import { Goal } from "../../types/goal";
import { formatEther } from "ethers/lib/utils";
import useWallet from "../../hooks/use-wallet";

dayjs.extend(calendar);

function calculatePercentageProgress(goal: Goal) {
    if (goal.category === Category.TOTAL_LESS || goal.category === Category.LESS) {
        if (goal.progress.sub(goal.initial).eq(0)) return 0;
        return goal.target.sub(goal.initial).div(goal.progress.sub(goal.initial)).toNumber();
    }
    if (goal.target.sub(goal.initial).eq(0)) return 0;
    return goal.progress.sub(goal.initial).div(goal.target.sub(goal.initial)).toNumber();
}

function GoalsPage() {
    const { query } = useRouter();
    const [search, setSearch] = useState("");
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const { goals, createGoal } = useGoals(query.user as string);
    const { connect, address } = useWallet();

    const isOwner = address === query.user;

    return (
        <Layout title={`Goals of ${query.user}`}>
            <button onClick={connect}>Connect</button>
            <div className="max-w-7xl px-3 mx-auto sm:px-6 lg:px-8 mt-16">
                <header className="flex justify-between items-center">
                    <h1 className="uppercase text-xl font-medium text-gray-500">{isOwner ? "Your Goals" : `Goals`}</h1>
                    <div className="flex items-center space-x-2">
                        <div>
                            <label htmlFor="search" className="sr-only">
                                Search
                            </label>
                            <input
                                type="text"
                                name="search"
                                id="search"
                                className="shadow-sm hidden focus:ring-blue-500 focus:border-blue-500 block w-42 sm:block sm:text-sm border-gray-300 rounded-md"
                                placeholder="Search..."
                                onChange={(event) => setSearch(event.target.value)}
                            />
                        </div>
                        {isOwner ? (
                            <>
                                <button
                                    type="button"
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    onClick={() => setCreateModalOpen(true)}
                                >
                                    <PlusIcon className="-ml-1 mr-3 h-5 w-5" aria-hidden="true" />
                                    Create Goal
                                </button>
                                <CreateGoalModal open={createModalOpen} onSave={createGoal} onClose={() => setCreateModalOpen(false)} />
                            </>
                        ) : null}
                    </div>
                </header>
                <section className="mt-10">
                    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {goals
                            .filter((goal) => goal.name.toLowerCase().includes(search.toLowerCase()))
                            .map((goal) => {
                                return (
                                    <li
                                        key={goal.name}
                                        className="col-span-1 bg-white transition hover:shadow-md overflow-hidden shadow rounded-lg sm:max-w-lg"
                                    >
                                        <LinkContainer href={`/${query.user}/${goal.name}`}>
                                            <div className="bg-blue-100 h-5">
                                                <div
                                                    role="progressbar"
                                                    aria-valuemin={goal.initial.toNumber()}
                                                    aria-valuemax={goal.target.toNumber()}
                                                    aria-valuenow={goal.progress.toNumber()}
                                                    aria-valuetext={goal.unit}
                                                    className="bg-blue-500 h-full"
                                                    style={{ width: `${calculatePercentageProgress(goal)}%` }}
                                                />
                                            </div>
                                            <div className="flex justify-between items-center bg-white p-4">
                                                <div>
                                                    <h2 className="text-xl capitalize text-gray-900">{goal.name}</h2>
                                                    <p className="text-gray-500 mt-1">{dayjs.unix(goal.deadline.toNumber()).calendar()}</p>
                                                </div>
                                                <p className="text-3xl text-gray-900 font-medium">{formatEther(goal.bounty)} ETH</p>
                                            </div>
                                        </LinkContainer>
                                    </li>
                                );
                            })}
                    </ul>
                </section>
            </div>
        </Layout>
    );
}

export default GoalsPage;
